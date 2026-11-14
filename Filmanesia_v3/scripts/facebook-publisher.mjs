import process from 'node:process';
import {
  claimFacebookArticle,
  completeFacebookArticle,
  listPendingFacebookArticles,
  retryFacebookArticle,
} from './article-store.mjs';

function required(name, env) {
  const value = env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

export async function publishFacebookArticle(article, { env = process.env, fetchImpl = fetch } = {}) {
  const pageId = required('FACEBOOK_PAGE_ID', env);
  const pageAccessToken = required('FACEBOOK_PAGE_ACCESS_TOKEN', env);
  const apiVersion = required('FACEBOOK_GRAPH_API_VERSION', env);
  if (!/^v\d+\.\d+$/.test(apiVersion)) throw new Error('FACEBOOK_GRAPH_API_VERSION must use the format vNN.N.');

  const baseUrl = (env.PUBLIC_SITE_URL || env.VITE_SITE_URL || 'https://www.filmanesia.com').replace(/\/+$/, '');
  const articleUrl = `${baseUrl}/blog/${encodeURIComponent(article.slug)}`;
  const body = new URLSearchParams({
    access_token: pageAccessToken,
    link: articleUrl,
    message: `${article.title}\n\n${article.excerpt}\n\nBaca selengkapnya di Filmanesia.`,
  });
  const response = await fetchImpl(`https://graph.facebook.com/${apiVersion}/${encodeURIComponent(pageId)}/feed`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });

  let result = {};
  try {
    result = await response.json();
  } catch {
    result = {};
  }
  if (!response.ok || !result.id) {
    const graphMessage = String(result.error?.message || 'Facebook did not return a post ID.');
    throw new Error(`Facebook Graph API request failed (${response.status}): ${graphMessage.replaceAll(pageAccessToken, '[redacted]')}`);
  }
  return String(result.id);
}

export async function publishPendingFacebookArticles({ env = process.env, fetchImpl = fetch } = {}) {
  if (env.FACEBOOK_AUTOPUBLISH_ENABLED !== 'true') return { posted: 0, pending: 0, disabled: true };

  const pending = await listPendingFacebookArticles();
  let posted = 0;
  for (const article of pending) {
    const claimed = await claimFacebookArticle(article.id);
    if (!claimed) continue;

    try {
      const postId = await publishFacebookArticle(article, { env, fetchImpl });
      await completeFacebookArticle(article.id, postId);
      posted += 1;
      console.log(`[Facebook automation] Published article ${article.id} as post ${postId}.`);
    } catch (error) {
      await retryFacebookArticle(article.id, error.message);
      console.error(`[Facebook automation] Article ${article.id} remains pending: ${error.message}`);
    }
  }
  return { posted, pending: pending.length - posted, disabled: false };
}
