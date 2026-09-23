const apiBaseUrl = (import.meta.env.VITE_ARTICLES_API_URL || 'https://filmanesia.com/api').replace(/\/$/, '');

async function request(path) {
  const response = await fetch(`${apiBaseUrl}/${path}`);
  if (!response.ok) throw new Error(`Articles API request failed: ${response.status}`);
  return response.json();
}

export async function getPublishedArticles() {
  const data = await request('articles.php');
  return data.items || [];
}

export async function getArticleBySlug(slug) {
  if (!slug) return null;
  try {
    return await request(`article.php?slug=${encodeURIComponent(slug)}`);
  } catch (error) {
    if (String(error.message).includes('404')) return null;
    throw error;
  }
}

export function getArticleImage(article) {
  return article?.poster_url || article?.image_url || '/preview.png';
}
