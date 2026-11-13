import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useLocation, useNavigate } from 'react-router-dom';
import { toDetailPath } from './urlUtils';
import HeroBanner from './HeroBanner';
import TrendingRow from './TrendingRow';
import SEO from './SEO';

// Mount below-the-fold rows only when they are close to the viewport. This keeps
// the initial page from starting seven TMDB requests and rendering every card.
function DeferredTrendingRow({ children }) {
  const containerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return undefined;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.disconnect();
      }
    }, { rootMargin: '300px 0px' });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="content-row min-h-[300px]">
      {isVisible ? children : <div aria-hidden="true" className="min-h-[300px]" />}
    </div>
  );
}

DeferredTrendingRow.propTypes = {
  children: PropTypes.node.isRequired,
};

const SectionDivider = ({ label }) => (
  <div className="flex items-center gap-4 px-4 sm:px-6 mb-8 mt-4">
    <div className="flex-1 h-px bg-white/[0.05]" />
    <span className="text-gray-600 text-[11px] font-bold uppercase tracking-[0.25em]">{label}</span>
    <div className="flex-1 h-px bg-white/[0.05]" />
  </div>
);

SectionDivider.propTypes = {
  label: PropTypes.string.isRequired,
};

export default function HomePage() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleSelect = (item, type) => {
    const mediaType = item.media_type ?? type;
    const pathname = toDetailPath(mediaType === 'tv' ? 'tv' : 'movie', item.id, item.title || item.name);
    
    let search = '';
    if (mediaType === 'tv' && item.season && item.episode) {
      search = `?season=${item.season}&episode=${item.episode}`;
    }

    navigate(
      { pathname, search },
      { state: { from: location.pathname + location.search } }
    );
  };

  const goMovies = () => navigate('/movies');
  const goSeries = () => navigate('/series');
  const goKDrama = () => navigate('/series/k-drama');
  const goAnime = () => navigate('/series/anime');

  return (
    <div className="bg-[#0a0c12] min-h-screen">
      <SEO
        title="Filmanesia — Katalog Film dan Serial TV"
        description="Jelajahi katalog film dan serial TV Filmanesia. Temukan judul populer, anime, genre favorit, sinopsis, pemeran, dan panduan tontonan."
        noSuffix
      />
      
      {/* ── Visually Hidden H1 for SEO (Brand Keyword 'Filmanesia') ── */}
      <h1 className="sr-only">Filmanesia - Katalog Film dan Serial TV</h1>

      <HeroBanner />

      <div className="pt-10 pb-8">
        {/* ── Movies ── */}
        <TrendingRow
          title="Trending Movies"
          type="movie"
          variant="trending"
          accent="#ef4444"
          onSelect={handleSelect}
          onSeeAll={goMovies}
        />
        <DeferredTrendingRow>
          <TrendingRow
            title="Top 10 Movies This Week"
            type="movie"
            variant="popular"
            showRank
            originalLanguage={['en', 'zh', 'ko', 'ja']}
            accent="#ef4444"
            onSelect={handleSelect}
            onSeeAll={goMovies}
          />
        </DeferredTrendingRow>
        <DeferredTrendingRow>
          <TrendingRow
            title="Now Playing in Theaters"
            type="movie"
            variant="now_playing"
            accent="#f59e0b"
            onSelect={handleSelect}
            onSeeAll={goMovies}
          />
        </DeferredTrendingRow>
        <DeferredTrendingRow>
          <TrendingRow
            title="K-Drama Series"
            type="tv"
            variant="kdrama"
            sinceYear={2020}
            accent="#ec4899"
            onSelect={handleSelect}
            onSeeAll={goKDrama}
          />
        </DeferredTrendingRow>

        <SectionDivider label="TV Shows" />

        {/* ── TV ── */}
        <DeferredTrendingRow>
          <TrendingRow
            title="Anime Series"
            type="tv"
            variant="anime"
            accent="#8b5cf6"
            onSelect={handleSelect}
            onSeeAll={goAnime}
          />
        </DeferredTrendingRow>
        <DeferredTrendingRow>
          <TrendingRow
            title="Asian TV Shows"
            type="tv"
            variant="popular"
            originalLanguage={['ko', 'ja', 'zh']}
            sinceYear={2020}
            accent="#f97316"
            onSelect={handleSelect}
            onSeeAll={goSeries}
          />
        </DeferredTrendingRow>
        <DeferredTrendingRow>
          <TrendingRow
            title="Trending TV Shows"
            type="tv"
            variant="trending"
            accent="#8b5cf6"
            onSelect={handleSelect}
            onSeeAll={goSeries}
          />
        </DeferredTrendingRow>
        <DeferredTrendingRow>
          <TrendingRow
            title="Top 10 Series This Week"
            type="tv"
            variant="trending"
            showRank
            accent="#8b5cf6"
            onSelect={handleSelect}
            onSeeAll={goSeries}
          />
        </DeferredTrendingRow>
      </div>
    </div>
  );
}
