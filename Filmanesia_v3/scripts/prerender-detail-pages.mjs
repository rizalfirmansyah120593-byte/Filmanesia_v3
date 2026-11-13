import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { PILLARS } from '../src/pages/Home/editorialPages.js';
import { FILM_ARTICLES, getFilmArticleDescription } from '../src/pages/Home/filmArticles.js';
import { GENRES, SPECIAL_CATEGORIES } from '../src/pages/Home/tmdb.js';
import { buildBrowsePath } from '../src/pages/Home/urlFilters.js';
import { getBrowseSeo } from '../src/pages/Home/seoBrowseLabels.js';

const envFile = await readFile('.env', 'utf8').catch(() => '');
const env = Object.fromEntries(envFile.split(/\r?\n/).map((line) => line.match(/^([A-Z0-9_]+)=(.*)$/)).filter(Boolean).map(([, key, value]) => [key, value]));
const siteUrl = (process.env.VITE_SITE_URL || env.VITE_SITE_URL || 'https://www.filmanesia.com').replace(/\/$/, '');
const apiKey = process.env.VITE_TMDB_API || env.VITE_TMDB_API;
const articleApi = (process.env.ARTICLES_API_URL || process.env.VITE_ARTICLES_API_URL || env.ARTICLES_API_URL || env.VITE_ARTICLES_API_URL || '').replace(/\/$/, '');
const baseUrl = process.env.VITE_BASE_URL || env.VITE_BASE_URL || 'https://api.themoviedb.org/3';
const distDir = path.resolve('dist');

const slugify = (value = '') => value.toLowerCase()
  .replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-').replace(/-+/g, '-');

const escapeHtml = (value = '') => String(value)
  .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;').replaceAll("'", '&#039;');

const jsonLd = (value) => JSON.stringify(value).replaceAll('<', '\\u003c');

function replaceMeta(html, attribute, key, content) {
  const pattern = new RegExp(`<meta\\s+${attribute}=["']${key}["'][^>]*>`, 'i');
  const tag = `<meta ${attribute}="${key}" content="${escapeHtml(content)}" />`;
  return pattern.test(html) ? html.replace(pattern, tag) : html.replace('</head>', `${tag}</head>`);
}

