import { Route, Routes } from 'react-router';
import { NotFoundPage } from './pages/NotFoundPage/NotFoundPage';

export function App() {
  return (
    <Routes>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
