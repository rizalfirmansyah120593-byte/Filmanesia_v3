import { Link, useParams } from 'react-router-dom';
import SEO from './SEO';

const PILLARS = {
  'film-terbaru': {
    title: 'Film Terbaru 2026',
    description: 'Daftar film terbaru yang sedang ramai dibicarakan, lengkap dengan sinopsis, pemeran, genre, rating, dan informasi tayang.',
    intro: 'Temukan film terbaru dari bioskop, layanan streaming, dan berbagai negara. Halaman ini diperbarui ketika ada rilisan, trailer, atau informasi tayang baru.',
    tips: ['Periksa tanggal rilis dan wilayah tayang sebelum menonton.', 'Gunakan filter genre untuk menemukan tontonan yang sesuai.', 'Baca ulasan dan rating sebagai referensi, bukan satu-satunya penentu.'],
  },
  'film-indonesia': {
    title: 'Film Indonesia Terbaik dan Terbaru',
    description: 'Rekomendasi film Indonesia terbaru dan terbaik dari berbagai genre, lengkap dengan sinopsis dan pemeran.',
    intro: 'Dari drama keluarga hingga horor dan thriller, Filmanesia merangkum film Indonesia yang layak masuk daftar tontonan kamu.',
    tips: ['Jelajahi film berdasarkan genre dan tahun rilis.', 'Perhatikan peringatan usia sebelum menonton.', 'Ikuti halaman ini untuk pembaruan film lokal terbaru.'],
  },
  'film-netflix': {
    title: 'Film Netflix Terbaru 2026',
    description: 'Panduan film Netflix terbaru dan rekomendasi tontonan populer berdasarkan genre, negara, dan rating.',
    intro: 'Cari ide tontonan Netflix tanpa menghabiskan waktu terlalu lama memilih. Kami mengelompokkan judul populer dan rilisan baru berdasarkan kebutuhan penonton.',
    tips: ['Katalog Netflix dapat berbeda menurut negara dan waktu.', 'Gunakan genre untuk mempersempit pilihan.', 'Cek tanggal pembaruan sebelum menganggap sebuah judul masih tersedia.'],
  },
  'film-horor': {
    title: 'Film Horor Terbaik dan Terbaru',
    description: 'Rekomendasi film horor terbaik, film horor terbaru, thriller supernatural, dan horor Indonesia yang wajib ditonton.',
    intro: 'Temukan rekomendasi horor berdasarkan subgenre seperti supernatural, slasher, psikologis, found footage, dan horor lokal.',
    tips: ['Pilih subgenre sesuai tingkat ketegangan yang kamu sukai.', 'Baca ulasan singkat tanpa spoiler.', 'Periksa rating usia dan peringatan konten.'],
  },
  'film-berdasarkan-genre': {
    title: 'Film Berdasarkan Genre',
    description: 'Jelajahi film aksi, drama, komedi, horor, thriller, romantis, animasi, dan genre populer lainnya.',
    intro: 'Halaman genre membantu kamu menemukan film dengan cepat. Pilih kategori untuk melihat judul populer dan film yang baru ditambahkan.',
    tips: ['Mulai dari genre yang paling sering kamu tonton.', 'Gunakan rating dan tahun untuk menyaring hasil.', 'Bandingkan beberapa pilihan sebelum menentukan tontonan.'],
  },
  'film-berdasarkan-tahun': {
    title: 'Film Berdasarkan Tahun Rilis',
    description: 'Temukan film berdasarkan tahun rilis, mulai dari film terbaru hingga film klasik yang tetap relevan.',
    intro: 'Koleksi berdasarkan tahun cocok untuk mencari film nostalgia, film terbaik satu dekade, atau rilisan terbaru dalam satu tempat.',
    tips: ['Gunakan tahun untuk membuat daftar tontonan bertema.', 'Periksa versi remake dan sekuel yang memiliki judul mirip.', 'Lihat detail film untuk mengetahui durasi dan pemeran.'],
  },
  'review-film': {
    title: 'Review Film dan Analisis Cerita',
    description: 'Baca review film, pendapat editor, analisis cerita, kelebihan, kekurangan, dan rekomendasi film serupa.',
    intro: 'Review Filmanesia menggabungkan informasi dasar dengan pendapat editorial agar kamu dapat memutuskan apakah sebuah film layak ditonton.',
    tips: ['Rating internal adalah opini editor, bukan skor resmi.', 'Gunakan bagian kelebihan dan kekurangan untuk ekspektasi yang realistis.', 'Baca rekomendasi film serupa setelah review selesai.'],
  },
  'jadwal-bioskop': {
    title: 'Jadwal Film Bioskop Minggu Ini',
    description: 'Panduan film bioskop minggu ini, film yang sedang tayang, dan informasi rilisan layar lebar terbaru.',
    intro: 'Cari film yang sedang tayang dan persiapkan kunjungan bioskop kamu. Jadwal dapat berbeda berdasarkan kota dan jaringan bioskop.',
    tips: ['Konfirmasi jam tayang di situs bioskop sebelum berangkat.', 'Jadwal film dapat berubah tanpa pemberitahuan.', 'Gunakan kota kamu untuk mendapatkan hasil yang paling relevan.'],
  },
  'film-yang-akan-datang': {
    title: 'Film yang Akan Datang 2026',
    description: 'Daftar film yang akan datang, tanggal rilis, trailer, pemeran, dan kabar terbaru produksi film.',
    intro: 'Ikuti film mendatang yang sudah diumumkan, mulai dari sekuel besar hingga film orisinal yang patut dinantikan.',
    tips: ['Tanggal rilis dapat berubah sesuai pengumuman distributor.', 'Trailer tidak selalu menggambarkan keseluruhan cerita.', 'Simpan judul yang ingin kamu pantau.'],
  },
  'ending-explanation': {
    title: 'Ending Film Dijelaskan',
    description: 'Penjelasan ending film, teori cerita, makna adegan terakhir, dan jawaban atas pertanyaan yang sering muncul.',
    intro: 'Peringatan spoiler: halaman ini membahas akhir cerita secara langsung. Baca setelah selesai menonton agar pengalaman menonton tetap maksimal.',
    tips: ['Pastikan kamu sudah menonton film sebelum membaca.', 'Bedakan fakta cerita dan teori penonton.', 'Gunakan pembahasan untuk menemukan detail yang mungkin terlewat.'],
  },
  'rekomendasi-film': {
    title: 'Rekomendasi Film Terbaik',
    description: 'Rekomendasi film terbaik berdasarkan genre, suasana, film favorit, dan tren tontonan terbaru.',
    intro: 'Butuh tontonan malam ini? Temukan pilihan film berdasarkan suasana, genre, durasi, dan judul yang pernah kamu sukai.',
    tips: ['Coba rekomendasi berdasarkan film yang sudah kamu sukai.', 'Periksa durasi jika waktu menonton terbatas.', 'Eksplorasi film dari negara dan genre yang berbeda.'],
  },
};

