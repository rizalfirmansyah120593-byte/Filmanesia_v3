import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import SEO from './SEO';

const BLOG_IMAGE_QUERIES = {
  'Rekomendasi Film Indonesia Terbaik Sepanjang Masa': 'Petualangan Sherina',
  'Greenland Film: Sinopsis, Review, dan Alasan Layak Ditonton': 'Greenland',
  'Film Cina Terbaik untuk Menemani Waktu Santai': 'The Wandering Earth',
  'Film India Terbaik: Rekomendasi Cerita Penuh Warna': 'RRR',
  'Film Jepang Terbaik dengan Cerita yang Membekas': 'Your Name',
  'Film Korea Terbaik untuk Ditonton Akhir Pekan': 'Parasite',
  'Film Horor Terbaik untuk Menguji Nyali': 'Pengabdi Setan',
  'Film Anak-Anak Terbaik untuk Tontonan Keluarga': 'Paddington',
  'Film Terbaru yang Wajib Masuk Daftar Tontonan': 'Dune: Part Two',
  'Film Bioskop Terbaru yang Layak Dinantikan': 'Godzilla Minus One',
  'Resident Evil 2026: Yang Perlu Diketahui Sebelum Menonton': 'Resident Evil: Welcome to Raccoon City',
  'Film Daniel yang Menarik untuk Masuk Daftar Tontonan': 'Daniel',
  'Film Romantis Indonesia Paling Baper': 'Ada Apa dengan Cinta?',
  'Film Action Terbaik 2026 yang Wajib Ditonton': 'Top Gun: Maverick',
  'Film Korea Terbaik untuk Pemula': 'Train to Busan',
  'Film Thriller dengan Plot Twist Tak Terduga': 'Shutter Island',
  'Film Berdasarkan Kisah Nyata yang Menyentuh': 'The Pursuit of Happyness',
  'Film Keluarga untuk Ditonton Bareng Anak': 'Keluarga Cemara',
  'Film Animasi Terbaik untuk Semua Umur': 'Spirited Away',
  'Film Fiksi Ilmiah yang Bikin Mikir': 'Interstellar',
  'Film Perang Terbaik Sepanjang Masa': 'Saving Private Ryan',
  'Film Dokumenter Menarik Penambah Wawasan': 'Free Solo',
  'Anime Movie Terbaik yang Wajib Ditonton': 'A Silent Voice',
};

function TmdbBlogImage({ query, fallback, alt }) {
  const [src, setSrc] = useState(fallback);
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!ref.current || typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return undefined;
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); observer.disconnect(); }
    }, { rootMargin: '300px' });
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!visible) return undefined;
    const key = import.meta.env.VITE_TMDB_API;
    if (!key) return undefined;
    const controller = new AbortController();
    const searchQuery = BLOG_IMAGE_QUERIES[query] || query;
    fetch(`https://api.themoviedb.org/3/search/movie?api_key=${key}&language=id-ID&query=${encodeURIComponent(searchQuery)}`, { signal: controller.signal })
      .then((response) => response.ok ? response.json() : null)
      .then((data) => { const path = data?.results?.find((item) => item.backdrop_path || item.poster_path); if (path) setSrc(`https://image.tmdb.org/t/p/w780${path.backdrop_path || path.poster_path}`); })
      .catch(() => {});
    return () => controller.abort();
  }, [query, fallback, visible]);
  return <img ref={ref} src={src} alt={alt} loading="lazy" width="780" height="440" onError={() => setSrc('/preview.png')} className="h-44 w-full object-cover transition duration-500 group-hover:scale-105 group-hover:opacity-100" />;
}

