import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const dataDirectory = path.resolve('data');
const dataFile = path.join(dataDirectory, 'articles.json');
const seedFile = path.join(dataDirectory, 'articles.seed.json');

export async function readArticles() {
  try {
    const value = JSON.parse(await readFile(dataFile, 'utf8'));
    return Array.isArray(value) ? value : [];
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
    try {
      const seed = JSON.parse(await readFile(seedFile, 'utf8'));
      return Array.isArray(seed) ? seed : [];
    } catch (seedError) {
      if (seedError.code === 'ENOENT') return [];
      throw seedError;
    }
  }
}

export async function writeArticles(articles) {
  await mkdir(dataDirectory, { recursive: true });
  await writeFile(dataFile, `${JSON.stringify(articles, null, 2)}\n`, 'utf8');
}

export async function createArticle(article) {
  const articles = await readArticles();
  const existing = articles.find((item) => item.slug === article.slug || String(item.tmdb_id) === String(article.tmdb_id));
  if (existing) return existing;
  const record = { id: `article-${Date.now()}`, created_at: new Date().toISOString(), ...article };
  await writeArticles([record, ...articles]);
  return record;
}
