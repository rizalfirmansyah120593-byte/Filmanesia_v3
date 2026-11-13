/* eslint-disable react/prop-types */
import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { toDetailPath } from './urlUtils';
import SEO from './SEO';
import NotFoundPage from './NotFoundPage';
import { getArticleBySlug, getArticleImage } from '../../lib/hostingerArticles';
import { FiArrowLeft, FiArrowUpRight, FiClock, FiLink, FiPlay, FiShare2 } from 'react-icons/fi';
import seedArticles from '../../../data/articles.seed.json';
import { FILM_ARTICLES as ARTICLES, getFilmArticleDescription } from './filmArticles';

const FALLBACK = '/preview.png';

function TmdbFilmBlock({ title, index, theme }) {
  const [movieId, setMovieId] = useState(null);
  const [src, setSrc] = useState(FALLBACK);
  const [overview, setOverview] = useState('');
  const [year, setYear] = useState('');
  const [rating, setRating] = useState(null);
  useEffect(() => {
    const key = import.meta.env.VITE_TMDB_API;
    if (!key) return undefined;
    const controller = new AbortController();
    fetch(`https://api.themoviedb.org/3/search/movie?api_key=${key}&language=id-ID&query=${encodeURIComponent(title)}`, { signal: controller.signal })
      .then((response) => response.ok ? response.json() : null)
      .then((data) => { const item = data?.results?.find((result) => result.poster_path); if (item) { setMovieId(item.id); setSrc(`https://image.tmdb.org/t/p/w500${item.poster_path}`); setOverview(item.overview || ''); setYear((item.release_date || '').slice(0, 4)); setRating(item.vote_average ? item.vote_average.toFixed(1) : null); } })
      .catch(() => {});
    return () => controller.abort();
  }, [title]);
  const href = movieId ? toDetailPath('movie', movieId, title) : '/movies';
  return <section>
    <h3 className="!mt-16 !mb-6 !text-2xl !font-black leading-tight tracking-tight text-white sm:!text-3xl">{index}. <Link to={href}>{title}</Link></h3>
    <div className="not-prose my-5 max-w-sm overflow-hidden rounded-xl border border-white/10 bg-white/[0.04]">
      <Link to={href} aria-label={`Tonton ${title} di Filmanesia`}><img src={src} alt={`Poster ${title} dari TMDB`} loading="lazy" onError={() => setSrc(FALLBACK)} className="h-[26rem] w-full object-cover transition duration-500 hover:scale-[1.02]" /></Link>
      <div className="flex items-center justify-between px-4 py-3 text-xs text-gray-500"><span>{year || 'Film pilihan'}</span><span>{rating ? `TMDB ${rating}/10` : 'TMDB'}</span></div>
    </div>
    <p><strong>Sinopsis:</strong> {overview || `${title} mengikuti tokoh utama melalui konflik yang menguji pilihan, hubungan, dan cara pandangnya terhadap dunia.`}</p>
    <p>{theme.toLowerCase().includes('horor') ? `${title} membangun ketegangan melalui ruang, suara, dan rahasia yang perlahan muncul. Penonton mengikuti perubahan situasi sambil menebak sumber ancaman yang mengelilingi karakter.` : theme.toLowerCase().includes('romantis') ? `${title} mengembangkan hubungan antarkarakter melalui pilihan, jarak, dan emosi yang tidak selalu mudah disampaikan. Karena itu, konflik personal terasa sama pentingnya dengan alur utama.` : theme.toLowerCase().includes('action') || theme.toLowerCase().includes('perang') ? `${title} menggerakkan cerita melalui risiko, keputusan cepat, dan konsekuensi yang terus meningkat. Adegan aksinya tetap terasa penting karena memperkuat perjalanan karakter.` : theme.toLowerCase().includes('dokumenter') ? `${title} mengajak penonton melihat fakta melalui pengalaman manusia dan detail kehidupan nyata. Setiap informasi mendapat konteks, sehingga pembaca tidak hanya menerima data secara mentah.` : `${title} memperluas tema ${theme} melalui karakter, konflik, dan detail visual yang saling mendukung. Cerita ini memberi ruang bagi penonton untuk membaca makna di balik keputusan setiap tokoh.`}</p>
    <p><strong>Kenapa menarik:</strong> Film ini tidak hanya mengandalkan premis. Sutradara menyusun ritme, visual, dialog, dan performa pemain untuk membangun pengalaman yang utuh. Penonton dapat memperhatikan perubahan karakter dari awal hingga akhir. Detail kecil sering membantu menjelaskan pilihan tokoh tanpa memberi penjelasan berlebihan.</p>
    <p><strong>Cocok untuk:</strong> Penonton yang mencari {theme} dengan cerita yang lebih berlapis. Film ini cocok untuk tontonan mandiri atau bahan diskusi bersama teman. Setelah menonton, bandingkan respons Anda dengan keputusan karakter dan tema yang film tersebut tawarkan.</p>
    <p>Anda dapat <Link to={href}>mencari dan menonton {title} di Filmanesia</Link>. Gunakan halaman detail untuk melihat informasi film dan pilihan tontonan yang tersedia.</p>
  </section>;
}

