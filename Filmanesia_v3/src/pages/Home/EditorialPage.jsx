import { Link, useParams } from 'react-router-dom';
import SEO from './SEO';
import NotFoundPage from './NotFoundPage';
import { PILLARS } from './editorialPages';

const related = Object.entries(PILLARS);

export default function EditorialPage() {
  const { slug } = useParams();
  const page = PILLARS[slug];
  if (!page) return <NotFoundPage />;

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
