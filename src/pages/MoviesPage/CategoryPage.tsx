import { useState } from 'react';
import type { Category } from '../../api/types';
import { AppLayout } from '../../components/AppLayout/AppLayout';
import { renderBookmarkButton } from '../../components/BookmarkButton/BookmarkButton';
import { ContentSection } from '../../components/ContentSection/ContentSection';
import { SearchBar } from '../../components/SearchBar/SearchBar';
import { SearchResults } from '../../components/SearchResults/SearchResults';
import { ShowGrid } from '../../components/ShowGrid/ShowGrid';
import { StatusMessage } from '../../components/StatusMessage/StatusMessage';
import { useCatalog, useShowsByCategory } from '../../context/CatalogContext';
import { friendlyMessage } from '../../lib/errorMessages';
import { searchShows } from '../../lib/searchShows';
import { useDocumentTitle } from '../../lib/useDocumentTitle';

interface CategoryPageProps {
  title: string;
  category: Category;
  searchLabel: string;
}

/** Shared layout for the Movies and TV Series pages: a visible h1 followed by the grid. */
export function CategoryPage({ title, category, searchLabel }: CategoryPageProps) {
  useDocumentTitle(title);
  const { status, retry } = useCatalog();
  const shows = useShowsByCategory(category);
  const [term, setTerm] = useState('');
  const results = searchShows(shows, term);

  return (
    <AppLayout>
      <SearchBar label={searchLabel} value={term} onChange={setTerm} />
      <ContentSection title={title} headingLevel={1} titleHidden={results !== null}>
        {status === 'loading' && <StatusMessage variant="loading" />}
        {status === 'error' && (
          <StatusMessage variant="error" message={friendlyMessage('CATALOG_LOAD')} onRetry={retry} />
        )}
        {status === 'ready' &&
          (results ? (
            <SearchResults term={term} results={results} />
          ) : (
            <ShowGrid shows={shows} renderActions={renderBookmarkButton} />
          ))}
      </ContentSection>
    </AppLayout>
  );
}
