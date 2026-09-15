import { useEffect } from 'react';

export function useDocumentTitle(page: string): void {
  useEffect(() => {
    document.title = `${page} | Entertainment web app`;
  }, [page]);
}
