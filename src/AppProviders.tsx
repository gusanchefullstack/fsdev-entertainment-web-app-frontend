import type { ReactNode } from 'react';
import { AuthProvider } from './context/AuthContext';
import { BookmarksProvider } from './context/BookmarksContext';
import { CatalogProvider } from './context/CatalogContext';
import { ToastProvider } from './context/ToastContext';

/** All app-wide providers. Must be rendered inside the router. */
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <CatalogProvider>
        <AuthProvider>
          <BookmarksProvider>{children}</BookmarksProvider>
        </AuthProvider>
      </CatalogProvider>
    </ToastProvider>
  );
}
