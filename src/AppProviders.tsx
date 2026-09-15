import type { ReactNode } from 'react';
import { CatalogProvider } from './context/CatalogContext';

/** All app-wide providers. */
export function AppProviders({ children }: { children: ReactNode }) {
  return <CatalogProvider>{children}</CatalogProvider>;
}
