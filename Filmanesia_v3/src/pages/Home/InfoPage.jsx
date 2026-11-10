import { Link, useLocation } from 'react-router-dom';
import SEO from './SEO';

const PAGES = {
  '/tentang': {
    title: 'Tentang Filmanesia',
    description: 'Kenali Filmanesia, katalog film dan serial TV untuk menjelajahi genre, anime, K-drama, sinopsis, pemeran, tren, serta panduan tontonan.',
    content: (
      <>
        <p>Filmanesia adalah panduan penemuan film dan serial TV yang membantu Anda memilih tontonan sesuai minat. Jelajahi katalog berdasarkan genre dan popularitas, cari judul tertentu, atau kenali film melalui informasi cerita dan pemerannya.</p>
        <p>Tujuan kami adalah membuat proses menemukan tontonan terasa lebih praktis: dari mencari film yang sedang ramai dibicarakan, menjelajahi serial dari berbagai negara, hingga menemukan ide baru lewat artikel dan rekomendasi.</p>
        <h2 className="pt-2 text-2xl font-bold text-white">Jelajahi film, serial, dan anime</h2>
        <p>Gunakan halaman <Link className="text-red-400 underline" to="/movies">film</Link> dan <Link className="text-red-400 underline" to="/series">serial TV</Link> untuk menelusuri judul populer. Penggemar animasi Jepang dapat melihat pilihan di kategori <Link className="text-red-400 underline" to="/series/anime">serial anime</Link>, sementara pembaca yang mencari wawasan dan inspirasi tontonan dapat mengunjungi <Link className="text-red-400 underline" to="/blog">blog film dan serial</Link>.</p>
        <h2 className="pt-2 text-2xl font-bold text-white">Sumber informasi dan pembaruan</h2>
        <p>Metadata katalog—seperti judul, sinopsis, genre, tanggal rilis, poster, dan informasi pemeran—bersumber dari TMDB. Data dapat berubah atau memiliki keterbatasan; Filmanesia bukan penerbit film dan tidak mengklaim kepemilikan atas karya maupun materi milik pihak lain.</p>
        <p>Informasi ketersediaan, jadwal tayang, serta tautan ke layanan pihak ketiga dapat berubah sewaktu-waktu dan berbeda menurut wilayah. Sebelum menonton atau membeli tiket, periksa kembali detailnya pada situs atau aplikasi resmi penyedia terkait.</p>
        <h2 className="pt-2 text-2xl font-bold text-white">Hubungi Filmanesia</h2>
        <p>Kami terbuka terhadap masukan mengenai informasi katalog dan pengalaman menggunakan situs. Sampaikan pertanyaan atau koreksi melalui halaman <Link className="text-red-400 underline" to="/kontak">kontak Filmanesia</Link>.</p>
      </>
    ),
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Tentang Filmanesia',
      description: 'Kenali Filmanesia, katalog film dan serial TV untuk menjelajahi genre, anime, K-drama, sinopsis, pemeran, tren, serta panduan tontonan.',
      url: 'https://www.filmanesia.com/tentang',
      inLanguage: 'id-ID',
      isPartOf: { '@id': 'https://www.filmanesia.com/#website' },
      breadcrumb: {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Beranda', item: 'https://www.filmanesia.com/' },
          { '@type': 'ListItem', position: 2, name: 'Tentang Filmanesia', item: 'https://www.filmanesia.com/tentang' },
        ],
      },
    },
  },
  '/kontak': {
    title: 'Kontak Filmanesia',
    description: 'Hubungi Filmanesia melalui email.',
    content: (
      <p>Untuk pertanyaan tentang Filmanesia, kirim email ke <a className="text-red-400 underline" href="mailto:contact@filmanesia.com">contact@filmanesia.com</a>.</p>
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
      <SEO title={page.title} description={page.description} url={`https://www.filmanesia.com${pathname}`} jsonLd={page.jsonLd} />
      <div className="mx-auto max-w-3xl space-y-6 leading-8">
        <Link className="text-sm text-gray-400 hover:text-white" to="/">Beranda</Link>
        <h1 className="text-4xl font-black text-white">{page.title}</h1>
        <div className="space-y-5 text-gray-300">{page.content}</div>
      </div>
    </article>
  );
}