function replaceRootContent(html, content) {
  const opening = /<div id=["']root["'][^>]*>/i.exec(html);
  if (!opening) throw new Error('Unable to prerender: root element is missing from index.html');
  const contentStart = opening.index + opening[0].length;
  const noScriptStart = html.indexOf('<noscript', contentStart);
  const closing = noScriptStart < 0 ? -1 : html.lastIndexOf('</div>', noScriptStart);
  if (closing < contentStart) throw new Error('Unable to prerender: root element closing tag was not found');
  return `${html.slice(0, contentStart)}${content}${html.slice(closing)}`;
}

function pageHtml(template, { title, description, canonical, image, schema, content }) {
  let html = template.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(title)}</title>`);
  html = replaceMeta(html, 'name', 'description', description);
  html = replaceMeta(html, 'property', 'og:title', title);
  html = replaceMeta(html, 'property', 'og:description', description);
  html = replaceMeta(html, 'property', 'og:url', canonical);
  html = replaceMeta(html, 'property', 'og:image', image);
  html = replaceMeta(html, 'name', 'twitter:title', title);
  html = replaceMeta(html, 'name', 'twitter:description', description);
  html = replaceMeta(html, 'name', 'twitter:image', image);
  const canonicalTag = `<link rel="canonical" href="${escapeHtml(canonical)}" />`;
  const canonicalPattern = /<link\s+rel=["']canonical["'][^>]*>/i;
  html = canonicalPattern.test(html)
    ? html.replace(canonicalPattern, canonicalTag)
    : html.replace('</head>', `${canonicalTag}</head>`);
  html = html.replace('</head>', `<script type="application/ld+json">${jsonLd(schema)}</script></head>`);
  return replaceRootContent(html, content);
}

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
  const content = `<main><article><h1>${escapeHtml(metaTitle)}</h1><p>${escapeHtml(description)}</p><p><a href="${canonical}">Lihat detail dan informasi ${isTv ? 'serial' : 'film'} ${escapeHtml(title)} di Filmanesia</a></p></article></main>`;
  return pageHtml(template, {
    title: metaTitle,
    description: description.slice(0, 155),
    canonical,
    image,
    schema,
    content,
  });
}

function editorialPage(template, slug, page) {
  const canonical = `${siteUrl}/${slug}`;
  const related = Object.entries(PILLARS)
    .filter(([relatedSlug]) => relatedSlug !== slug)
    .slice(0, 6);
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: page.title,
    description: page.description,
    url: canonical,
    inLanguage: 'id-ID',
    isPartOf: { '@id': `${siteUrl}/#website` },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Beranda', item: `${siteUrl}/` },
        { '@type': 'ListItem', position: 2, name: page.title, item: canonical },
      ],
    },
  };
  const tips = page.tips.map((tip) => `<li>${escapeHtml(tip)}</li>`).join('');
  const relatedLinks = related.map(([relatedSlug, relatedPage]) => (
    `<li><a href="/${relatedSlug}">${escapeHtml(relatedPage.title)}</a></li>`
  )).join('');
  const content = `<main><article><nav aria-label="Breadcrumb"><a href="/">Beranda</a> / ${escapeHtml(page.title)}</nav><h1>${escapeHtml(page.title)}</h1><p>${escapeHtml(page.intro)}</p><section><h2>Hal yang perlu diperhatikan</h2><ul>${tips}</ul></section><section><h2>Jelajahi film</h2><p>Bandingkan film berdasarkan genre, tahun, popularitas, dan kebutuhan tontonan.</p><ul><li><a href="/movies">Film populer dan terbaru</a></li><li><a href="/series">Serial TV dan drama</a></li><li><a href="/movies/horror">Film horor</a></li></ul></section><section><h2>Panduan terkait</h2><ul>${relatedLinks}</ul></section></article></main>`;
  return pageHtml(template, {
    title: `${page.title} | Filmanesia`,
    description: page.description,
    canonical,
    image: `${siteUrl}/preview.png`,
    schema,
    content,
  });
}

function curatedArticlePage(template, slug, [title, keyword, films, intro]) {
  const canonical = `${siteUrl}/blog/${slug}`;
  const description = getFilmArticleDescription(slug, keyword, intro).slice(0, 155);
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    author: { '@type': 'Organization', name: 'Filmanesia' },
    publisher: { '@type': 'Organization', name: 'Filmanesia' },
    mainEntityOfPage: canonical,
    inLanguage: 'id-ID',
  };
  const filmList = films.map((film) => `<li>${escapeHtml(film)}</li>`).join('');
  const content = `<main><article><nav aria-label="Breadcrumb"><a href="/">Beranda</a> / <a href="/blog">Blog</a> / ${escapeHtml(title)}</nav><h1>${escapeHtml(title)}</h1><p>${escapeHtml(intro)}</p><p>Panduan ini membahas ${escapeHtml(keyword)} dan merangkum judul yang dapat dipertimbangkan sesuai genre serta suasana menonton.</p><section><h2>Rekomendasi pilihan</h2><ol>${filmList}</ol></section><p>Periksa sinopsis, rating usia, dan ketersediaan di layanan resmi sebelum menonton. <a href="/movies">Jelajahi katalog film Filmanesia</a>.</p></article></main>`;
  return pageHtml(template, {
    title: `${title} | Filmanesia`,
    description,
    canonical,
    image: `${siteUrl}/preview.png`,
    schema,
    content,
  });
}

