import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const sitemapPath = path.join(root, 'public', 'sitemap.xml');
const blogPath = path.join(root, 'src', 'pages', 'Home', 'BlogPage.jsx');
const site = 'https://www.filmanesia.com';

const read = (file) => fs.readFileSync(file, 'utf8');
const extract = (source, pattern) => [...source.matchAll(pattern)].map((match) => match[1]);

const current = fs.existsSync(sitemapPath)
  ? extract(read(sitemapPath), /<loc>([^<]+)<\/loc>/g)
    .filter((url) => !url.includes('/blog') && !/\/(?:movies|series)\/watch\//.test(url))
  : [];
const blogCards = extract(read(blogPath), /href:\s*['"](\/blog\/[^'"]+)['"]/g);
const infoPages = ['/tentang', '/kontak', '/syarat-ketentuan'];
const articleApi = (process.env.ARTICLES_API_URL || process.env.VITE_ARTICLES_API_URL || '').replace(/\/$/, '');
let remoteBlogUrls = [];
if (articleApi) {
  try {
    const response = await fetch(`${articleApi}/articles.php`);
    if (response.ok) {
      const data = await response.json();
      remoteBlogUrls = (data.items || []).map((article) => article.slug).filter(Boolean).map((slug) => `/blog/${slug}`);
    }
  } catch (error) {
    console.warn(`[sitemap] Remote articles unavailable: ${error.message}`);
  }
}
const urls = [...new Set([
  ...current,
  `${site}/blog`,
  ...blogCards.map((url) => `${site}${url}`),
  ...remoteBlogUrls.map((url) => `${site}${url}`),
  ...infoPages.map((url) => `${site}${url}`),
])].sort((a, b) => a.localeCompare(b));

const body = urls.map((url) => `  <url><loc>${url}</loc></url>`).join('\n');
fs.writeFileSync(sitemapPath, `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`);
console.log(`[sitemap] Generated ${urls.length} URLs (${urls.filter((url) => url.includes('/blog')).length} blog URLs)`);
