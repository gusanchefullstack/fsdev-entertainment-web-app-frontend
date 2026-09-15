import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useApiClient } from '../api/ApiClient';
import type { Category, Show } from '../api/types';

type CatalogStatus = 'loading' | 'ready' | 'error';

interface CatalogValue {
  status: CatalogStatus;
  shows: Show[];
  retry: () => void;
}

const CatalogContext = createContext<CatalogValue | null>(null);

export function CatalogProvider({ children }: { children: ReactNode }) {
  const api = useApiClient();
  const [status, setStatus] = useState<CatalogStatus>('loading');
  const [shows, setShows] = useState<Show[]>([]);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setStatus('loading');
    api
      .listShows()
      .then((loaded) => {
        if (cancelled) return;
        setShows(loaded);
        setStatus('ready');
      })
      .catch(() => {
        if (!cancelled) setStatus('error');
      });
    return () => {
      cancelled = true;
    };
  }, [api, attempt]);

  const retry = useCallback(() => setAttempt((count) => count + 1), []);
  const value = useMemo(() => ({ status, shows, retry }), [status, shows, retry]);
  return <CatalogContext value={value}>{children}</CatalogContext>;
}

export function useCatalog(): CatalogValue {
  const value = useContext(CatalogContext);
  if (!value) throw new Error('useCatalog must be used inside CatalogProvider.');
  return value;
}

export function useTrendingShows(): Show[] {
  const { shows } = useCatalog();
  return useMemo(() => shows.filter((show) => show.isTrending), [shows]);
}

export function useRecommendedShows(): Show[] {
  const { shows } = useCatalog();
  return useMemo(() => shows.filter((show) => !show.isTrending), [shows]);
}

export function useShowsByCategory(category: Category): Show[] {
  const { shows } = useCatalog();
  return useMemo(() => shows.filter((show) => show.category === category), [shows, category]);
}