const related = Object.entries(PILLARS);

export default function EditorialPage() {
  const { slug } = useParams();
  const page = PILLARS[slug] || PILLARS['rekomendasi-film'];
  const canonical = `https://www.filmanesia.com/${slug}`;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: page.title,
    description: page.description,
    url: canonical,
    inLanguage: 'id-ID',
    isPartOf: { '@id': 'https://www.filmanesia.com/#website' },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Beranda', item: 'https://www.filmanesia.com/' },
        { '@type': 'ListItem', position: 2, name: page.title, item: canonical },
      ],
    },
  };

  return (
    <article className="min-h-screen bg-[#07080a] text-gray-200 px-4 sm:px-8 py-10 md:py-16">
      <SEO title={page.title} description={page.description} url={canonical} jsonLd={jsonLd} />
      <div className="max-w-5xl mx-auto">
        <nav aria-label="Breadcrumb" className="text-sm text-gray-500 mb-8">
          <Link to="/" className="hover:text-red-400">Beranda</Link><span className="mx-2">/</span><span>{page.title}</span>
        </nav>
        <header className="max-w-3xl mb-12">
          <p className="text-red-400 text-xs font-bold uppercase tracking-[0.22em] mb-4">Panduan Filmanesia</p>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white mb-5">{page.title}</h1>
          <p className="text-lg leading-8 text-gray-400">{page.intro}</p>
        </header>
        <section aria-labelledby="panduan" className="grid md:grid-cols-3 gap-4 mb-14">
          {page.tips.map((tip, index) => <div key={tip} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5"><span className="text-red-400 font-bold">0{index + 1}</span><p className="mt-3 text-gray-300 leading-7">{tip}</p></div>)}
        </section>
        <section className="mb-14">
          <h2 id="panduan" className="text-2xl font-bold text-white mb-4">Jelajahi Film di Filmanesia</h2>
          <p className="text-gray-400 leading-8 mb-6">Gunakan halaman berikut untuk membandingkan film berdasarkan genre, tahun, popularitas, dan kebutuhan tontonan. Informasi judul dapat diperbarui mengikuti data film terbaru.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <Link to="/movies" className="rounded-xl bg-red-500/15 border border-red-500/20 p-4 text-white hover:bg-red-500/25">Film populer dan terbaru →</Link>
            <Link to="/series" className="rounded-xl bg-white/5 border border-white/10 p-4 text-white hover:bg-white/10">Serial TV dan drama →</Link>
            <Link to="/movies/horror" className="rounded-xl bg-white/5 border border-white/10 p-4 text-white hover:bg-white/10">Film horor →</Link>
          </div>
        </section>
        <section aria-labelledby="artikel-terkait">
          <h2 id="artikel-terkait" className="text-2xl font-bold text-white mb-5">Panduan Terkait</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {related.filter(([key]) => key !== slug).slice(0, 6).map(([key, item]) => <Link key={key} to={`/${key}`} className="rounded-2xl border border-white/10 p-5 hover:border-red-400/40 hover:bg-white/[0.04] transition-colors"><h3 className="font-semibold text-white">{item.title}</h3><p className="text-sm text-gray-500 mt-2 line-clamp-2">{item.description}</p></Link>)}
          </div>
        </section>
      </div>
    </article>
  );
}

export { PILLARS };
