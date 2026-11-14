import { randomUUID } from 'node:crypto';
import { homedir } from 'node:os';
import { mkdir, open, readFile, rename, stat, unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import process from 'node:process';

const projectDirectory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const isHostedRuntime = process.env.NODE_ENV === 'production' || Boolean(process.env.PORT);
const defaultDataDirectory = isHostedRuntime
  ? path.join(homedir(), '.filmanesia', 'data')
  : path.join(projectDirectory, 'data');
const dataDirectory = path.resolve(process.env.ARTICLE_DATA_DIR || defaultDataDirectory);
const dataFile = path.join(dataDirectory, 'articles.json');
const legacyDataFile = path.join(projectDirectory, 'data', 'articles.json');
const seedFile = path.join(projectDirectory, 'data', 'articles.seed.json');
let fileQueue = Promise.resolve();

const delay = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

async function readJsonArray(filePath) {
  const value = JSON.parse(await readFile(filePath, 'utf8'));
  return Array.isArray(value) ? value : [];
}

async function readArticlesFromFile() {
  for (const filePath of new Set([dataFile, legacyDataFile, seedFile])) {
    try {
      return await readJsonArray(filePath);
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
    }
  }
  return [];
}

async function acquireFileLock(lockName, { waitTimeoutMs = 10000, staleAfterMs = 120000 } = {}) {
  await mkdir(dataDirectory, { recursive: true });
  const lockPath = path.join(dataDirectory, lockName);
  const lockId = randomUUID();
  const startedAt = Date.now();

  while (true) {
    let handle;
    try {
      handle = await open(lockPath, 'wx');
      await handle.writeFile(JSON.stringify({ id: lockId, pid: process.pid, createdAt: Date.now() }), 'utf8');
      await handle.close();
      return async () => {
        let owner;
        try {
          owner = JSON.parse(await readFile(lockPath, 'utf8'));
        } catch (error) {
          if (error.code === 'ENOENT') return;
          throw error;
        }
        if (owner.id === lockId) await unlink(lockPath);
      };
    } catch (error) {
      if (handle) {
        await handle.close();
        await unlink(lockPath).catch((cleanupError) => {
          if (cleanupError.code !== 'ENOENT') throw cleanupError;
        });
      }
      let lockAlreadyExists = error.code === 'EEXIST';
      if (error.code === 'EPERM') {
        try {
          await stat(lockPath);
          lockAlreadyExists = true;
        } catch (statError) {
          if (statError.code !== 'ENOENT') throw statError;
        }
      }
      if (!lockAlreadyExists) throw error;

      let lockStats;
      try {
        lockStats = await stat(lockPath);
      } catch (lockError) {
        if (lockError.code === 'ENOENT') continue;
        throw lockError;
      }
      if (Date.now() - lockStats.mtimeMs > staleAfterMs) {
        let owner;
        try {
          owner = JSON.parse(await readFile(lockPath, 'utf8'));
        } catch (lockError) {
          if (lockError.code !== 'ENOENT' && !(lockError instanceof SyntaxError)) throw lockError;
        }
        const ownerPid = Number(owner?.pid);
        let processIsRunning = Number.isSafeInteger(ownerPid) && ownerPid > 0;
        if (processIsRunning) {
          try {
            process.kill(ownerPid, 0);
          } catch (processError) {
            if (processError.code === 'ESRCH') processIsRunning = false;
            else throw processError;
          }
        }
        if (!processIsRunning) {
          await unlink(lockPath).catch((unlinkError) => {
            if (unlinkError.code !== 'ENOENT') throw unlinkError;
          });
          continue;
        }
      }

      if (Date.now() - startedAt >= waitTimeoutMs) return null;
      await delay(50);
    }
  }
}

async function withFileLock(operation) {
  const release = await acquireFileLock('articles.lock');
  if (!release) throw new Error('Timed out waiting for the article store lock.');
  try {
    return await operation();
  } finally {
    await release();
  }
}

async function writeArticlesToFile(articles) {
  await mkdir(dataDirectory, { recursive: true });
  const temporaryFile = `${dataFile}.${randomUUID()}.tmp`;
  try {
    await writeFile(temporaryFile, `${JSON.stringify(articles, null, 2)}\n`, { encoding: 'utf8', flag: 'wx' });
    await rename(temporaryFile, dataFile);
  } catch (error) {
    await unlink(temporaryFile).catch((cleanupError) => {
      if (cleanupError.code !== 'ENOENT') throw cleanupError;
    });
    throw error;
  }
}

async function mutateArticle(id, update) {
  return withFileLock(async () => {
    const articles = await readArticlesFromFile();
    const article = articles.find((item) => item.id === id);
    if (!article) throw new Error(`Article ${id} was not found while updating article storage.`);
    const result = await update(article);
    if (result === false) return false;
    await writeArticlesToFile(articles);
    return result;
  });
}

export async function readArticles() {
  return readArticlesFromFile();
}

export async function writeArticles(articles) {
  return withFileLock(() => writeArticlesToFile(articles));
}

export async function createArticle(article) {
  return withFileLock(async () => {
    const articles = await readArticlesFromFile();
    const existing = articles.find((item) => item.slug === article.slug || (article.tmdb_id && String(item.tmdb_id) === String(article.tmdb_id)));
    if (existing) return existing;
    const record = { id: `article-${Date.now()}`, created_at: new Date().toISOString(), ...article };
    await writeArticlesToFile([record, ...articles]);
    return record;
  });
}

export async function listPendingFacebookArticles() {
  return (await readArticlesFromFile()).filter((article) => article.facebook_status === 'pending');
}

export async function claimFacebookArticle(id) {
  return mutateArticle(id, (article) => {
    if (article.facebook_status !== 'pending') return false;
    article.facebook_status = 'publishing';
    article.facebook_error = '';
    return true;
  });
}

export async function completeFacebookArticle(id, postId) {
  await mutateArticle(id, (article) => {
    if (article.facebook_status !== 'publishing') throw new Error(`Article ${id} was not in the publishing state.`);
    article.facebook_status = 'published';
    article.facebook_post_id = postId;
    article.facebook_published_at = new Date().toISOString();
    article.facebook_error = '';
  });
}

export async function retryFacebookArticle(id, message) {
  await mutateArticle(id, (article) => {
    if (article.facebook_status !== 'publishing') throw new Error(`Article ${id} was not in the publishing state.`);
    article.facebook_status = 'pending';
    article.facebook_error = String(message).slice(0, 500);
  });
}

export async function acquireAutomationLock() {
  return acquireFileLock('article-automation.lock', {
    waitTimeoutMs: 0,
    staleAfterMs: 30 * 60 * 1000,
  });
}
