import { Link } from 'react-router-dom';
import SEO from './SEO';

const SOURCES = [
  ['Google Trends Indonesia', 'https://trends.google.com/trending?geo=ID&hl=id', 'Pantau query yang naik dan bandingkan minat pencarian.'],
  ['YouTube Trending', 'https://www.youtube.com/feed/trending', 'Temukan trailer, teaser, dan wawancara yang mulai viral.'],
  ['Netflix Top 10', 'https://www.netflix.com/tudum/top10', 'Validasi judul populer berdasarkan negara dan minggu.'],
  ['TMDB', 'https://www.themoviedb.org/', 'Periksa metadata film, pemeran, genre, dan tanggal rilis.'],
];

const FORMATS = [
  ['Sinopsis dan pemeran', 'film-x-sinopsis-pemeran-jadwal-tayang'],
  ['Ending explanation', 'ending-film-x-dijelaskan'],
  ['Film serupa', 'film-seperti-x'],
  ['Urutan menonton', 'urutan-menonton-franchise-x'],
  ['Review editorial', 'review-film-x'],
];

export default function TrendHubPage() {
  const jsonLd = { '@context': 'https://schema.org', '@type': 'WebPage', name: 'Film Trending dan Ide Artikel SEO', description: 'Pusat pemantauan tren film dan format artikel editorial Filmanesia.', url: 'https://www.filmanesia.com/trending-film', inLanguage: 'id-ID' };
  return <main className="min-h-screen bg-[#07080a] text-gray-200 px-4 sm:px-8 py-10 md:py-16">
    <SEO title="Film Trending Indonesia dan Ide Tontonan" description="Pantau film yang sedang trending di Indonesia, trailer baru, Netflix Top 10, dan rekomendasi tontonan Filmanesia." url="https://www.filmanesia.com/trending-film" jsonLd={jsonLd} />
    <div className="max-w-5xl mx-auto">
      <nav aria-label="Breadcrumb" className="text-sm text-gray-500 mb-8"><Link to="/" className="hover:text-red-400">Beranda</Link><span className="mx-2">/</span><span>Trending Film</span></nav>
      <header className="max-w-3xl mb-12"><p className="text-red-400 text-xs font-bold uppercase tracking-[0.22em] mb-4">Filmanesia Trends Desk</p><h1 className="text-4xl sm:text-5xl font-black text-white mb-5">Film Trending Indonesia</h1><p className="text-lg leading-8 text-gray-400">Pusat pemantauan judul film, trailer, serial, dan topik hiburan yang sedang naik. Gunakan halaman ini sebagai dasar riset sebelum menerbitkan artikel yang memiliki nilai orisinal.</p></header>
      <section className="mb-14"><h2 className="text-2xl font-bold text-white mb-5">Sumber yang Dipantau</h2><div className="grid sm:grid-cols-2 gap-4">{SOURCES.map(([name, url, text]) => <a key={name} href={url} target="_blank" rel="noopener noreferrer" className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 hover:border-red-400/40"><h3 className="font-semibold text-white">{name} ↗</h3><p className="text-sm text-gray-500 mt-2 leading-6">{text}</p></a>)}</div></section>
      <section className="mb-14"><h2 className="text-2xl font-bold text-white mb-5">Format Artikel Berdasarkan Search Intent</h2><div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">{FORMATS.map(([name, slug]) => <div key={slug} className="rounded-xl border border-white/10 p-4"><h3 className="font-semibold text-white">{name}</h3><code className="block text-xs text-red-300/80 mt-3 break-all">/{slug}</code></div>)}</div></section>
      <section className="rounded-2xl border border-red-500/20 bg-red-500/[0.06] p-6"><h2 className="text-xl font-bold text-white mb-3">Checklist sebelum terbit</h2><ul className="list-disc pl-5 space-y-2 text-gray-300 leading-7"><li>Pastikan topik memiliki sumber dan tanggal pembaruan.</li><li>Tambahkan pendapat editor, perbandingan, atau rekomendasi yang tidak sekadar menyalin.</li><li>Gunakan spoiler warning untuk artikel ending explanation.</li><li>Hubungkan artikel ke halaman genre, detail film, dan artikel terkait.</li><li>Jangan menerbitkan halaman hanya karena keyword sedang naik tanpa informasi yang bermanfaat.</li></ul></section>
    </div>
  </main>;
}
