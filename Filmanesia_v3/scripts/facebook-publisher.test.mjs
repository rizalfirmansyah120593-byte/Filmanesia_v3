import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { after, test } from 'node:test';

const temporaryDirectory = await mkdtemp(path.join(os.tmpdir(), 'filmanesia-facebook-'));
process.env.ARTICLE_DATA_DIR = path.join(temporaryDirectory, 'data');
delete process.env.DATABASE_URL;

const store = await import('./article-store.mjs');
const publisher = await import('./facebook-publisher.mjs');
after(() => rm(temporaryDirectory, { recursive: true, force: true }));

const env = {
  FACEBOOK_AUTOPUBLISH_ENABLED: 'true',
  FACEBOOK_PAGE_ID: 'page-123',
  FACEBOOK_PAGE_ACCESS_TOKEN: 'test-secret-token',
  FACEBOOK_GRAPH_API_VERSION: 'v24.0',
  PUBLIC_SITE_URL: 'https://www.filmanesia.com',
};

test('posts pending articles and records the Facebook post ID', async () => {
  await store.createArticle({
    id: 'article-test-facebook',
    slug: 'article-test-facebook',
    title: 'Artikel uji Facebook',
    excerpt: 'Ringkasan uji Facebook',
    status: 'published',
    published_at: new Date().toISOString(),
    facebook_status: 'pending',
  });
  let requestUrl;
  let requestBody;
  const fetchImpl = async (url, options) => {
    requestUrl = url;
    requestBody = new URLSearchParams(options.body);
    return new Response(JSON.stringify({ id: 'page-123_post-456' }), { status: 200 });
  };

  const result = await publisher.publishPendingFacebookArticles({ env, fetchImpl });

  assert.equal(result.posted, 1);
  assert.equal(requestUrl, 'https://graph.facebook.com/v24.0/page-123/feed');
  assert.equal(requestBody.get('access_token'), env.FACEBOOK_PAGE_ACCESS_TOKEN);
  assert.equal(requestBody.get('link'), 'https://www.filmanesia.com/blog/article-test-facebook');
  assert.deepEqual(await store.listPendingFacebookArticles(), []);
});

test('does not expose the Page token in Graph API errors', async () => {
  await assert.rejects(
    publisher.publishFacebookArticle({ slug: 'article', title: 'Judul', excerpt: 'Ringkasan' }, {
      env,
      fetchImpl: async () => new Response(JSON.stringify({ error: { message: `Invalid token ${env.FACEBOOK_PAGE_ACCESS_TOKEN}` } }), { status: 401 }),
    }),
    (error) => {
      assert.match(error.message, /\[redacted\]/);
      assert.doesNotMatch(error.message, /test-secret-token/);
      return true;
    },
  );
});
