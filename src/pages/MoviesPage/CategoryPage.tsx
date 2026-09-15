import type { Category } from '../../api/types';
import { AppLayout } from '../../components/AppLayout/AppLayout';
import { ContentSection } from '../../components/ContentSection/ContentSection';
import { ShowGrid } from '../../components/ShowGrid/ShowGrid';
import { StatusMessage } from '../../components/StatusMessage/StatusMessage';
import { useCatalog, useShowsByCategory } from '../../context/CatalogContext';
import { friendlyMessage } from '../../lib/errorMessages';
import { useDocumentTitle } from '../../lib/useDocumentTitle';

interface CategoryPageProps {
  title: string;
  category: Category;
}

/** Shared layout for the Movies and TV Series pages: a visible h1 followed by the grid. */
export function CategoryPage({ title, category }: CategoryPageProps) {
  useDocumentTitle(title);
  const { status, retry } = useCatalog();
  const shows = useShowsByCategory(category);

  return (
    <AppLayout>
      <ContentSection title={title} headingLevel={1}>
        {status === 'loading' && <StatusMessage variant="loading" />}
        {status === 'error' && (
          <StatusMessage variant="error" message={friendlyMessage('CATALOG_LOAD')} onRetry={retry} />
        )}
        {status === 'ready' && <ShowGrid shows={shows} />}
      </ContentSection>
    </AppLayout>
  );
}
