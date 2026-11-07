import { Link } from 'react-router-dom';
import SEO from './SEO';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-[#07080a] px-4 py-16 text-center text-gray-200">
      <SEO title="Halaman tidak ditemukan | Filmanesia" description="Halaman yang dicari tidak tersedia." noindex />
      <h1 className="mb-4 text-4xl font-black text-white">Halaman tidak ditemukan</h1>
      <p className="mb-8 text-gray-400">Alamat ini tidak mengarah ke halaman Filmanesia yang tersedia.</p>
      <Link className="text-red-400 underline" to="/">Kembali ke beranda</Link>
    </div>
  );
}
