import { useState } from 'react';
import { AppLayout } from '../../components/AppLayout/AppLayout';
import { renderBookmarkButton } from '../../components/BookmarkButton/BookmarkButton';
import { ContentSection } from '../../components/ContentSection/ContentSection';
import { SearchBar } from '../../components/SearchBar/SearchBar';
import { SearchResults } from '../../components/SearchResults/SearchResults';
import { ShowGrid } from '../../components/ShowGrid/ShowGrid';
import { StatusMessage } from '../../components/StatusMessage/StatusMessage';
import { TrendingRow } from '../../components/TrendingRow/TrendingRow';
import { useCatalog, useRecommendedShows, useTrendingShows } from '../../context/CatalogContext';
import { friendlyMessage } from '../../lib/errorMessages';
import { searchShows } from '../../lib/searchShows';
import { useDocumentTitle } from '../../lib/useDocumentTitle';

export function HomePage() {
  useDocumentTitle('Home');
  const { status, shows, retry } = useCatalog();
  const trending = useTrendingShows();
  const recommended = useRecommendedShows();
  const [term, setTerm] = useState('');
  const results = searchShows(shows, term);

  return (
    <AppLayout>
      <h1 className="visually-hidden">Home</h1>
      <SearchBar label="Search for movies or TV series" value={term} onChange={setTerm} />
      {status === 'loading' && <StatusMessage variant="loading" />}
      {status === 'error' && (
        <StatusMessage variant="error" message={friendlyMessage('CATALOG_LOAD')} onRetry={retry} />
      )}
      {status === 'ready' &&
        (results ? (
          <SearchResults term={term} results={results} />
        ) : (
          <>
            <ContentSection title="Trending" variant="trending">
              <TrendingRow shows={trending} renderActions={renderBookmarkButton} />
            </ContentSection>
            <ContentSection title="Recommended for you">
              <ShowGrid shows={recommended} renderActions={renderBookmarkButton} />
            </ContentSection>
          </>
        ))}
    </AppLayout>
  );
}
