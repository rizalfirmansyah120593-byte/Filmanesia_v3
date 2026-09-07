import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const envFile = await readFile('.env', 'utf8').catch(() => '');
const env = Object.fromEntries(envFile.split(/\r?\n/).map((line) => line.match(/^([A-Z0-9_]+)=(.*)$/)).filter(Boolean).map(([, key, value]) => [key, value]));
const siteUrl = (process.env.VITE_SITE_URL || env.VITE_SITE_URL || 'https://www.filmanesia.com').replace(/\/$/, '');
const apiKey = process.env.VITE_TMDB_API || env.VITE_TMDB_API;
const baseUrl = process.env.VITE_BASE_URL || env.VITE_BASE_URL || 'https://api.themoviedb.org/3';
const distDir = path.resolve('dist');

const slugify = (value = '') => value.toLowerCase()
  .replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-').replace(/-+/g, '-');

const escapeHtml = (value = '') => String(value)
  .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;').replaceAll("'", '&#039;');

const jsonLd = (value) => JSON.stringify(value).replaceAll('<', '\\u003c');

async function tmdb(endpoint, params = {}) {
  if (!apiKey) throw new Error('VITE_TMDB_API is not available');
  const url = new URL(`${baseUrl}${endpoint}`);
  url.searchParams.set('api_key', apiKey);
  url.searchParams.set('language', 'id-ID');
  Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, value));
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${response.status} ${endpoint}`);
  return response.json();
}

function detailPage(template, item, type) {
  const isTv = type === 'tv';
  const title = isTv ? item.name : item.title;
  const date = isTv ? item.first_air_date : item.release_date;
  const year = date?.slice(0, 4);
  const description = (item.overview || `Temukan informasi dan detail ${title} di Filmanesia.`).trim();
  const image = item.backdrop_path
    ? `https://image.tmdb.org/t/p/w1280${item.backdrop_path}`
    : item.poster_path ? `https://image.tmdb.org/t/p/w780${item.poster_path}` : `${siteUrl}/preview.png`;
  const slug = slugify(title);
  const route = `/${isTv ? 'series' : 'movies'}/watch/${slug}-${item.id}`;
  const canonical = `${siteUrl}${route}`;
  const schema = {
    '@context': 'https://schema.org',
    '@type': isTv ? 'TVSeries' : 'Movie',
    name: title,
    description,
    url: canonical,
    image: item.poster_path ? `https://image.tmdb.org/t/p/w780${item.poster_path}` : image,
    ...(date && { dateCreated: date }),
    ...(item.vote_average > 0 && item.vote_count > 0 && {
      aggregateRating: { '@type': 'AggregateRating', ratingValue: item.vote_average.toFixed(1), bestRating: 10, ratingCount: item.vote_count },
    }),
  };
  const metaTitle = `${title}${year ? ` (${year})` : ''} — ${isTv ? 'Series TV' : 'Film'} Indonesia | Filmanesia`;
  const content = `<main><article><h1>${escapeHtml(metaTitle)}</h1><p>${escapeHtml(description)}</p><p><a href="${canonical}">Lihat detail dan cara menonton ${escapeHtml(title)} di Filmanesia</a></p></article></main>`;
  return template
    .replace('<title>Filmanesia — Free Movie &amp; TV Show Streaming | Watch Online</title>', `<title>${escapeHtml(metaTitle)}</title>`)
    .replace(/<meta name="description"[\s\S]*?\/>/, `<meta name="description" content="${escapeHtml(description.slice(0, 155))}" />`)
    .replace('<link rel="canonical" href="https://www.filmanesia.com/" />', `<link rel="canonical" href="${canonical}" />`)
    .replace('<meta property="og:url" content="https://www.filmanesia.com/" />', `<meta property="og:url" content="${canonical}" />`)
    .replace('<meta property="og:title" content="Filmanesia — Free Movie &amp; TV Show Streaming" />', `<meta property="og:title" content="${escapeHtml(metaTitle)}" />`)
    .replace(/<meta property="og:description"[\s\S]*?\/>/, `<meta property="og:description" content="${escapeHtml(description.slice(0, 200))}" />`)
    .replace('<meta property="og:image" content="https://www.filmanesia.com/preview.png" />', `<meta property="og:image" content="${image}" />`)
    .replace('<div id="root"></div>', `<div id="root">${content}</div>`)
    .replace('</head>', `<script type="application/ld+json">${jsonLd(schema)}</script></head>`);
}

async function main() {
  const template = await readFile(path.join(distDir, 'index.html'), 'utf8');
  if (!apiKey) {
    console.warn('[prerender] Skipped: VITE_TMDB_API is missing.');
    return;
  }
  try {
    const [movies, series] = await Promise.all([
      tmdb('/trending/movie/week'),
      tmdb('/trending/tv/week'),
    ]);
    const pages = [
      ...(movies.results || []).slice(0, 20).map((item) => [item, 'movie']),
      ...(series.results || []).slice(0, 20).map((item) => [item, 'tv']),
    ].filter(([item]) => item?.id && (item.title || item.name));
    await Promise.all(pages.map(async ([item, type]) => {
      const name = type === 'tv' ? item.name : item.title;
      const route = path.join(distDir, type === 'tv' ? 'series' : 'movies', 'watch', `${slugify(name)}-${item.id}`);
      await mkdir(route, { recursive: true });
      await writeFile(path.join(route, 'index.html'), detailPage(template, item, type), 'utf8');
    }));
    console.log(`[prerender] Generated ${pages.length} trending detail pages.`);
  } catch (error) {
    console.warn(`[prerender] Skipped due to TMDB error: ${error.message}`);
  }
}

main();
