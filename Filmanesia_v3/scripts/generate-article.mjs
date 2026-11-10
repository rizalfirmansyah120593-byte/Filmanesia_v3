import process from 'node:process';
import { fileURLToPath } from 'node:url';
import { createArticle, readArticles } from './article-store.mjs';

const required = (name) => {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
};

const openAiKey = required('OPENAI_API_KEY');
const tmdbKey = process.env.TMDB_API_KEY || process.env.VITE_TMDB_API || required('TMDB_API_KEY');
const model = process.env.OPENAI_ARTICLE_MODEL || process.env.OPENAI_MODEL || 'gpt-4o-mini';
const language = 'id-ID';

const slugify = (value) => value.toLowerCase()
  .normalize('NFKD').replace(/[\u0300-\u036f]/g, '')
  .replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-').replace(/-+/g, '-');

async function getJson(url, options = {}) {
  const response = await fetch(url, options);
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}: ${url}`);
  return response.json();
}

async function getTopic() {
  const trending = await getJson(`https://api.themoviedb.org/3/trending/all/week?api_key=${encodeURIComponent(tmdbKey)}&language=${language}`);
  const candidates = (trending.results || []).filter((item) => item.id && (item.title || item.name) && item.overview);
  if (!candidates.length) throw new Error('TMDB returned no usable trending titles.');

  const existing = await readArticles();
  const existingIds = new Set(existing.map((item) => String(item.tmdb_id)).filter(Boolean));
  return candidates.find((item) => !existingIds.has(String(item.id))) || candidates[0];
}

async function generateContent(topic) {
  const title = topic.title || topic.name;
  const year = (topic.release_date || topic.first_air_date || '').slice(0, 4);
  const type = topic.media_type === 'tv' ? 'serial TV' : 'film';
  const contentTypes = ['Review/Ulasan Film', 'Penjelasan Ending', 'Fakta Unik & Easter Eggs', 'Rekomendasi Berdasarkan Mood', 'Profil Sutradara/Aktor'];
  const contentType = contentTypes[Math.floor(Date.now() / (12 * 60 * 60 * 1000)) % contentTypes.length];
  const prompt = `Tulis satu artikel orisinal berbahasa Indonesia tentang ${type} "${title}"${year ? ` (${year})` : ''}.
Jenis artikel hari ini: ${contentType}.
Gunakan data TMDB berikut hanya sebagai fakta dasar, jangan mengarang detail produksi: ${JSON.stringify({ title, overview: topic.overview, release_date: topic.release_date, first_air_date: topic.first_air_date, vote_average: topic.vote_average, genres: topic.genre_ids })}

Keluaran HARUS JSON valid dengan field:
- title: judul SEO menarik, bukan clickbait
- excerpt: ringkasan 140-160 karakter
- meta_description: deskripsi SEO maksimal 155 karakter
- category: maksimal 40 karakter
- content: HTML fragment orisinal dengan <p>, <h2>, <h3>, <ul>, <li>, dan <strong> saja

Struktur content wajib: lead yang mengaitkan tren pop-culture, sinopsis singkat tanpa spoiler bila review/rekomendasi, pembahasan utama sesuai jenis artikel, kesimpulan, lalu 1-2 pertanyaan terbuka. Paragraf maksimal 3-4 kalimat pendek. Jangan menyalin sinopsis resmi, ulasan media lain, lirik, dialog, atau teks berhak cipta. Jangan membuat klaim pemeran, platform streaming, atau fakta produksi yang tidak ada di data. Jika data tidak cukup, nyatakan keterbatasannya.`;

  const result = await getJson('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${openAiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      temperature: 0.75,
      max_tokens: 2200,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: 'Anda adalah jurnalis film profesional. Tulis analisis orisinal, akurat, ramah pembaca, dan aman untuk publikasi.' },
        { role: 'user', content: prompt },
      ],
    }),
  });
  return JSON.parse(result.choices?.[0]?.message?.content || '{}');
}

async function publish(topic, article) {
  const cleanTitle = String(article.title || topic.title || topic.name).trim();
  const payload = {
    title: cleanTitle,
    slug: `${slugify(cleanTitle)}-${topic.id}`,
    excerpt: String(article.excerpt || '').trim(),
    meta_description: String(article.meta_description || article.excerpt || '').trim().slice(0, 155),
    content: String(article.content || '').trim(),
    category: String(article.category || 'Review Film').trim().slice(0, 40),
    poster_url: topic.poster_path ? `https://image.tmdb.org/t/p/w780${topic.poster_path}` : '',
    tmdb_id: String(topic.id),
    status: 'published',
    published_at: new Date().toISOString(),
  };
  if (!payload.content || !payload.excerpt) throw new Error('Model returned incomplete article content.');

  return createArticle(payload);
}

export async function runGeneration() {
  const topic = await getTopic();
  const article = await generateContent(topic);
  const published = await publish(topic, article);
  return { id: published.id, title: published.title, slug: published.slug, model, topic: topic.title || topic.name };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const result = await runGeneration();
  console.log(JSON.stringify(result));
}
