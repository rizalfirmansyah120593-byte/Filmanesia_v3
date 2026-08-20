import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  BiSearch,
  BiHomeAlt,
  BiMoviePlay,
  BiTv,
  BiBookmark,
  BiChevronLeft,
  BiChevronRight
} from 'react-icons/bi';
import { FaSignOutAlt, FaUserCircle } from 'react-icons/fa';
import { GENRES, SPECIAL_CATEGORIES } from './tmdb';
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../../firebase";

const NAV_ITEMS = [
  { id: 'search', icon: BiSearch, action: 'navigate', label: 'Search' },
  { id: 'home', icon: BiHomeAlt, action: 'navigate', label: 'Home' },
  { id: 'movies', icon: BiMoviePlay, action: 'navigate', label: 'Movies' },
  { id: 'series', icon: BiTv, action: 'navigate', label: 'TV Shows' },
  { id: 'watchlist', icon: BiBookmark, action: 'navigate', label: 'Watchlist' },
];

// Read cached auth flag from localStorage for instant render
const getCachedUser = () => {
  try { return JSON.parse(localStorage.getItem('Filmanesia_user')) ?? null; } catch { return null; }
};

function Sidebar({ activePage, onNavigate, selectedGenreId, onGenreSelect, onOpenAuthModal }) {
  const [user, setUser] = useState(getCachedUser);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        const cached = { uid: currentUser.uid, displayName: currentUser.displayName, email: currentUser.email };
        localStorage.setItem('Filmanesia_user', JSON.stringify(cached));
      } else {
        localStorage.removeItem('Filmanesia_user');
      }
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const ACTIVE_MAP = { search: 'search', movies: 'movies', series: 'series', watchlist: 'watchlist', home: 'home' };
  const activeId = ACTIVE_MAP[activePage] ?? 'home';

  const showCategories = activePage === 'movies' || activePage === 'series';
  const genreType = activePage === 'movies' ? 'movie' : 'tv';
  const allCategories = showCategories
    ? [...GENRES[genreType], ...SPECIAL_CATEGORIES[genreType]].sort((a, b) => a.name.localeCompare(b.name))
    : [];

  return (
    <aside className="
      fixed top-0 left-0 h-full z-50
      hidden md:flex flex-col
      ${isExpanded ? 'w-[260px]' : 'w-[84px]'}
      bg-gray-900/95 backdrop-blur-xl
      border-r border-white/10
      shadow-2xl shadow-black/30
      overflow-hidden
      transition-[width] duration-300 ease-in-out
      select-none
    ">

      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-red-500/10 to-transparent pointer-events-none" />

      {/* Desktop sidebar toggle */}
      <button
        type="button"
        onClick={() => setIsExpanded((expanded) => !expanded)}
        aria-label={isExpanded ? 'Tutup menu samping' : 'Buka menu samping'}
        title={isExpanded ? 'Tutup menu' : 'Buka menu'}
        className={`absolute top-5 ${isExpanded ? 'right-3' : 'right-2'} z-20 flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-[#171923]/95 text-gray-400 shadow-lg transition-all hover:border-red-400/50 hover:bg-red-500/15 hover:text-white focus:outline-none focus:ring-2 focus:ring-red-400/50`}
      >
        {isExpanded ? <BiChevronLeft className="text-xl" /> : <BiChevronRight className="text-xl" />}
      </button>

      {/* Logo */}
      <button onClick={() => onNavigate('home')} className="relative flex items-center gap-4 px-[18px] pt-8 pb-8 shrink-0 text-left hover:opacity-90 transition-opacity">
        <div className="flex items-center justify-center w-[48px] h-[48px] shrink-0">
          <img src="/filmanesia-icon.svg" alt="Filmanesia" className="w-full h-full drop-shadow-lg" />
        </div>
        <div className={`flex flex-col leading-tight whitespace-nowrap transition-opacity duration-200 ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>
          <img src="/filmanesia-logo.svg" alt="Filmanesia" className="w-[154px] h-auto" />
          <span className="text-red-400/70 text-[10px] font-semibold tracking-[0.22em] uppercase mt-0.5">Streaming</span>
        </div>
      </button>

      {/* Nav section label */}
      <div className="px-[18px] mb-1 shrink-0">
        <span className={`transition-opacity duration-200 text-[11px] font-bold tracking-[0.22em] uppercase text-gray-500 whitespace-nowrap ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>
          Menu
        </span>
      </div>

      {/* Nav items */}
      <nav className={`flex flex-col gap-1 px-[10px] ${showCategories ? 'shrink-0 pb-3' : 'flex-1 pb-6'}`}>
        {NAV_ITEMS.map(({ id, icon: Icon, action, label }) => {
          const isActive = activeId === id;
          return (
            <button
              key={id}
              onClick={() => onNavigate(id)}
              title={label}
              className={`
                relative flex items-center gap-4 px-4 py-3.5 rounded-2xl
                w-full text-[14px] font-medium whitespace-nowrap
                border-2 transition-colors duration-200 focus:outline-none
                ${isActive
                  ? 'border-red-500/35 bg-red-500/15 text-white shadow-sm shadow-red-950/30'
                  : 'border-transparent text-gray-400 hover:text-white hover:bg-white/5 hover:border-transparent'
                }
              `}
            >
              <Icon className={`text-[24px] shrink-0 transition-colors duration-200 ${isActive ? 'text-red-400' : ''}`} />
              <span className={`transition-opacity duration-200 ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>
                {label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Categories section — only on movies / series */}
      {showCategories && (
        <>
          <div className="mx-[18px] h-px bg-gradient-to-r from-transparent via-white/10 to-transparent shrink-0" />
          <div className="flex-1 flex flex-col min-h-0 pt-4 pb-4">
            {/* Section label */}
            <div className="px-[18px] mb-2 shrink-0">
              <span className={`transition-opacity duration-200 text-[11px] font-bold tracking-[0.22em] uppercase text-gray-500 whitespace-nowrap ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>
                Genres
              </span>
            </div>
            {/* Scrollable genre list */}
            <div className="flex-1 overflow-y-auto hide-scrollbar px-[10px] pt-1 flex flex-col gap-0.5">
              {allCategories.map((genre) => {
                const isActiveGenre = selectedGenreId === genre.id;
                return (
                  <button
                    key={genre.id}
                    onClick={() => onGenreSelect && onGenreSelect(genre.id)}
                    title={genre.name}
                    className={`
                      relative flex items-center gap-4 px-4 py-2.5 rounded-2xl
                      w-full text-[13px] font-medium whitespace-nowrap
                      border-2 transition-colors duration-200 focus:outline-none text-left
                      ${isActiveGenre
                        ? 'border-red-500/30 bg-red-500/15 text-white'
                        : 'border-transparent text-gray-500 hover:text-gray-200 hover:bg-white/5 hover:border-transparent'
                      }
                    `}
                  >
                    <span className={`
                      w-2 h-2 rounded-full shrink-0 transition-all duration-200
                      ${isActiveGenre ? 'bg-red-400' : 'bg-gray-700'}
                    `} />
                    <span className={`transition-opacity duration-200 ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>
                      {genre.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* Bottom spacer */}
      {!showCategories && <div className="h-6 shrink-0" />}

      {/* User profile / Logout */}
      <div className="mt-auto pt-4 pb-6 px-[10px] shrink-0 border-t border-white/5 relative z-10 bg-gray-900/95">
        {user ? (
          <button
            onClick={handleLogout}
            title="Log Out"
            className="
              relative flex items-center gap-4 px-4 py-3.5 rounded-2xl
              w-full whitespace-nowrap
              border-2 border-transparent text-gray-400 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/20 transition-colors duration-200 focus:outline-none group/user
            "
          >
            <FaSignOutAlt className="text-[24px] shrink-0" />
            <div className={`flex flex-col text-left transition-opacity duration-200 ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>
              <span className="text-white line-clamp-1 text-[13px] font-bold">{user.displayName || user.email?.split('@')[0]}</span>
              <span className="text-red-400 text-[10px] font-bold uppercase tracking-wider">Log Out</span>
            </div>
          </button>
        ) : (
          <button
            onClick={onOpenAuthModal}
            title="Log In"
            className="
              relative flex items-center gap-4 px-4 py-3.5 rounded-2xl
              w-full text-[14px] font-medium whitespace-nowrap
              border-2 border-transparent text-gray-400 hover:text-white hover:bg-white/5 hover:border-transparent transition-colors duration-200 focus:outline-none
            "
          >
            <FaUserCircle className="text-[24px] shrink-0" />
            <span className={`transition-opacity duration-200 w-24 overflow-hidden ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>
              Sign In
            </span>
          </button>
        )}
      </div>
    </aside>
  );
}

Sidebar.propTypes = {
  activePage: PropTypes.string.isRequired,
  onNavigate: PropTypes.func.isRequired,
  selectedGenreId: PropTypes.number,
  onGenreSelect: PropTypes.func,
  onOpenAuthModal: PropTypes.func
};

export default React.memo(Sidebar);