function TrailerEmbed({ article }) {
  const [trailerKey, setTrailerKey] = useState(null);
  useEffect(() => {
    if (!article.tmdb_id) return undefined;
    const controller = new AbortController();
    const type = article.media_type === 'tv' ? 'tv' : 'movie';
    const key = import.meta.env.VITE_TMDB_API;
    if (!key) return undefined;
    fetch(`https://api.themoviedb.org/3/${type}/${article.tmdb_id}/videos?api_key=${key}&language=en-US`, { signal: controller.signal })
      .then((response) => response.ok ? response.json() : null)
      .then((data) => { const video = data?.results?.find((item) => item.site === 'YouTube' && ['Trailer', 'Teaser'].includes(item.type)); if (video) setTrailerKey(video.key); })
      .catch(() => {});
    return () => controller.abort();
  }, [article.media_type, article.tmdb_id]);
  if (!trailerKey) return null;
  return <section className="mt-10 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.035]"><div className="flex items-center gap-2 border-b border-white/10 px-5 py-4 text-sm font-bold text-white"><FiPlay className="text-red-400" /> Trailer resmi</div><div className="aspect-video"><iframe className="h-full w-full" src={`https://www.youtube-nocookie.com/embed/${trailerKey}`} title={`Trailer ${article.title}`} loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen /></div></section>;
}

function RemoteArticlePage({ article }) {
  const url = `${window.location.origin}/blog/${article.slug}`;
  const [copied, setCopied] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  useEffect(() => {
    const updateProgress = () => { const max = document.documentElement.scrollHeight - window.innerHeight; setReadingProgress(max > 0 ? Math.min(100, (window.scrollY / max) * 100) : 0); };
    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
    return () => window.removeEventListener('scroll', updateProgress);
  }, []);
  const copyLink = async () => { try { await navigator.clipboard.writeText(window.location.href); setCopied(true); setTimeout(() => setCopied(false), 1800); } catch { /* clipboard unavailable */ } };
  const description = article.meta_description || article.excerpt || '';
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description,
    image: getArticleImage(article),
    datePublished: article.published_at,
    author: { '@type': 'Organization', name: 'Filmanesia' },
    mainEntityOfPage: url,
    inLanguage: 'id-ID',
  };

  return (
    <main className="min-h-screen bg-[#07080a] text-gray-200">
      <SEO title={article.title} description={description} url={url} image={getArticleImage(article)} jsonLd={jsonLd} />
      <div className="fixed left-0 right-0 top-0 z-[60] h-1 bg-white/10"><div className="h-full bg-red-500 transition-[width]" style={{ width: `${readingProgress}%` }} /></div>
      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 md:py-14">
        <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-gray-500 transition-colors hover:text-white"><FiArrowLeft /> Kembali ke Blog</Link>
        <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,820px)_260px] lg:justify-center">
          <article>
            <header className="border-b border-white/10 pb-8"><p className="mb-4 text-xs font-bold uppercase tracking-[0.25em] text-red-400">{article.category || 'Filmanesia Journal'}</p><h1 className="text-4xl font-black leading-[1.08] tracking-tight text-white sm:text-6xl">{article.title}</h1>{article.excerpt && <p className="mt-6 max-w-3xl text-lg leading-8 text-gray-400">{article.excerpt}</p>}<div className="mt-6 flex flex-wrap items-center gap-3 text-xs text-gray-500"><span>Filmanesia Editorial</span><span>·</span><time>{article.published_at ? new Date(article.published_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : ''}</time><span>·</span><span className="inline-flex items-center gap-1"><FiClock /> 8 menit baca</span></div></header>
            <figure className="mt-8"><img className="aspect-video w-full rounded-2xl object-cover shadow-2xl shadow-black/40" src={getArticleImage(article)} alt={article.title} width="1280" height="720" /><figcaption className="mt-3 text-xs text-gray-600">Gambar ilustrasi dari TMDB untuk artikel {article.title}.</figcaption></figure>
            <div className="mt-6 flex items-center gap-2 border-b border-white/10 pb-6"><button type="button" onClick={copyLink} className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-xs text-gray-400 hover:border-red-400/50 hover:text-white"><FiLink /> {copied ? 'Tautan disalin' : 'Salin tautan'}</button><a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(url)}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-xs text-gray-400 hover:border-red-400/50 hover:text-white"><FiShare2 /> Bagikan</a></div>
            <div className="prose prose-invert prose-lg mt-9 max-w-none prose-headings:font-bold prose-headings:text-white prose-p:text-gray-300 prose-p:leading-8 prose-a:text-red-400 prose-strong:text-white" dangerouslySetInnerHTML={{ __html: article.content || article.content_html || '' }} />
            <TrailerEmbed article={article} />
          </article>
          <aside className="hidden lg:block"><div className="sticky top-8 space-y-5"><div className="rounded-2xl border border-white/10 bg-white/[0.035] p-5"><p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-red-400">Dalam artikel</p><p className="text-sm leading-6 text-gray-400">Analisis, sinopsis, dan sudut pandang editorial Filmanesia.</p></div><Link to="/blog" className="flex items-center justify-between rounded-2xl border border-white/10 p-5 text-sm text-gray-300 transition-colors hover:border-red-400/50 hover:text-white">Artikel lainnya <FiArrowUpRight /></Link></div></aside>
        </div>
      </div>
    </main>
  );
}

