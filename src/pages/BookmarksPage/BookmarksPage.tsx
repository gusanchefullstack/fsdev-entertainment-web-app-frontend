import { useMemo } from 'react';
import { Navigate } from 'react-router';
import { AppLayout } from '../../components/AppLayout/AppLayout';
import { renderBookmarkButton } from '../../components/BookmarkButton/BookmarkButton';
import { ContentSection } from '../../components/ContentSection/ContentSection';
import { ShowGrid } from '../../components/ShowGrid/ShowGrid';
import { StatusMessage } from '../../components/StatusMessage/StatusMessage';
import { useAuth } from '../../context/AuthContext';
import { useBookmarks } from '../../context/BookmarksContext';
import { useCatalog } from '../../context/CatalogContext';
import { friendlyMessage } from '../../lib/errorMessages';
import { useDocumentTitle } from '../../lib/useDocumentTitle';

export function BookmarksPage() {
  useDocumentTitle('Bookmarked shows');
  const { status: authStatus } = useAuth();
  const { status: catalogStatus, shows, retry } = useCatalog();
  const { status: bookmarksStatus, bookmarkedIds } = useBookmarks();

  const bookmarked = useMemo(() => shows.filter((show) => bookmarkedIds.has(show.id)), [shows, bookmarkedIds]);
  const movies = bookmarked.filter((show) => show.category === 'Movie');
  const tvSeries = bookmarked.filter((show) => show.category === 'TV Series');

  if (authStatus === 'signedOut') return <Navigate to="/login?returnTo=%2Fbookmarks" replace />;

  const loading = authStatus === 'loading' || catalogStatus === 'loading' || bookmarksStatus !== 'ready';

  return (
    <AppLayout>
      <h1 className="visually-hidden">Bookmarked shows</h1>
      {catalogStatus === 'error' ? (
        <StatusMessage variant="error" message={friendlyMessage('CATALOG_LOAD')} onRetry={retry} />
      ) : loading ? (
        <StatusMessage variant="loading" />
      ) : bookmarked.length === 0 ? (
        <StatusMessage variant="empty" message={friendlyMessage('NO_BOOKMARKS')} />
      ) : (
        <>
          {movies.length > 0 && (
            <ContentSection title="Bookmarked Movies">
              <ShowGrid shows={movies} renderActions={renderBookmarkButton} />
            </ContentSection>
          )}
          {tvSeries.length > 0 && (
            <ContentSection title="Bookmarked TV Series">
              <ShowGrid shows={tvSeries} renderActions={renderBookmarkButton} />
            </ContentSection>
          )}
        </>
      )}
    </AppLayout>
  );
}
