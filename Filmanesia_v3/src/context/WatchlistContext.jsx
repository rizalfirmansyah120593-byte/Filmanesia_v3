import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'filmanesia_watchlist';
const WatchlistContext = createContext(null);

function readItems() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch { return []; }
}

export function WatchlistProvider({ children }) {
  const [watchlistItems, setWatchlistItems] = useState(readItems);
  const watchlistIds = useMemo(() => new Set(watchlistItems.map((item) => String(item.mediaId))), [watchlistItems]);
  useEffect(() => { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(watchlistItems)); } catch { /* storage unavailable */ } }, [watchlistItems]);
  const toggleWatchlist = useCallback((item) => {
    setWatchlistItems((current) => current.some((saved) => String(saved.mediaId) === String(item.mediaId))
      ? current.filter((saved) => String(saved.mediaId) !== String(item.mediaId))
      : [{ ...item, addedAt: new Date().toISOString() }, ...current]);
  }, []);
  return <WatchlistContext.Provider value={{ watchlistIds, watchlistItems, toggleWatchlist, ready: true, user: { uid: 'local' } }}>{children}</WatchlistContext.Provider>;
}

export function useWatchlist() {
  const context = useContext(WatchlistContext);
  if (!context) throw new Error('useWatchlist must be used inside WatchlistProvider');
  return context;
}
