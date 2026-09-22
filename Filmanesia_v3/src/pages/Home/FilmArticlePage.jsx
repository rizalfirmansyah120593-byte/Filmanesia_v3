import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { toDetailPath } from './urlUtils';
import SEO from './SEO';

const ARTICLES = {
  'greenland-film': ['Greenland Film: Sinopsis, Review, dan Alasan Layak Ditonton', 'film Greenland', ['Greenland', 'The Day After Tomorrow', 'Deep Impact', 'Greenland: Migration'], 'Film Greenland menghadirkan thriller bencana yang menempatkan keluarga dan rasa kemanusiaan di pusat kehancuran global.'],
  'film-romantis-indonesia-paling-baper': ['Film Romantis Indonesia Paling Baper', 'film romantis Indonesia', ['Ada Apa dengan Cinta?', 'Habibie & Ainun', 'Dilan 1990', 'Milly & Mamet'], 'Cerita cinta lokal terasa dekat karena memakai bahasa, keluarga, dan kebiasaan yang kita kenal.'],
  'film-action-terbaik-2026': ['Film Action Terbaik 2026 yang Wajib Ditonton', 'film action terbaik 2026', ['Mission: Impossible', 'John Wick', 'The Raid', 'Top Gun: Maverick'], 'Film action terbaik memadukan koreografi, konflik jelas, dan karakter yang punya taruhan personal.'],
  'film-korea-terbaik-untuk-pemula': ['Film Korea Terbaik untuk Pemula', 'film korea terbaik', ['Parasite', 'Train to Busan', 'Decision to Leave', 'The Handmaiden'], 'Film Korea menawarkan drama kuat, genre berani, dan karakter yang berkembang secara meyakinkan.'],
  'film-thriller-plot-twist-tak-terduga': ['Film Thriller dengan Plot Twist Tak Terduga', 'film plot twist', ['Oldboy', 'Gone Girl', 'The Prestige', 'Shutter Island'], 'Film plot twist yang baik memberi petunjuk sejak awal, lalu mengubah cara penonton memahami cerita.'],
  'film-kisah-nyata-yang-menyentuh': ['Film Berdasarkan Kisah Nyata yang Menyentuh', 'film kisah nyata', ['Habibie & Ainun', 'The Pursuit of Happyness', 'The Theory of Everything', 'Sully'], 'Film kisah nyata mengubah peristiwa hidup menjadi pengalaman emosional yang mudah kita renungkan.'],
  'film-keluarga-untuk-ditonton-bareng-anak': ['Film Keluarga untuk Ditonton Bareng Anak', 'film keluarga', ['Keluarga Cemara', 'Paddington', 'Coco', 'The Lion King'], 'Film keluarga yang baik menghibur anak, tetapi tetap memberi ruang bagi orang tua untuk berdiskusi.'],
  'film-animasi-terbaik-untuk-semua-umur': ['Film Animasi Terbaik untuk Semua Umur', 'film animasi terbaik', ['Spirited Away', 'Toy Story', 'Up', 'How to Train Your Dragon'], 'Film animasi terbaik menyampaikan emosi besar melalui visual, musik, dan karakter yang mudah dicintai.'],
  'film-fiksi-ilmiah-yang-bikin-mikir': ['Film Fiksi Ilmiah yang Bikin Mikir', 'film sci-fi terbaik', ['Interstellar', 'Arrival', 'Ex Machina', 'The Matrix'], 'Film sci-fi terbaik memakai teknologi sebagai pintu untuk membahas waktu, kesadaran, dan masa depan manusia.'],
  'film-perang-terbaik-sepanjang-masa': ['Film Perang Terbaik Sepanjang Masa', 'film perang terbaik', ['Saving Private Ryan', '1917', 'Dunkirk', 'The Pianist'], 'Film perang terbaik tidak hanya menampilkan pertempuran, tetapi juga memperlihatkan harga kemanusiaan.'],
  'film-dokumenter-menarik-penambah-wawasan': ['Film Dokumenter Menarik Penambah Wawasan', 'film dokumenter terbaik', ['Free Solo', 'My Octopus Teacher', 'The Social Dilemma', 'Jiro Dreams of Sushi'], 'Film dokumenter terbaik membuat fakta terasa hidup melalui manusia, konflik, dan sudut pandang yang kuat.'],
  'anime-movie-terbaik-wajib-ditonton': ['Anime Movie Terbaik yang Wajib Ditonton', 'anime movie terbaik', ['Your Name', 'A Silent Voice', 'Spirited Away', 'Akira'], 'Anime movie terbaik menawarkan visual khas, emosi tajam, dan gagasan yang tetap membekas setelah cerita selesai.'],
};

