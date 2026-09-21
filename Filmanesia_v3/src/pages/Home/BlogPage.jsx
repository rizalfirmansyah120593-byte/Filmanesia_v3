import { Link } from 'react-router-dom';
import SEO from './SEO';

const ARTICLES = [
  ['Rekomendasi', 'Cara memilih film yang tepat untuk mood kamu', 'Temukan cara menyusun tontonan malam ini, mulai dari film ringan sampai cerita penuh kejutan.', '12 September 2026', 'from-red-500/25'],
  ['Film Indonesia', 'Mengenal warna baru perfilman Indonesia', 'Cerita lokal terus berkembang. Simak hal-hal yang membuat film Indonesia semakin menarik untuk diikuti.', '8 September 2026', 'from-amber-500/25'],
  ['Panduan', 'Panduan menemukan film dan serial favorit', 'Gunakan genre, rating, dan daftar tontonan untuk menemukan judul yang sesuai dengan selera kamu.', '2 September 2026', 'from-blue-500/25'],
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
          {ARTICLES.map(([category, title, excerpt, date, accent]) => (
            <article key={title} className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.035] transition-colors hover:border-red-400/40">
              <div className={`h-36 bg-gradient-to-br ${accent} via-[#121722] to-[#0b0d12]`} />
              <div className="p-6"><p className="mb-3 text-xs font-bold uppercase tracking-wider text-red-400">{category}</p><h2 className="mb-3 text-xl font-bold leading-snug text-white group-hover:text-red-300">{title}</h2><p className="mb-6 text-sm leading-6 text-gray-500">{excerpt}</p><time className="text-xs text-gray-600">{date}</time></div>
            </article>
          ))}
        </div>
        <section className="mt-12 rounded-2xl border border-red-500/20 bg-red-500/[0.06] p-6 sm:p-8"><h2 className="mb-2 text-xl font-bold text-white">Jelajahi lebih banyak film</h2><p className="mb-5 text-sm leading-6 text-gray-400">Lanjutkan menemukan tontonan favoritmu dari koleksi Film dan Serial TV Filmanesia.</p><div className="flex flex-wrap gap-3"><Link to="/movies" className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-500">Jelajahi Film</Link><Link to="/series" className="rounded-lg border border-white/10 px-4 py-2.5 text-sm font-semibold text-gray-300 hover:border-white/25 hover:text-white">Lihat Serial TV</Link></div></section>
      </div>
    </main>
  );
}
