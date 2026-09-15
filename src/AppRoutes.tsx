import { Route, Routes } from 'react-router';
import { HomePage } from './pages/HomePage/HomePage';
import { MoviesPage } from './pages/MoviesPage/MoviesPage';
import { NotFoundPage } from './pages/NotFoundPage/NotFoundPage';
import { TvSeriesPage } from './pages/TvSeriesPage/TvSeriesPage';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/movies" element={<MoviesPage />} />
      <Route path="/tv-series" element={<TvSeriesPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