export default function FilmArticlePage() {
  const { slug } = useParams();
  const [remoteArticle, setRemoteArticle] = useState(null);
  const [remoteLoading, setRemoteLoading] = useState(true);

  useEffect(() => {
    let active = true;
    getArticleBySlug(slug)
      .then((article) => { if (active) setRemoteArticle(article); })
      .catch((error) => console.warn('Artikel dari PocketBase tidak tersedia:', error))
      .finally(() => { if (active) setRemoteLoading(false); });
    return () => { active = false; };
  }, [slug]);

  if (remoteLoading) {
    return <main className="min-h-screen bg-[#07080a] px-5 py-20 text-center text-gray-400">Memuat artikel...</main>;
  }

  if (remoteArticle) return <RemoteArticlePage article={remoteArticle} />;

  const seededArticle = seedArticles.find((article) => article.slug === slug);
  if (seededArticle) return <RemoteArticlePage article={seededArticle} />;

  const article = ARTICLES[slug];
  if (!article) return <NotFoundPage />;
  const [title, keyword, films, intro] = article;
  const seoDescription = getFilmArticleDescription(slug, keyword, intro);
  const url = `https://www.filmanesia.com/blog/${slug}`;
  const faq = [
    [`Apa yang menarik dari ${title}?`, `${title} menawarkan pilihan cerita yang relevan dengan kebutuhan penonton dan suasana hati yang berbeda.`],
    [`Bagaimana cara memilih film dari artikel ini?`, `Pilih judul berdasarkan genre, durasi, tema, dan teman menonton. Anda juga dapat membuka halaman detail setiap film.`],
    ['Di mana saya bisa menemukan film yang direkomendasikan?', 'Buka link pada poster atau judul film untuk melihat halaman tontonan yang tersedia di Filmanesia.'],
  ];
  const jsonLd = { '@context': 'https://schema.org', '@graph': [
    { '@type': 'Article', headline: title, description: seoDescription, author: { '@type': 'Organization', name: 'Filmanesia' }, publisher: { '@type': 'Organization', name: 'Filmanesia' }, mainEntityOfPage: url, inLanguage: 'id-ID' },
    { '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Beranda', item: 'https://www.filmanesia.com/' }, { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://www.filmanesia.com/blog' }, { '@type': 'ListItem', position: 3, name: title, item: url }] },
    { '@type': 'FAQPage', mainEntity: faq.map(([question, answer]) => ({ '@type': 'Question', name: question, acceptedAnswer: { '@type': 'Answer', text: answer } })) },
  ] };
  const genreLink = keyword.toLowerCase().includes('horor') ? '/movies/horror' : keyword.toLowerCase().includes('romantis') ? '/movies/romance' : keyword.toLowerCase().includes('sci-fi') ? '/movies/science-fiction' : keyword.toLowerCase().includes('perang') ? '/movies/war' : '/movies';
  const related = Object.entries(ARTICLES).filter(([key]) => key !== slug).slice(0, 3);
  const share = (target) => { const shareUrl = encodeURIComponent(typeof window === 'undefined' ? url : window.location.href); const shareText = encodeURIComponent(title); window.open(target(shareUrl, shareText), '_blank', 'noopener,noreferrer,width=640,height=520'); };
  return <main className="min-h-screen bg-[#07080a] px-5 py-12 text-gray-200 sm:px-8 md:py-16">
    <SEO title={title} description={seoDescription} url={url} image="/preview.png" jsonLd={jsonLd} />
    <article className="mx-auto max-w-3xl">
      <nav aria-label="Breadcrumb" className="text-sm text-gray-500"><Link to="/" className="hover:text-white">Beranda</Link><span className="mx-2">/</span><Link to="/blog" className="hover:text-white">Blog</Link><span className="mx-2">/</span><span className="text-gray-400">{title}</span></nav>
      <header className="mt-8 border-b border-white/10 pb-10"><p className="mb-4 text-xs font-bold uppercase tracking-[0.22em] text-red-400">Filmanesia Journal</p><h1 className="text-4xl font-black leading-tight text-white sm:text-5xl">{title}</h1><p className="mt-6 text-lg leading-8 text-gray-400">{intro}</p><p className="mt-5 text-xs text-gray-600">Panduan Filmanesia · Waktu baca 9 menit</p></header>
      <div className="not-prose mt-8 rounded-2xl border border-white/10 bg-white/[0.035] p-5 sm:p-6"><h2 className="mb-4 text-sm font-bold uppercase tracking-[0.16em] text-gray-300">Daftar Isi</h2><nav aria-label="Daftar isi" className="grid gap-2 text-sm text-red-400"><a href="#konsep">Mengapa tema ini menarik?</a><a href="#rekomendasi">Rekomendasi film pilihan</a><a href="#memilih">Cara memilih tontonan</a><a href="#faq">Pertanyaan yang sering ditanyakan</a></nav></div>
      <div className="not-prose mt-8 grid grid-cols-2 gap-3 rounded-2xl border border-white/10 bg-white/[0.025] p-5 text-sm sm:grid-cols-4"><div><span className="block text-xs text-gray-500">Kategori</span><Link to={genreLink} className="font-semibold text-red-400 hover:text-red-300">{keyword}</Link></div><div><span className="block text-xs text-gray-500">Rating editorial</span><strong className="text-white">8,5/10</strong></div><div><span className="block text-xs text-gray-500">Waktu baca</span><strong className="text-white">9 menit</strong></div><div><span className="block text-xs text-gray-500">Diperbarui</span><strong className="text-white">22 Sep 2026</strong></div></div>
      <div className="prose prose-invert prose-lg max-w-none prose-headings:font-bold prose-headings:text-white prose-p:text-gray-300 prose-p:leading-8 prose-a:text-red-400 prose-a:no-underline hover:prose-a:text-red-300 prose-strong:text-white">
        <p><strong>{keyword}</strong> membantu Anda menemukan tontonan yang sesuai tanpa menghabiskan waktu terlalu lama. {intro} Daftar ini membandingkan sinopsis, karakter, tema, dan pengalaman menonton setiap judul. Dengan begitu, Anda dapat memilih film berdasarkan kebutuhan, bukan sekadar judul populer.</p>
        <p>Menonton film bukan sekadar mengisi waktu luang. Cerita yang tepat dapat membuka percakapan, memberi perspektif baru, atau menemani malam yang terasa panjang. Karena itu, kami menyusun rekomendasi dengan mempertimbangkan pengalaman penonton Indonesia.</p>
        <h2 id="konsep">Kenapa tema ini menarik bagi penonton Indonesia?</h2>
        <p>Penonton kini memiliki banyak pilihan dari bioskop dan layanan streaming. Akan tetapi, terlalu banyak pilihan sering membuat kita sulit mulai. Artikel ini membantu Anda menyaring pilihan berdasarkan suasana, tema, dan kekuatan cerita.</p>
        <p>Selain itu, setiap genre memiliki cara bercerita sendiri. Film romantis mengandalkan chemistry. Film aksi mengejar ritme. Film dokumenter membangun rasa ingin tahu. Oleh karena itu, rekomendasi berikut tidak hanya mengejar popularitas.</p>
        <h2 id="rekomendasi">Rekomendasi film pilihan</h2>
        {films.map((film, index) => <TmdbFilmBlock key={film} title={film} theme={keyword} index={index + 1} />)}
        <h2 id="memilih">Cara memilih tontonan yang paling cocok</h2>
        <p>Mulailah dari waktu yang Anda miliki. Film dengan konflik padat cocok untuk malam singkat. Sebaliknya, cerita yang lebih lambat cocok untuk akhir pekan. Jangan lupa mempertimbangkan teman menonton dan batas usia.</p>
        <p>Selanjutnya, baca sinopsis tanpa spoiler. Langkah ini membantu Anda memilih cerita tanpa merusak kejutan. Anda juga dapat menyimpan judul menarik dalam daftar pribadi. Dengan begitu, Anda tidak perlu mengingat semuanya.</p>
        <h2>Sumber tambahan dan referensi</h2>
        <p>Periksa data pemeran melalui <a href="https://www.imdb.com/" target="_blank" rel="noopener noreferrer">IMDb</a>. Gunakan <a href="https://www.themoviedb.org/" target="_blank" rel="noopener noreferrer">The Movie Database</a> untuk metadata film. Sementara itu, jelajahi <Link to="/trending-film">halaman film trending Filmanesia</Link> untuk menemukan pilihan terbaru.</p>
        <p>Pilih layanan tontonan resmi agar industri film terus tumbuh. Setelah itu, Anda dapat membaca <Link to="/blog">artikel lain di Blog Filmanesia</Link> untuk rekomendasi berikutnya.</p>
        <h2 id="faq">Pertanyaan yang sering ditanyakan</h2>
        {faq.map(([question, answer]) => <section key={question}><h3>{question}</h3><p>{answer}</p></section>)}
        <h2>Kesimpulan</h2>
        <p>Pilihan film terbaik selalu bergantung pada kebutuhan dan suasana hati. Namun, cerita yang kuat tetap meninggalkan kesan setelah layar berhenti menyala. Pilih satu judul malam ini, lalu beri kesempatan pada ceritanya.</p>
        <p>Jika Anda mencari <strong>{keyword}</strong>, daftar ini dapat menjadi titik awal yang praktis. Kunjungi <Link to="/movies">katalog film Filmanesia</Link> dan temukan tontonan yang paling cocok untuk Anda. Selamat menikmati cerita.</p>
      </div>
      <section className="not-prose mt-12 border-t border-white/10 pt-8"><h2 className="mb-4 text-xl font-bold text-white">Artikel Terkait</h2><div className="grid gap-3 sm:grid-cols-3">{related.map(([key, item]) => <Link key={key} to={`/blog/${key}`} className="rounded-xl border border-white/10 bg-white/[0.035] p-4 text-sm font-semibold text-gray-300 hover:border-red-400/40 hover:text-white">{item[0]}</Link>)}</div></section>
      <section className="not-prose mt-8 flex flex-wrap items-center gap-3 border-t border-white/10 pt-6"><span className="text-sm text-gray-500">Bagikan artikel:</span><button type="button" onClick={() => share((u, t) => `https://wa.me/?text=${t}%20${u}`)} className="rounded-lg border border-white/10 px-3 py-2 text-sm text-gray-300 hover:border-green-400/50 hover:text-green-300">WhatsApp</button><button type="button" onClick={() => share((u, t) => `https://twitter.com/intent/tweet?text=${t}&url=${u}`)} className="rounded-lg border border-white/10 px-3 py-2 text-sm text-gray-300 hover:border-sky-400/50 hover:text-sky-300">X</button><button type="button" onClick={() => navigator.clipboard?.writeText(window.location.href)} className="rounded-lg border border-white/10 px-3 py-2 text-sm text-gray-300 hover:border-red-400/50 hover:text-red-300">Salin Link</button></section>
    </article>
  </main>;
}
