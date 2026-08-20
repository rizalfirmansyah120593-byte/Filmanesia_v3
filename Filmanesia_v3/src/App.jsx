import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ParentComponent from './pages/Home/ParentComponent';
const HomePage = lazy(() => import('./pages/Home/HomePage'));
const Movie = lazy(() => import('./pages/Home/Movie/Movie'));
const Series = lazy(() => import('./pages/Home/TV/Series'));
const SearchPage = lazy(() => import('./pages/Home/SearchPage'));
const MovieDetails = lazy(() => import('./pages/Home/Movie/MovieDetails'));
const TvDetails = lazy(() => import('./pages/Home/TV/TvDetails'));
const WatchlistPage = lazy(() => import('./pages/Home/WatchlistPage'));
const ResetPasswordPage = lazy(() => import('./pages/Home/ResetPasswordPage'));
const EmailVerificationPage = lazy(() => import('./pages/Home/EmailVerificationPage'));
const PersonPage = lazy(() => import('./pages/Home/Person/PersonPage'));
const AuthActionPage = lazy(() => import('./pages/Home/AuthActionPage'));

function App() {
  return (
    <Router>
      <Suspense fallback={<div className="min-h-screen bg-[#0a0c12]" aria-label="Loading Filmanesia" />}>
        <Routes>
          <Route element={<ParentComponent />}>
          <Route index element={<HomePage />} />
          <Route path="/movies" element={<Movie />} />
          <Route path="/movies/:genreSlug" element={<Movie />} />
          <Route path="/movies/:genreSlug/:sortSlug" element={<Movie />} />
          <Route path="/series" element={<Series />} />
          <Route path="/series/:genreSlug" element={<Series />} />
          <Route path="/series/:genreSlug/:sortSlug" element={<Series />} />
          <Route path="/movies/watch/:slug" element={<MovieDetails />} />
          <Route path="/series/watch/:slug" element={<TvDetails />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/person/:id/:slug" element={<PersonPage />} />
          <Route path="/watchlist" element={<WatchlistPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/verify-email" element={<EmailVerificationPage />} />
          <Route path="/auth-action" element={<AuthActionPage />} />
          {/* Legacy detail URLs (auto-canonicalized in page components) */}
          <Route path="/movie/:slug" element={<MovieDetails />} />
          <Route path="/tv/:slug" element={<TvDetails />} />
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