const FALLBACK = '/preview.png';
function TmdbPoster({ title, alt, link = false }) {
  const [src, setSrc] = useState(FALLBACK);
  const [movieId, setMovieId] = useState(null);
  useEffect(() => {
    const key = import.meta.env.VITE_TMDB_API;
    if (!key) return undefined;
    const controller = new AbortController();
    fetch(`https://api.themoviedb.org/3/search/movie?api_key=${key}&language=id-ID&query=${encodeURIComponent(title)}`, { signal: controller.signal })
      .then((response) => response.ok ? response.json() : null)
      .then((data) => { const item = data?.results?.find((result) => result.poster_path); if (item) { setMovieId(item.id); setSrc(`https://image.tmdb.org/t/p/w500${item.poster_path}`); } })
      .catch(() => {});
    return () => controller.abort();
  }, [title]);
  const image = <img src={src} alt={alt} loading="lazy" onError={() => setSrc(FALLBACK)} className="h-52 w-full object-cover transition duration-500 group-hover:scale-105" />;
  return link && movieId ? <Link to={toDetailPath('movie', movieId, title)} aria-label={`Tonton ${title} di Filmanesia`}>{image}</Link> : image;
}

function TmdbFilmCard({ title }) {
  const [movieId, setMovieId] = useState(null);
  const [src, setSrc] = useState(FALLBACK);
  useEffect(() => {
    const key = import.meta.env.VITE_TMDB_API;
    if (!key) return undefined;
    const controller = new AbortController();
    fetch(`https://api.themoviedb.org/3/search/movie?api_key=${key}&language=id-ID&query=${encodeURIComponent(title)}`, { signal: controller.signal })
      .then((response) => response.ok ? response.json() : null)
      .then((data) => { const item = data?.results?.find((result) => result.poster_path); if (item) { setMovieId(item.id); setSrc(`https://image.tmdb.org/t/p/w500${item.poster_path}`); } })
      .catch(() => {});
    return () => controller.abort();
  }, [title]);
  const href = movieId ? toDetailPath('movie', movieId, title) : '/movies';
  return <article className="group overflow-hidden rounded-xl border border-white/10 bg-white/[0.04] hover:border-red-400/40">
    <Link to={href} aria-label={`Tonton ${title} di Filmanesia`}><img src={src} alt={`Poster ${title} dari TMDB`} loading="lazy" onError={() => setSrc(FALLBACK)} className="h-52 w-full object-cover transition duration-500 group-hover:scale-105" /></Link>
    <div className="p-4"><h3 className="font-bold text-white group-hover:text-red-300"><Link to={href}>{title}</Link></h3><p className="mt-1 text-xs text-gray-500">Klik poster atau judul untuk menonton →</p></div>
  </article>;
}

function TmdbFilmBlock({ title, index }) {
  const [movieId, setMovieId] = useState(null);
  const [src, setSrc] = useState(FALLBACK);
  useEffect(() => {
    const key = import.meta.env.VITE_TMDB_API;
    if (!key) return undefined;
    const controller = new AbortController();
    fetch(`https://api.themoviedb.org/3/search/movie?api_key=${key}&language=id-ID&query=${encodeURIComponent(title)}`, { signal: controller.signal })
      .then((response) => response.ok ? response.json() : null)
      .then((data) => { const item = data?.results?.find((result) => result.poster_path); if (item) { setMovieId(item.id); setSrc(`https://image.tmdb.org/t/p/w500${item.poster_path}`); } })
      .catch(() => {});
    return () => controller.abort();
  }, [title]);
  const href = movieId ? toDetailPath('movie', movieId, title) : '/movies';
  return <section>
    <h3>{index}. <Link to={href}>{title}</Link></h3>
    <div className="not-prose my-5 max-w-sm overflow-hidden rounded-xl border border-white/10 bg-white/[0.04]">
      <Link to={href} aria-label={`Tonton ${title} di Filmanesia`}><img src={src} alt={`Poster ${title} dari TMDB`} loading="lazy" onError={() => setSrc(FALLBACK)} className="h-[26rem] w-full object-cover transition duration-500 hover:scale-[1.02]" /></Link>
      <p className="px-4 py-3 text-xs text-gray-500">Klik poster atau judul untuk menonton di Filmanesia →</p>
    </div>
    <p>{title} memberi pengalaman yang kuat melalui karakter dan konflik yang mudah diikuti. Ceritanya mengajak penonton memahami keputusan tokoh, bukan sekadar menunggu akhir. Karena itu, judul ini cocok untuk penonton yang ingin menikmati film dengan perhatian penuh.</p>
    <p>Perhatikan cara film membangun suasana. Musik, warna, dialog, dan ruang sering menyimpan petunjuk penting. Selain itu, pengalaman Anda dapat berubah ketika menonton bersama orang lain. Teman, pasangan, atau keluarga mungkin menangkap detail berbeda.</p>
    <p>Anda dapat <Link to={href}>mencari dan menonton {title} di Filmanesia</Link>. Gunakan halaman detail untuk melihat informasi film dan pilihan tontonan yang tersedia.</p>
  </section>;
}

