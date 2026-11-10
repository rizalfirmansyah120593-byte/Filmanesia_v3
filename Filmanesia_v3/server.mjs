import { createServer } from 'node:http';
import { spawn } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { extname, isAbsolute, join, normalize, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readArticles } from './scripts/article-store.mjs';

const root = resolve(fileURLToPath(new URL('.', import.meta.url)), 'dist');
const port = Number(process.env.PORT || 3000);
const automationToken = process.env.ARTICLE_AUTOMATION_TOKEN;
let generationInProgress = false;
const autoPublishEnabled = process.env.ARTICLE_AUTOPUBLISH_ENABLED === 'true';
const editorialPaths = new Set([
  'film-terbaru',
  'film-indonesia',
  'film-netflix',
  'film-horor',
  'film-berdasarkan-genre',
  'film-berdasarkan-tahun',
  'review-film',
  'jadwal-bioskop',
  'film-yang-akan-datang',
  'ending-explanation',
  'rekomendasi-film',
]);

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
};

function sendJson(response, status, payload) {
  response.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  response.end(JSON.stringify(payload));
}

function isAuthorized(request, url) {
  const headerToken = request.headers['x-automation-token'];
  const queryToken = url.searchParams.get('token');
  return Boolean(automationToken) && (headerToken === automationToken || queryToken === automationToken);
}

function generateArticle(response) {
  if (generationInProgress) return sendJson(response, 409, { error: 'Article generation already in progress.' });
  generationInProgress = true;
  const child = spawn(process.execPath, ['scripts/generate-article.mjs'], {
    cwd: resolve(fileURLToPath(new URL('.', import.meta.url))),
    env: process.env,
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  let output = '';
  let errorOutput = '';
  child.stdout.on('data', (chunk) => { output += chunk; });
  child.stderr.on('data', (chunk) => { errorOutput += chunk; });
  child.on('close', (code) => {
    generationInProgress = false;
    if (code === 0) return sendJson(response, 200, { ok: true, result: output.trim() });
    return sendJson(response, 500, { ok: false, error: errorOutput.trim() || `Generator exited with code ${code}.` });
  });
}

async function serveArticles(response, url) {
  const articles = await readArticles();
  if (url.pathname === '/api/articles' || url.pathname === '/api/articles.php') {
    return sendJson(response, 200, { items: articles });
  }
  const slug = url.searchParams.get('slug');
  const article = articles.find((item) => item.slug === slug);
  if (!article) return sendJson(response, 404, { error: 'Article not found.' });
  return sendJson(response, 200, article);
}

function isAppRoute(pathname) {
  if (pathname === '/' || /^\/(?:movies|series)(?:\/[^/]+){0,2}$/.test(pathname)) return true;
  if (/^\/(?:movie|tv)\/[^/]+$/.test(pathname)) return true;
  if (/^\/person\/[^/]+\/[^/]+$/.test(pathname)) return true;
  if (/^\/blog(?:\/[^/]+)?$/.test(pathname)) return true;
  if (/^\/jadwal-bioskop\/[^/]+$/.test(pathname)) return true;
  if (['/search', '/watchlist', '/trending-film', '/tentang', '/kontak', '/syarat-ketentuan'].includes(pathname)) return true;
  return editorialPaths.has(pathname.slice(1));
}

async function serveStatic(response, pathname) {
  const requested = pathname === '/' ? '/index.html' : pathname;
  const filePath = normalize(join(root, `.${requested}`));
  const relativePath = relative(root, filePath);
  if (relativePath === '..' || relativePath.startsWith(`..${sep}`) || isAbsolute(relativePath)) {
    return sendJson(response, 403, { error: 'Forbidden' });
  }
  try {
    const body = await readFile(filePath);
    response.writeHead(200, { 'Content-Type': mimeTypes[extname(filePath)] || 'application/octet-stream' });
    response.end(body);
  } catch {
    if (!isAppRoute(pathname)) {
      const notFound = await readFile(join(root, '404.html'));
      response.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      response.end(notFound);
      return;
    }
    const index = await readFile(join(root, 'index.html'));
    response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    response.end(index);
  }
}

async function autoPublishArticle() {
  if (!autoPublishEnabled || generationInProgress) return;
  const jakartaDate = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Jakarta' }).format(new Date());
  const articles = await readArticles();
  const publishedToday = articles.filter((article) => article.published_at?.slice(0, 10) === jakartaDate).length;
  if (publishedToday >= 2) return;

  generationInProgress = true;
  try {
    const { runGeneration } = await import('./scripts/generate-article.mjs');
    console.log(JSON.stringify({ automation: 'article', result: await runGeneration() }));
  } catch (error) {
    console.error(`[article automation] ${error.message}`);
  } finally {
    generationInProgress = false;
  }
}

if (autoPublishEnabled) {
  setTimeout(autoPublishArticle, 15000);
  setInterval(autoPublishArticle, 12 * 60 * 60 * 1000);
}

createServer((request, response) => {
  const url = new URL(request.url || '/', `http://${request.headers.host || 'localhost'}`);
  const host = request.headers.host?.split(':')[0].toLowerCase();
  if (host === 'filmanesia.com') {
    response.writeHead(301, { Location: `https://www.filmanesia.com${url.pathname}${url.search}` });
    return response.end();
  }
  if (url.pathname === '/health') return sendJson(response, 200, { ok: true });
  if (url.pathname === '/api/articles' || url.pathname === '/api/articles.php' || url.pathname === '/api/article' || url.pathname === '/api/article.php') {
    return serveArticles(response, url).catch((error) => sendJson(response, 500, { error: error.message }));
  }
  if (url.pathname === '/automation/generate') {
    if (request.method !== 'GET' && request.method !== 'POST') return sendJson(response, 405, { error: 'Use GET or POST.' });
    if (!isAuthorized(request, url)) return sendJson(response, 401, { error: 'Unauthorized.' });
    return generateArticle(response);
  }
  if (request.method !== 'GET' && request.method !== 'HEAD') return sendJson(response, 405, { error: 'Method not allowed.' });
  return serveStatic(response, url.pathname);
}).listen(port, '0.0.0.0', () => {
  console.log(`Filmanesia Node server listening on port ${port}`);
});
