import type { ReactNode } from 'react';
import { AuthProvider } from './context/AuthContext';
import { CatalogProvider } from './context/CatalogContext';

/** All app-wide providers. */
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <CatalogProvider>
      <AuthProvider>{children}</AuthProvider>
    </CatalogProvider>
  );
}