function blogIndexPage(template) {
  const canonical = `${siteUrl}/blog`;
  const title = 'Blog Film dan Serial';
  const description = 'Baca review, rekomendasi, dan panduan film serta serial TV untuk menemukan tontonan berikutnya.';
  const articleLinks = Object.entries(FILM_ARTICLES)
    .map(([slug, [articleTitle]]) => `<li><a href="/blog/${slug}">${escapeHtml(articleTitle)}</a></li>`)
    .join('');
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: title,
    description,
    url: canonical,
    inLanguage: 'id-ID',
  };
  const content = `<main><article><h1>Cerita film yang layak dibaca</h1><p>${escapeHtml(description)}</p><h2>Review dan rekomendasi film</h2><ul>${articleLinks}</ul><p><a href="/movies">Jelajahi katalog film</a> atau <a href="/series">serial TV populer</a>.</p></article></main>`;
  return pageHtml(template, {
    title: `${title} | Filmanesia`,
    description,
    canonical,
    image: `${siteUrl}/preview.png`,
    schema,
    content,
  });
}

function browsePage(template, type, genre) {
  const { title, description, heading } = getBrowseSeo(type, genre);
  const route = buildBrowsePath(type, genre?.id ?? null);
  const canonical = `${siteUrl}${route}`;
  const categories = [...GENRES[type], ...SPECIAL_CATEGORIES[type]];
  const categoryLinks = categories.map((category) => {
    const categoryPage = getBrowseSeo(type, category);
    const categoryPath = buildBrowsePath(type, category.id);
    return `<li><a href="${categoryPath}">${escapeHtml(categoryPage.heading)}</a></li>`;
  }).join('');
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: title,
    description,
    url: canonical,
    inLanguage: 'id-ID',
    isPartOf: { '@id': `${siteUrl}/#website` },
  };
  const content = `<main><article><nav aria-label="Breadcrumb"><a href="/">Beranda</a> / ${escapeHtml(heading)}</nav><h1>${escapeHtml(heading)}</h1><p>${escapeHtml(description)}</p><p>Telusuri pilihan berdasarkan genre, rating, dan popularitas. Buka kategori yang sesuai untuk mempersempit pilihan tontonan.</p><section><h2>Pilih genre ${type === 'movie' ? 'film' : 'serial TV'}</h2><ul>${categoryLinks}</ul></section><p><a href="/blog">Baca rekomendasi dan panduan film</a></p></article></main>`;
  return { route, html: pageHtml(template, { title: `${title} | Filmanesia`, description, canonical, image: `${siteUrl}/preview.png`, schema, content }) };
}

