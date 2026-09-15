import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AppRoutes } from '../../src/AppRoutes';
import { signedInApi } from '../helpers/fakeApi';
import { renderWithProviders } from '../helpers/renderWithProviders';

describe('Bookmarked page search', () => {
  it('searches only bookmarked shows in one combined list', async () => {
    const api = signedInApi({ listBookmarks: async () => ['beyond-earth', 'the-diary'] });
    const { user } = renderWithProviders(<AppRoutes />, { route: '/bookmarks', api });
    await screen.findByRole('region', { name: 'Bookmarked Movies' });

    await user.type(screen.getByRole('searchbox', { name: 'Search for bookmarked shows' }), 'Beyond');
    expect(screen.getByRole('heading', { level: 2, name: "Found 1 result for 'Beyond'" })).toBeInTheDocument();
    expect(screen.getAllByRole('article').map((article) => article.getAttribute('aria-labelledby') && article.textContent)).toHaveLength(1);
    expect(screen.getByRole('article', { name: 'Beyond Earth' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Bookmarked Movies' })).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Remove Beyond Earth from bookmarks' }));
    expect(screen.getByRole('heading', { level: 2, name: "Found 0 results for 'Beyond'" })).toBeInTheDocument();
    expect(screen.queryAllByRole('article')).toHaveLength(0);
  });

  it('returns zero results when nothing is bookmarked', async () => {
    const { user } = renderWithProviders(<AppRoutes />, { route: '/bookmarks', api: signedInApi() });
    await screen.findByText("You haven't bookmarked any shows yet.");
    await user.type(screen.getByRole('searchbox'), 'a');
    expect(screen.getByRole('heading', { level: 2, name: "Found 0 results for 'a'" })).toBeInTheDocument();
  });
});
