import { Link, useLocation } from 'react-router-dom';
import SEO from './SEO';

const PAGES = {
  '/tentang': {
    title: 'Tentang Filmanesia',
    description: 'Tentang katalog dan panduan film Filmanesia.',
    content: (
      <>
        <p>Filmanesia membantu pengunjung menemukan film dan serial TV melalui katalog, genre, informasi pemeran, tren, dan artikel hiburan.</p>
        <p>Informasi film dan serial bersumber dari TMDB. Ketersediaan tontonan dan tautan penyedia pihak ketiga dapat berubah; periksa layanan resmi untuk informasi terbaru.</p>
      </>
    ),
  },
  '/kontak': {
    title: 'Kontak Filmanesia',
    description: 'Hubungi Filmanesia melalui telepon atau email.',
    content: (
      <p>Untuk pertanyaan tentang Filmanesia, hubungi <a className="text-red-400 underline" href="tel:+6281293161515">+62 812-9316-1515</a> atau kirim email ke <a className="text-red-400 underline" href="mailto:contact@filmanesia.com">contact@filmanesia.com</a>.</p>
    ),
  },
  '/syarat-ketentuan': {
    title: 'Syarat dan Ketentuan',
    description: 'Syarat penggunaan situs Filmanesia.',
    content: (
      <>
        <p>Dengan menggunakan Filmanesia, pengunjung setuju untuk menggunakan situs secara sah dan tidak mengganggu layanan atau hak pihak lain.</p>
        <p>Informasi katalog disediakan untuk tujuan penemuan dan dapat berubah. Filmanesia tidak menjamin ketersediaan, akurasi, atau status hak atas konten pada layanan pihak ketiga. Pengunjung bertanggung jawab memeriksa syarat layanan dan ketentuan usia dari penyedia terkait.</p>
        <p>Nama, logo, dan metadata pihak ketiga tetap menjadi milik pemiliknya. Data film dan serial dapat berasal dari TMDB.</p>
      </>
    ),
  },
};

export default function InfoPage() {
  const { pathname } = useLocation();
  const page = PAGES[pathname] ?? PAGES['/tentang'];

  return (
    <article className="min-h-screen bg-[#07080a] px-4 py-12 text-gray-200 sm:px-8 md:py-16">
      <SEO title={page.title} description={page.description} url={`https://www.filmanesia.com${pathname}`} />
      <div className="mx-auto max-w-3xl space-y-6 leading-8">
        <Link className="text-sm text-gray-400 hover:text-white" to="/">Beranda</Link>
        <h1 className="text-4xl font-black text-white">{page.title}</h1>
        <div className="space-y-5 text-gray-300">{page.content}</div>
      </div>
    </article>
  );
}
