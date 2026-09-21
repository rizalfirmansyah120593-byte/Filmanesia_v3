import { Link } from 'react-router-dom';
import SEO from './SEO';

const ARTICLES = [
  { category: 'Rekomendasi', title: 'Rekomendasi Film Indonesia Terbaik Sepanjang Masa', excerpt: 'Pilihan film lokal dengan cerita kuat, karakter membekas, dan tema yang tetap relevan.', date: '12 September 2026', image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=900&q=80', alt: 'Layar bioskop menampilkan suasana sinematik', href: '/blog/film-indonesia-terbaik' },
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
          {ARTICLES.map(({ category, title, excerpt, date, image, alt, href }) => (
            <article key={title} className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.035] transition-colors hover:border-red-400/40">
              <Link to={href} aria-label={`Baca ${title}`}><img src={image} alt={alt} loading="lazy" className="h-44 w-full object-cover opacity-85 transition duration-500 group-hover:scale-105 group-hover:opacity-100" /></Link>
              <div className="p-6"><p className="mb-3 text-xs font-bold uppercase tracking-wider text-red-400">{category}</p><h2 className="mb-3 text-xl font-bold leading-snug text-white group-hover:text-red-300"><Link to={href}>{title}</Link></h2><p className="mb-6 text-sm leading-6 text-gray-500">{excerpt}</p><div className="flex items-center justify-between"><time className="text-xs text-gray-600">{date}</time><Link to={href} className="text-xs font-semibold text-red-400 hover:text-red-300">Baca artikel →</Link></div></div>
            </article>
          ))}
        </div>
        <section className="mt-12 rounded-2xl border border-red-500/20 bg-red-500/[0.06] p-6 sm:p-8"><h2 className="mb-2 text-xl font-bold text-white">Jelajahi lebih banyak film</h2><p className="mb-5 text-sm leading-6 text-gray-400">Lanjutkan menemukan tontonan favoritmu dari koleksi Film dan Serial TV Filmanesia.</p><div className="flex flex-wrap gap-3"><Link to="/movies" className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-500">Jelajahi Film</Link><Link to="/series" className="rounded-lg border border-white/10 px-4 py-2.5 text-sm font-semibold text-gray-300 hover:border-white/25 hover:text-white">Lihat Serial TV</Link></div></section>
      </div>
    </main>
  );
}
