const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

function getHeaders() {
  return { apikey: supabaseAnonKey, Authorization: `Bearer ${supabaseAnonKey}`, 'Content-Type': 'application/json' };
}

export async function getPublishedArticles() {
  if (!supabaseUrl || !supabaseAnonKey) return [];
  const response = await fetch(`${supabaseUrl}/rest/v1/articles?select=*&status=eq.published&order=published_at.desc,created_at.desc`, { headers: getHeaders() });
  if (!response.ok) throw new Error(`Supabase request failed: ${response.status}`);
  return response.json();
}

export async function getArticleBySlug(slug) {
  if (!supabaseUrl || !supabaseAnonKey || !slug) return null;
  const response = await fetch(`${supabaseUrl}/rest/v1/articles?select=*&slug=eq.${encodeURIComponent(slug)}&status=eq.published&limit=1`, { headers: getHeaders() });
  if (!response.ok) throw new Error(`Supabase request failed: ${response.status}`);
  const records = await response.json();
  return records[0] || null;
}

export function getArticleImage(article) {
  if (!article) return '/preview.png';
  return article.poster_url || article.image_url || '/preview.png';
}