function articlePage(template, article) {
  const slug = String(article.slug || '');
  if (!/^[a-z0-9][a-z0-9-]*$/.test(slug)) return null;
  const title = String(article.title || '').trim();
  if (!title) return null;
  if (!article.content && !article.content_html && !article.excerpt) return null;
  const canonical = `${siteUrl}/blog/${slug}`;
  const imageCandidate = article.poster_url || article.image_url || `${siteUrl}/preview.png`;
  let image = `${siteUrl}/preview.png`;
  try {
    const parsedImage = new URL(imageCandidate, siteUrl);
    if (parsedImage.protocol === 'https:' || parsedImage.protocol === 'http:') image = parsedImage.href;
  } catch {
    image = `${siteUrl}/preview.png`;
  }
  const rawContent = String(article.content || article.content_html || '');
  const paragraphs = rawContent
    .replace(/<(script|style|iframe|object)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, ' ')
    .replace(/<\/(?:p|h[1-6]|li|section|div|blockquote)>/gi, '\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;|&#160;/gi, ' ')
    .replace(/&quot;|&#34;/gi, '"').replace(/&apos;|&#39;/gi, "'")
    .replace(/&amp;/gi, '&').replace(/&lt;/gi, '<').replace(/&gt;/gi, '>')
    .split(/\r?\n/)
    .map((paragraph) => paragraph.replace(/\s+/g, ' ').trim())
    .filter(Boolean);
  const description = String(article.meta_description || article.excerpt || paragraphs[0] || title)
    .replace(/\s+/g, ' ').trim().slice(0, 155);
  const publishedAt = typeof article.published_at === 'string' && !Number.isNaN(Date.parse(article.published_at))
    ? article.published_at
    : null;
  const content = `<main><article><nav aria-label="Breadcrumb"><a href="/">Beranda</a> / <a href="/blog">Blog</a> / ${escapeHtml(title)}</nav><h1>${escapeHtml(title)}</h1>${article.excerpt ? `<p>${escapeHtml(article.excerpt)}</p>` : ''}${paragraphs.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join('')}<p><a href="/blog">Baca panduan film lainnya di Filmanesia</a></p></article></main>`;
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    image,
    ...(publishedAt && { datePublished: publishedAt }),
    author: { '@type': 'Organization', name: 'Filmanesia' },
    publisher: { '@type': 'Organization', name: 'Filmanesia' },
    mainEntityOfPage: canonical,
    inLanguage: 'id-ID',
  };
  return { slug, html: pageHtml(template, { title: `${title} | Filmanesia`, description, canonical, image, schema, content }) };
}

async function loadBlogArticles() {
  if (articleApi) {
    const response = await fetch(`${articleApi}/articles.php`);
    if (!response.ok) throw new Error(`Articles API returned ${response.status}`);
    const data = await response.json();
    if (!Array.isArray(data.items)) throw new Error('Articles API response has no items array');
    return data.items;
  }
  return JSON.parse(await readFile(path.resolve('data/articles.seed.json'), 'utf8'));
}

async function main() {
  const template = await readFile(path.join(distDir, 'index.html'), 'utf8');
  await Promise.all(Object.entries(PILLARS).map(async ([slug, page]) => {
    const route = path.join(distDir, slug);
    await mkdir(route, { recursive: true });
    await writeFile(path.join(route, 'index.html'), editorialPage(template, slug, page), 'utf8');
  }));
  console.log(`[prerender] Generated ${Object.keys(PILLARS).length} editorial landing pages.`);
  const browsePages = ['movie', 'tv'].flatMap((type) => [
    { type, genre: null },
    ...[...GENRES[type], ...SPECIAL_CATEGORIES[type]].map((genre) => ({ type, genre })),
  ]).map(({ type, genre }) => browsePage(template, type, genre));
  await Promise.all(browsePages.map(async ({ route, html }) => {
    const routeDirectory = path.join(distDir, ...route.split('/').filter(Boolean));
    await mkdir(routeDirectory, { recursive: true });
    await writeFile(path.join(routeDirectory, 'index.html'), html, 'utf8');
  }));
  console.log(`[prerender] Generated ${browsePages.length} localized browse pages.`);
  await Promise.all(Object.entries(FILM_ARTICLES).map(async ([slug, article]) => {
    const route = path.join(distDir, 'blog', slug);
    await mkdir(route, { recursive: true });
    await writeFile(path.join(route, 'index.html'), curatedArticlePage(template, slug, article), 'utf8');
  }));
  await writeFile(path.join(distDir, 'blog', 'index.html'), blogIndexPage(template), 'utf8');
  console.log(`[prerender] Generated ${Object.keys(FILM_ARTICLES).length} curated blog pages.`);
  try {
    const articles = await loadBlogArticles();
    const blogPages = articles
      .filter((article) => article && typeof article === 'object' && (!article.status || article.status === 'published'))
      .map((article) => articlePage(template, article))
      .filter(Boolean);
    await Promise.all(blogPages.map(async ({ slug, html }) => {
      const route = path.join(distDir, 'blog', slug);
      await mkdir(route, { recursive: true });
      await writeFile(path.join(route, 'index.html'), html, 'utf8');
    }));
    const sitemapPath = path.join(distDir, 'sitemap.xml');
    const sitemap = await readFile(sitemapPath, 'utf8');
    const sitemapUrls = new Set(extractSitemapUrls(sitemap));
    Object.keys(FILM_ARTICLES).forEach((slug) => sitemapUrls.add(`${siteUrl}/blog/${slug}`));
    blogPages.forEach(({ slug }) => sitemapUrls.add(`${siteUrl}/blog/${slug}`));
    const sitemapBody = [...sitemapUrls].sort((a, b) => a.localeCompare(b))
      .map((url) => `  <url><loc>${url}</loc></url>`).join('\n');
    await writeFile(sitemapPath, `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapBody}\n</urlset>\n`, 'utf8');
    console.log(`[prerender] Generated ${blogPages.length} published blog pages.`);
  } catch (error) {
    console.warn(`[prerender] Blog pages unavailable: ${error.message}`);
  }
  const sitemapPath = path.join(distDir, 'sitemap.xml');
  const sitemap = await readFile(sitemapPath, 'utf8');
  const staticUrls = new Set(extractSitemapUrls(sitemap));
  Object.keys(PILLARS).forEach((slug) => staticUrls.add(`${siteUrl}/${slug}`));
  Object.keys(FILM_ARTICLES).forEach((slug) => staticUrls.add(`${siteUrl}/blog/${slug}`));
  browsePages.forEach(({ route }) => staticUrls.add(`${siteUrl}${route}`));
  const staticSitemapBody = [...staticUrls].sort((a, b) => a.localeCompare(b))
    .map((url) => `  <url><loc>${url}</loc></url>`).join('\n');
  await writeFile(sitemapPath, `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${staticSitemapBody}\n</urlset>\n`, 'utf8');
  if (!apiKey) {
    console.warn('[prerender] Skipped: VITE_TMDB_API is missing.');
    return;
  }
  try {
    const [movies, series, trending] = await Promise.all([
      tmdb('/trending/movie/week'),
      tmdb('/trending/tv/week'),
      tmdb('/trending/all/week'),
    ]);
    const initialHero = (trending.results || []).find((item) => item?.backdrop_path && (item.title || item.name) && item.overview);
    if (initialHero) {
      const smallImage = `https://image.tmdb.org/t/p/w500${initialHero.backdrop_path}`;
      const largeImage = `https://image.tmdb.org/t/p/w780${initialHero.backdrop_path}`;
      const preload = `<link rel="preload" as="image" href="${smallImage}" imagesrcset="${smallImage} 500w, ${largeImage} 780w" imagesizes="100vw" fetchpriority="high" />`;
      const initialHeroScript = `<script>window.__FILMANESIA_INITIAL_HERO__=${jsonLd(initialHero)};</script>`;
      const homeTemplate = template
        .replace('</head>', `${preload}</head>`)
        .replace('</body>', `${initialHeroScript}</body>`);
      await writeFile(path.join(distDir, 'index.html'), homeTemplate, 'utf8');
    }
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
    const sitemapPath = path.join(distDir, 'sitemap.xml');
    const sitemap = await readFile(sitemapPath, 'utf8');
    const sitemapUrls = new Set(extractSitemapUrls(sitemap));
    Object.keys(PILLARS).forEach((slug) => sitemapUrls.add(`${siteUrl}/${slug}`));
    pages.forEach(([item, type]) => {
      const name = type === 'tv' ? item.name : item.title;
      sitemapUrls.add(`${siteUrl}/${type === 'tv' ? 'series' : 'movies'}/watch/${slugify(name)}-${item.id}`);
    });
    const sitemapBody = [...sitemapUrls].sort((a, b) => a.localeCompare(b))
      .map((url) => `  <url><loc>${url}</loc></url>`).join('\n');
    const updatedSitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapBody}\n</urlset>\n`;
    await writeFile(sitemapPath, updatedSitemap, 'utf8');
    await writeFile(path.resolve('public', 'sitemap.xml'), updatedSitemap, 'utf8');
    console.log(`[prerender] Generated ${pages.length} trending detail pages.`);
    console.log(`[sitemap] Added ${pages.length} prerendered detail pages.`);
  } catch (error) {
    console.warn(`[prerender] Skipped due to TMDB error: ${error.message}`);
  }
}

function extractSitemapUrls(sitemap) {
  return [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
}

main();
