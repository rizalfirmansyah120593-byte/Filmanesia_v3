const apiBaseUrl = (import.meta.env.VITE_ARTICLES_API_URL || '').replace(/\/$/, '');

async function request(path) {
  const endpoint = apiBaseUrl ? `${apiBaseUrl}/${path}` : `/api/${path}`;
  const response = await fetch(endpoint);
  if (!response.ok) throw new Error(`Articles API request failed: ${response.status}`);
  return response.json();
}

export async function getPublishedArticles() {
  const data = await request('articles');
  return data.items || [];
}

export async function getArticleBySlug(slug) {
  if (!slug) return null;
  try {
    return await request(`article?slug=${encodeURIComponent(slug)}`);
  } catch (error) {
    if (String(error.message).includes('404')) return null;
    throw error;
  }
}

export function getArticleImage(article) {
  return article?.poster_url || article?.image_url || '/preview.png';
}
