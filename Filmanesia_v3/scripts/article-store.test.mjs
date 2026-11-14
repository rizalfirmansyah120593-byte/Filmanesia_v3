import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { after, test } from 'node:test';

const temporaryDirectory = await mkdtemp(path.join(os.tmpdir(), 'filmanesia-article-store-'));
process.env.ARTICLE_DATA_DIR = path.join(temporaryDirectory, 'data');
delete process.env.DATABASE_URL;

const store = await import('./article-store.mjs');
after(() => rm(temporaryDirectory, { recursive: true, force: true }));

test('stores articles and atomically claims Facebook publication', async () => {
  const article = await store.createArticle({
    id: 'article-test-store',
    slug: 'article-test-store',
    title: 'Artikel uji penyimpanan',
    excerpt: 'Ringkasan uji',
    content: '<p>Konten uji</p>',
    status: 'published',
    published_at: new Date().toISOString(),
    facebook_status: 'pending',
  });

  assert.equal(article.id, 'article-test-store');
  assert.equal(await store.claimFacebookArticle(article.id), true);
  assert.equal(await store.claimFacebookArticle(article.id), false);
  await store.completeFacebookArticle(article.id, 'page-post-123');
  assert.deepEqual(await store.listPendingFacebookArticles(), []);

  const backfillArticles = [
    { id: 'backfill-old', published_at: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString() },
    { id: 'backfill-recent-1', published_at: new Date(Date.now() - 2000).toISOString() },
    { id: 'backfill-recent-2', published_at: new Date().toISOString() },
  ];
  for (const candidate of backfillArticles) {
    await store.createArticle({
      ...candidate,
      slug: candidate.id,
      title: candidate.id,
      excerpt: 'Ringkasan uji',
      status: 'published',
    });
  }
  const jakartaDate = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Jakarta' }).format(new Date());
  assert.equal(await store.queueFacebookArticlesForDate(jakartaDate, 2), 2);
  assert.deepEqual(
    (await store.listPendingFacebookArticles()).map((item) => item.id).sort(),
    ['backfill-recent-1', 'backfill-recent-2'],
  );

  await Promise.all(Array.from({ length: 5 }, (_, index) => store.createArticle({
    id: `article-concurrent-${index}`,
    slug: `article-concurrent-${index}`,
    tmdb_id: `tmdb-${index}`,
    title: `Artikel bersamaan ${index}`,
    excerpt: 'Ringkasan uji',
    content: '<p>Konten uji</p>',
    status: 'published',
    published_at: new Date().toISOString(),
  })));
  assert.equal((await store.readArticles()).length, 10);

  const saved = JSON.parse(await readFile(path.join(process.env.ARTICLE_DATA_DIR, 'articles.json'), 'utf8'));
  const storedArticle = saved.find((item) => item.id === article.id);
  assert.equal(storedArticle.facebook_status, 'published');
  assert.equal(storedArticle.facebook_post_id, 'page-post-123');
});