const ARTICLES = [
  { category: 'Rekomendasi', title: 'Rekomendasi Film Indonesia Terbaik Sepanjang Masa', excerpt: 'Pilihan film lokal dengan cerita kuat, karakter membekas, dan tema yang tetap relevan.', date: '12 September 2026', image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=900&q=80', alt: 'Layar bioskop menampilkan suasana sinematik', href: '/blog/film-indonesia-terbaik' },
  { category: 'Review Film', title: 'Greenland Film: Sinopsis, Review, dan Alasan Layak Ditonton', excerpt: 'Mengenal thriller bencana tentang keluarga yang berjuang mencari perlindungan.', date: '22 September 2026', image: '/preview.png', alt: 'Poster film Greenland dari TMDB', href: '/blog/greenland-film' },
  { category: 'Film Cina', title: 'Film Cina Terbaik untuk Menemani Waktu Santai', excerpt: 'Drama, aksi, dan cerita emosional dari sinema Cina.', date: '22 September 2026', image: '/preview.png', alt: 'Poster film Cina dari TMDB', href: '/blog/film-cina-terbaik' },
  { category: 'Film India', title: 'Film India Terbaik: Rekomendasi Cerita Penuh Warna', excerpt: 'Pilihan film India dengan emosi, musik, dan konflik keluarga.', date: '22 September 2026', image: '/preview.png', alt: 'Poster film India dari TMDB', href: '/blog/film-india-terbaik' },
  { category: 'Film Jepang', title: 'Film Jepang Terbaik dengan Cerita yang Membekas', excerpt: 'Rekomendasi cerita Jepang yang tenang, unik, dan manusiawi.', date: '22 September 2026', image: '/preview.png', alt: 'Poster film Jepang dari TMDB', href: '/blog/film-jepang-terbaik' },
  { category: 'Film Korea', title: 'Film Korea Terbaik untuk Ditonton Akhir Pekan', excerpt: 'Mulai akhir pekan dengan cerita Korea pilihan.', date: '22 September 2026', image: '/preview.png', alt: 'Poster film Korea dari TMDB', href: '/blog/film-korea-terbaik' },
  { category: 'Horor', title: 'Film Horor Terbaik untuk Menguji Nyali', excerpt: 'Atmosfer mencekam dan cerita yang meninggalkan kesan.', date: '22 September 2026', image: '/preview.png', alt: 'Poster film horor dari TMDB', href: '/blog/film-horor-terbaik' },
  { category: 'Keluarga', title: 'Film Anak-Anak Terbaik untuk Tontonan Keluarga', excerpt: 'Tontonan aman dan hangat untuk akhir pekan bersama anak.', date: '22 September 2026', image: '/preview.png', alt: 'Poster film anak-anak dari TMDB', href: '/blog/film-anak-anak-terbaik' },
  { category: 'Film Terbaru', title: 'Film Terbaru yang Wajib Masuk Daftar Tontonan', excerpt: 'Pilihan film modern dengan cerita dan visual menarik.', date: '22 September 2026', image: '/preview.png', alt: 'Poster film terbaru dari TMDB', href: '/blog/film-terbaru-yang-wajib-ditonton' },
  { category: 'Bioskop', title: 'Film Bioskop Terbaru yang Layak Dinantikan', excerpt: 'Film layar besar dengan skala cerita yang mengesankan.', date: '22 September 2026', image: '/preview.png', alt: 'Poster film bioskop terbaru dari TMDB', href: '/blog/film-bioskop-terbaru' },
  { category: 'Action Horror', title: 'Resident Evil 2026: Yang Perlu Diketahui Sebelum Menonton', excerpt: 'Mengenal daya tarik franchise Resident Evil dan film terbarunya.', date: '22 September 2026', image: '/preview.png', alt: 'Poster Resident Evil dari TMDB', href: '/blog/resident-evil-2026' },
  { category: 'Trending', title: 'Film Daniel yang Menarik untuk Masuk Daftar Tontonan', excerpt: 'Panduan memahami beberapa hasil pencarian dengan kata Daniel.', date: '22 September 2026', image: '/preview.png', alt: 'Poster film Daniel dari TMDB', href: '/blog/film-daniel-rekomendasi' },
  { category: 'Horor', title: 'Film Horor Indonesia Paling Seram dan Bikin Trauma', excerpt: 'Daftar horor lokal dengan atmosfer mencekam, mitos kuat, dan adegan yang terus teringat.', date: '22 September 2026', image: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?auto=format&fit=crop&w=900&q=80', alt: 'Lorong gelap bernuansa horor', href: '/blog/film-horor-indonesia-paling-seram' },
  { category: 'Romantis', title: 'Film Romantis Indonesia Paling Baper', excerpt: 'Pilihan cerita cinta lokal untuk menemani malam santai.', date: '22 September 2026', image: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=900&q=80', alt: 'Pasangan menikmati suasana romantis', href: '/blog/film-romantis-indonesia-paling-baper' },
  { category: 'Action', title: 'Film Action Terbaik 2026 yang Wajib Ditonton', excerpt: 'Rekomendasi aksi dengan ritme cepat dan konflik yang kuat.', date: '22 September 2026', image: 'https://images.unsplash.com/photo-1535016120720-40c646be5580?auto=format&fit=crop&w=900&q=80', alt: 'Layar bioskop dengan adegan aksi', href: '/blog/film-action-terbaik-2026' },
  { category: 'Korea', title: 'Film Korea Terbaik untuk Pemula', excerpt: 'Mulai perjalanan menonton film Korea melalui judul pilihan.', date: '22 September 2026', image: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=900&q=80', alt: 'Penonton menikmati film di bioskop', href: '/blog/film-korea-terbaik-untuk-pemula' },
  { category: 'Thriller', title: 'Film Thriller dengan Plot Twist Tak Terduga', excerpt: 'Cerita penuh petunjuk, teka-teki, dan akhir yang mengejutkan.', date: '22 September 2026', image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=900&q=80', alt: 'Kamera film untuk artikel thriller', href: '/blog/film-thriller-plot-twist-tak-terduga' },
  { category: 'Inspirasi', title: 'Film Berdasarkan Kisah Nyata yang Menyentuh', excerpt: 'Kisah manusia nyata yang memberi perspektif dan harapan.', date: '22 September 2026', image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=900&q=80', alt: 'Layar bioskop dengan suasana dramatis', href: '/blog/film-kisah-nyata-yang-menyentuh' },
  { category: 'Keluarga', title: 'Film Keluarga untuk Ditonton Bareng Anak', excerpt: 'Tontonan hangat untuk akhir pekan bersama keluarga.', date: '22 September 2026', image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=900&q=80', alt: 'Suasana menonton film bersama keluarga', href: '/blog/film-keluarga-untuk-ditonton-bareng-anak' },
  { category: 'Animasi', title: 'Film Animasi Terbaik untuk Semua Umur', excerpt: 'Animasi dengan visual indah dan pesan yang tetap relevan.', date: '22 September 2026', image: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=900&q=80', alt: 'Layar bioskop untuk film animasi', href: '/blog/film-animasi-terbaik-untuk-semua-umur' },
  { category: 'Sci-Fi', title: 'Film Fiksi Ilmiah yang Bikin Mikir', excerpt: 'Eksplorasi teknologi, waktu, dan masa depan manusia.', date: '22 September 2026', image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=900&q=80', alt: 'Ilustrasi teknologi dan luar angkasa', href: '/blog/film-fiksi-ilmiah-yang-bikin-mikir' },
  { category: 'Sejarah', title: 'Film Perang Terbaik Sepanjang Masa', excerpt: 'Film perang yang menghadirkan strategi dan sisi kemanusiaan.', date: '22 September 2026', image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80', alt: 'Lanskap dramatis untuk artikel film perang', href: '/blog/film-perang-terbaik-sepanjang-masa' },
  { category: 'Wawasan', title: 'Film Dokumenter Menarik Penambah Wawasan', excerpt: 'Pilihan dokumenter untuk belajar melalui cerita nyata.', date: '22 September 2026', image: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&w=900&q=80', alt: 'Kamera dokumenter dalam proses produksi', href: '/blog/film-dokumenter-menarik-penambah-wawasan' },
  { category: 'Anime', title: 'Anime Movie Terbaik yang Wajib Ditonton', excerpt: 'Film anime dengan emosi, visual, dan cerita yang kuat.', date: '22 September 2026', image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=900&q=80', alt: 'Ilustrasi layar untuk artikel anime movie', href: '/blog/anime-movie-terbaik-wajib-ditonton' },
  { category: 'Film Indonesia', title: 'Mengenal warna baru perfilman Indonesia', excerpt: 'Cerita lokal terus berkembang. Simak hal-hal yang membuat film Indonesia semakin menarik untuk diikuti.', date: '8 September 2026', image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=900&q=80', alt: 'Kamera produksi film dalam suasana studio', href: '/blog' },
  { category: 'Panduan', title: 'Panduan menemukan film dan serial favorit', excerpt: 'Gunakan genre, rating, dan daftar tontonan untuk menemukan judul yang sesuai dengan selera kamu.', date: '2 September 2026', image: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=900&q=80', alt: 'Interior bioskop dengan kursi dan layar besar', href: '/blog' },
];

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-[#07080a] px-5 py-12 text-gray-200 sm:px-8 md:py-16">
      <SEO title="Blog Film dan Serial" description="Baca rekomendasi, panduan, dan cerita seputar film dan serial di Blog Filmanesia." url="https://www.filmanesia.com/blog" />
      <div className="mx-auto max-w-6xl">
        <header className="mb-12 max-w-2xl">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.22em] text-red-400">Filmanesia Journal</p>
          <h1 className="mb-4 text-4xl font-black tracking-tight text-white sm:text-5xl">Cerita, rekomendasi, dan panduan film</h1>
          <p className="text-lg leading-8 text-gray-400">Temukan inspirasi tontonan baru dan baca sudut pandang menarik tentang dunia film dan serial.</p>
        </header>
        <div className="grid gap-5 md:grid-cols-3">
          {ARTICLES.map(({ category, title, excerpt, date, alt, href }) => (
            <article key={title} className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.035] transition-colors hover:border-red-400/40">
              <Link to={href} aria-label={`Baca ${title}`}><TmdbBlogImage query={title} fallback="/preview.png" alt={`${alt} dari TMDB`} /></Link>
              <div className="p-6"><p className="mb-3 text-xs font-bold uppercase tracking-wider text-red-400">{category}</p><h2 className="mb-3 text-xl font-bold leading-snug text-white group-hover:text-red-300"><Link to={href}>{title}</Link></h2><p className="mb-6 text-sm leading-6 text-gray-500">{excerpt}</p><div className="flex items-center justify-between"><time className="text-xs text-gray-600">{date}</time><Link to={href} className="text-xs font-semibold text-red-400 hover:text-red-300">Baca artikel →</Link></div></div>
            </article>
          ))}
        </div>
        <section className="mt-12 rounded-2xl border border-red-500/20 bg-red-500/[0.06] p-6 sm:p-8"><h2 className="mb-2 text-xl font-bold text-white">Jelajahi lebih banyak film</h2><p className="mb-5 text-sm leading-6 text-gray-400">Lanjutkan menemukan tontonan favoritmu dari koleksi Film dan Serial TV Filmanesia.</p><div className="flex flex-wrap gap-3"><Link to="/movies" className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-500">Jelajahi Film</Link><Link to="/series" className="rounded-lg border border-white/10 px-4 py-2.5 text-sm font-semibold text-gray-300 hover:border-white/25 hover:text-white">Lihat Serial TV</Link></div></section>
      </div>
    </main>
  );
}
