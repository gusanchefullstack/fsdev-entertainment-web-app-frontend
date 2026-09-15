import { Route, Routes } from 'react-router';
import { HomePage } from './pages/HomePage/HomePage';
import { LoginPage } from './pages/LoginPage/LoginPage';
import { MoviesPage } from './pages/MoviesPage/MoviesPage';
import { NotFoundPage } from './pages/NotFoundPage/NotFoundPage';
import { SignUpPage } from './pages/SignUpPage/SignUpPage';
import { TvSeriesPage } from './pages/TvSeriesPage/TvSeriesPage';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/movies" element={<MoviesPage />} />
      <Route path="/tv-series" element={<TvSeriesPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/sign-up" element={<SignUpPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
