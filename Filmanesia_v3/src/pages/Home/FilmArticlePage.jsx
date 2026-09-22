import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { toDetailPath } from './urlUtils';
import SEO from './SEO';

const ARTICLES = {
  'film-indonesia-terbaik': ['Rekomendasi Film Indonesia Terbaik Sepanjang Masa', 'film Indonesia terbaik', ['Petualangan Sherina', 'Ada Apa dengan Cinta?', 'Laskar Pelangi', 'Ngeri-Ngeri Sedap'], 'Film Indonesia terbaik menghadirkan cerita kuat, karakter membekas, dan tema yang tetap relevan bagi penonton lintas generasi.'],
  'film-horor-indonesia-paling-seram': ['Film Horor Indonesia Paling Seram dan Bikin Trauma', 'film horor Indonesia', ['Pengabdi Setan', 'Perempuan Tanah Jahanam', 'Sewu Dino', 'KKN di Desa Penari'], 'Pilihan horor lokal dengan atmosfer kuat, mitos dekat, dan adegan yang sulit hilang dari ingatan.'],
  'film-cina-terbaik': ['Film Cina Terbaik untuk Menemani Waktu Santai', 'film Cina', ['The Wandering Earth', 'Better Days', 'Farewell My Concubine', 'Detective Chinatown'], 'Film Cina menawarkan drama kuat, visual menarik, dan cerita yang mencerminkan perubahan sosial.'],
  'film-india-terbaik': ['Film India Terbaik: Rekomendasi Cerita Penuh Warna', 'film India', ['3 Idiots', 'Dangal', 'RRR', 'Andhadhun'], 'Film India memadukan emosi, musik, humor, dan konflik keluarga dalam cerita yang mudah membekas.'],
  'film-jepang-terbaik': ['Film Jepang Terbaik dengan Cerita yang Membekas', 'film Jepang', ['Shoplifters', 'Rashomon', 'Your Name', 'Drive My Car'], 'Film Jepang menghadirkan cerita tenang, karakter kompleks, dan detail kehidupan yang terasa manusiawi.'],
  'film-korea-terbaik': ['Film Korea Terbaik untuk Ditonton Akhir Pekan', 'film Korea', ['Parasite', 'Train to Busan', 'Decision to Leave', 'The Handmaiden'], 'Film Korea mampu menggabungkan drama, thriller, komedi, dan kritik sosial secara berani.'],
  'film-horor-terbaik': ['Film Horor Terbaik untuk Menguji Nyali', 'film horor', ['The Exorcist', 'Hereditary', 'The Conjuring', 'Pengabdi Setan'], 'Film horor terbaik membangun rasa takut melalui atmosfer, suara, karakter, dan konflik yang kuat.'],
  'film-anak-anak-terbaik': ['Film Anak-Anak Terbaik untuk Tontonan Keluarga', 'film anak-anak', ['Paddington', 'Toy Story', 'Matilda', 'The Incredibles'], 'Film anak-anak yang baik memberi hiburan sekaligus membantu keluarga membahas nilai dan emosi.'],
  'film-terbaru-yang-wajib-ditonton': ['Film Terbaru yang Wajib Masuk Daftar Tontonan', 'film terbaru', ['Oppenheimer', 'Dune: Part Two', 'Past Lives', 'The Holdovers'], 'Film terbaru memberi pengalaman segar melalui gagasan, visual, dan pendekatan cerita yang beragam.'],
  'film-bioskop-terbaru': ['Film Bioskop Terbaru yang Layak Dinantikan', 'film bioskop terbaru', ['Avatar: The Way of Water', 'Dune: Part Two', 'Top Gun: Maverick', 'Godzilla Minus One'], 'Film bioskop terbaru menawarkan pengalaman layar besar melalui suara, visual, dan skala cerita.'],
  'resident-evil-2026': ['Resident Evil 2026: Yang Perlu Diketahui Sebelum Menonton', 'Resident Evil 2026', ['Resident Evil', 'Resident Evil: Apocalypse', 'Resident Evil: Afterlife', 'Resident Evil: Welcome to Raccoon City'], 'Resident Evil menarik perhatian karena menggabungkan horor, aksi, wabah, dan dunia permainan populer.'],
  'film-daniel-rekomendasi': ['Film Daniel yang Menarik untuk Masuk Daftar Tontonan', 'film Daniel', ['Daniel', 'The Daniel Tiger Movie', 'Daniel', 'Daniel and the Lions'], 'Query film Daniel memiliki beberapa kemungkinan makna, sehingga pembaca perlu memeriksa judul dan tahun rilis.'],
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
function getSeoDescription(slug, keyword, intro) {
  const descriptions = {
    'film-jepang-terbaik': `${keyword} pilihan untuk pembaca yang menyukai cerita hening, karakter berlapis, dan detail kehidupan sehari-hari. Temukan sinopsis, kekuatan cerita, serta alasan setiap judul layak masuk daftar tontonan.`,
    'film-korea-terbaik-untuk-pemula': `Mulai mengenal ${keyword} melalui cerita yang mudah diikuti, konflik kuat, dan genre yang beragam. Panduan ini membantu pemula memilih film Korea sesuai suasana dan selera.`,
    'film-horor-indonesia-paling-seram': `${keyword} dengan atmosfer mencekam, mitos lokal, dan konflik keluarga yang terasa dekat. Simak sinopsis singkat dan alasan setiap film mampu membangun rasa takut.`,
    'film-thriller-plot-twist-tak-terduga': `Cari ${keyword} yang penuh petunjuk tersembunyi dan kejutan masuk akal. Daftar ini membahas premis, ketegangan, serta pengalaman menonton tanpa membocorkan akhir cerita.`,
    'film-keluarga-untuk-ditonton-bareng-anak': `Rekomendasi ${keyword} yang aman untuk momen bersama keluarga. Setiap pilihan menawarkan hiburan, pesan emosional, dan bahan percakapan setelah film selesai.`,
    'film-fiksi-ilmiah-yang-bikin-mikir': `${keyword} yang menggabungkan gagasan besar, teknologi, dan pertanyaan tentang manusia. Temukan film dengan konsep kuat yang tetap menarik bagi penonton umum.`,
    'film-dokumenter-menarik-penambah-wawasan': `${keyword} yang mengubah fakta menjadi cerita manusiawi dan mudah dipahami. Pilihan ini cocok untuk pembaca yang ingin menambah wawasan tanpa kehilangan pengalaman menonton.`,
    'anime-movie-terbaik-wajib-ditonton': `${keyword} dengan visual memikat, emosi kuat, dan tema yang relevan lintas usia. Simak rekomendasi beserta alasan setiap anime movie layak Anda tonton.`,
  };
  return descriptions[slug] || `${keyword} pilihan Filmanesia dengan sinopsis, kekuatan cerita, dan alasan menonton yang jelas. ${intro}`;
}

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

export default function FilmArticlePage() {
  const { slug } = useParams();
  const article = ARTICLES[slug] || ARTICLES['film-romantis-indonesia-paling-baper'];
  const [title, keyword, films, intro] = article;
  const seoDescription = getSeoDescription(slug, keyword, intro);
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