export default function FilmArticlePage() {
  const { slug } = useParams();
  const article = ARTICLES[slug] || ARTICLES['film-romantis-indonesia-paling-baper'];
  const [title, keyword, films, intro] = article;
  const url = `https://www.filmanesia.com/blog/${slug}`;
  const jsonLd = { '@context': 'https://schema.org', '@type': 'Article', headline: title, description: `${title}. Rekomendasi tontonan lengkap dengan insight dan link film di Filmanesia.`, author: { '@type': 'Organization', name: 'Filmanesia' }, publisher: { '@type': 'Organization', name: 'Filmanesia' }, mainEntityOfPage: url, inLanguage: 'id-ID' };
  return <main className="min-h-screen bg-[#07080a] px-5 py-12 text-gray-200 sm:px-8 md:py-16">
    <SEO title={title} description={`${title}, lengkap dengan rekomendasi, alasan menonton, dan pilihan film di Filmanesia.`} url={url} jsonLd={jsonLd} />
    <article className="mx-auto max-w-3xl">
      <Link to="/blog" className="text-sm text-red-400 hover:text-red-300">← Kembali ke Blog</Link>
      <header className="mt-8 border-b border-white/10 pb-10"><p className="mb-4 text-xs font-bold uppercase tracking-[0.22em] text-red-400">Filmanesia Journal</p><h1 className="text-4xl font-black leading-tight text-white sm:text-5xl">{title}</h1><p className="mt-6 text-lg leading-8 text-gray-400">{intro}</p><p className="mt-5 text-xs text-gray-600">Panduan Filmanesia · Waktu baca 9 menit</p></header>
      <div className="prose prose-invert prose-lg max-w-none prose-headings:font-bold prose-headings:text-white prose-p:text-gray-300 prose-p:leading-8 prose-a:text-red-400 prose-a:no-underline hover:prose-a:text-red-300 prose-strong:text-white">
        <p><strong>{keyword}</strong> membantu Anda memilih tontonan tanpa menghabiskan waktu terlalu lama. Daftar ini merangkum judul yang punya cerita kuat, karakter menarik, dan alasan jelas untuk masuk daftar putar. Direct answer-nya sederhana: mulai dari judul yang sesuai suasana hati, lalu lanjutkan ke karya dengan pendekatan berbeda.</p>
        <p>Menonton film bukan sekadar mengisi waktu luang. Cerita yang tepat dapat membuka percakapan, memberi perspektif baru, atau menemani malam yang terasa panjang. Karena itu, kami menyusun rekomendasi dengan mempertimbangkan pengalaman penonton Indonesia.</p>
        <h2>Kenapa tema ini menarik bagi penonton Indonesia?</h2>
        <p>Penonton kini memiliki banyak pilihan dari bioskop dan layanan streaming. Akan tetapi, terlalu banyak pilihan sering membuat kita sulit mulai. Artikel ini membantu Anda menyaring pilihan berdasarkan suasana, tema, dan kekuatan cerita.</p>
        <p>Selain itu, setiap genre memiliki cara bercerita sendiri. Film romantis mengandalkan chemistry. Film aksi mengejar ritme. Film dokumenter membangun rasa ingin tahu. Oleh karena itu, rekomendasi berikut tidak hanya mengejar popularitas.</p>
        <h2>Rekomendasi film pilihan</h2>
        {films.map((film, index) => <TmdbFilmBlock key={film} title={film} index={index + 1} />)}
        <h2>Cara memilih tontonan yang paling cocok</h2>
        <p>Mulailah dari waktu yang Anda miliki. Film dengan konflik padat cocok untuk malam singkat. Sebaliknya, cerita yang lebih lambat cocok untuk akhir pekan. Jangan lupa mempertimbangkan teman menonton dan batas usia.</p>
        <p>Selanjutnya, baca sinopsis tanpa spoiler. Langkah ini membantu Anda memilih cerita tanpa merusak kejutan. Anda juga dapat menyimpan judul menarik dalam daftar pribadi. Dengan begitu, Anda tidak perlu mengingat semuanya.</p>
        <h2>Sumber tambahan dan referensi</h2>
        <p>Periksa data pemeran melalui <a href="https://www.imdb.com/" target="_blank" rel="noopener noreferrer">IMDb</a>. Gunakan <a href="https://www.themoviedb.org/" target="_blank" rel="noopener noreferrer">The Movie Database</a> untuk metadata film. Sementara itu, jelajahi <Link to="/trending-film">halaman film trending Filmanesia</Link> untuk menemukan pilihan terbaru.</p>
        <p>Pilih layanan tontonan resmi agar industri film terus tumbuh. Setelah itu, Anda dapat membaca <Link to="/blog">artikel lain di Blog Filmanesia</Link> untuk rekomendasi berikutnya.</p>
        <h2>Kesimpulan</h2>
        <p>Pilihan film terbaik selalu bergantung pada kebutuhan dan suasana hati. Namun, cerita yang kuat tetap meninggalkan kesan setelah layar berhenti menyala. Pilih satu judul malam ini, lalu beri kesempatan pada ceritanya.</p>
        <p>Jika Anda mencari <strong>{keyword}</strong>, daftar ini dapat menjadi titik awal yang praktis. Kunjungi <Link to="/movies">katalog film Filmanesia</Link> dan temukan tontonan yang paling cocok untuk Anda. Selamat menikmati cerita.</p>
      </div>
    </article>
  </main>;
}
