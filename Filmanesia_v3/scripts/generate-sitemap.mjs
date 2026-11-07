import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const sitemapPath = path.join(root, 'public', 'sitemap.xml');
const blogPath = path.join(root, 'src', 'pages', 'Home', 'BlogPage.jsx');
const site = 'https://www.filmanesia.com';

const read = (file) => fs.readFileSync(file, 'utf8');
const extract = (source, pattern) => [...source.matchAll(pattern)].map((match) => match[1]);

const current = fs.existsSync(sitemapPath) ? extract(read(sitemapPath), /<loc>([^<]+)<\/loc>/g) : [];
const blogCards = extract(read(blogPath), /href:\s*['"](\/blog\/[^'"]+)['"]/g);
const infoPages = ['/tentang', '/kontak', '/syarat-ketentuan'];
const urls = [...new Set([
  ...current.filter((url) => !url.includes('/blog')),
  `${site}/blog`,
  ...blogCards.map((url) => `${site}${url}`),
  ...infoPages.map((url) => `${site}${url}`),
])].sort((a, b) => a.localeCompare(b));

const lastmod = new Date().toISOString().slice(0, 10);
const blogUrl = (url) => url.includes('/blog');
const body = urls.map((url) => `  <url><loc>${url}</loc><lastmod>${lastmod}</lastmod><changefreq>${blogUrl(url) ? 'monthly' : 'weekly'}</changefreq><priority>${url === `${site}/` ? '1.0' : blogUrl(url) ? '0.7' : '0.8'}</priority></url>`).join('\n');
fs.writeFileSync(sitemapPath, `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`);
console.log(`[sitemap] Generated ${urls.length} URLs (${urls.filter(blogUrl).length} blog URLs)`);
