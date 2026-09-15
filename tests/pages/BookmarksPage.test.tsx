import { screen, waitFor, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AppRoutes } from '../../src/AppRoutes';
import { expectNoAxeViolations } from '../helpers/axe';
import { signedInApi } from '../helpers/fakeApi';
import { locationRef, renderWithProviders } from '../helpers/renderWithProviders';

describe('BookmarksPage', () => {
  it('groups bookmarked movies and TV series', async () => {
    const api = signedInApi({ listBookmarks: async () => ['beyond-earth', 'the-diary'] });
    const { container } = renderWithProviders(<AppRoutes />, { route: '/bookmarks', api });

    const h1 = await screen.findByRole('heading', { level: 1, name: 'Bookmarked shows' });
    expect(h1).toHaveClass('visually-hidden');
    const movies = await screen.findByRole('region', { name: 'Bookmarked Movies' });
    const series = screen.getByRole('region', { name: 'Bookmarked TV Series' });
    expect(within(movies).getByRole('article', { name: 'Beyond Earth' })).toBeInTheDocument();
    expect(within(series).getByRole('article', { name: 'The Diary' })).toBeInTheDocument();
    expect(document.title).toBe('Bookmarked shows | Entertainment web app');
    await expectNoAxeViolations(container);
  });

  it('hides an empty group', async () => {
    const api = signedInApi({ listBookmarks: async () => ['beyond-earth'] });
    renderWithProviders(<AppRoutes />, { route: '/bookmarks', api });
    await screen.findByRole('region', { name: 'Bookmarked Movies' });
    expect(screen.queryByRole('heading', { name: 'Bookmarked TV Series' })).not.toBeInTheDocument();
  });

  it('shows an empty state when nothing is bookmarked', async () => {
    renderWithProviders(<AppRoutes />, { route: '/bookmarks', api: signedInApi() });
    expect(await screen.findByText("You haven't bookmarked any shows yet.")).toBeInTheDocument();
    expect(screen.queryByRole('heading', { level: 2 })).not.toBeInTheDocument();
  });

  it('removes a card immediately when its bookmark is removed', async () => {
    const api = signedInApi({ listBookmarks: async () => ['beyond-earth', 'bottom-gear'] });
    const { user } = renderWithProviders(<AppRoutes />, { route: '/bookmarks', api });
    await user.click(await screen.findByRole('button', { name: 'Remove Beyond Earth from bookmarks' }));
    expect(screen.queryByRole('article', { name: 'Beyond Earth' })).not.toBeInTheDocument();
    expect(screen.getByRole('article', { name: 'Bottom Gear' })).toBeInTheDocument();
  });

  it('goes Home after signing out on this page', async () => {
    const api = signedInApi({ listBookmarks: async () => ['beyond-earth'] });
    const { user } = renderWithProviders(<AppRoutes />, { route: '/bookmarks', api });
    const accountButton = await screen.findByRole('button', { name: 'Account menu' });
    await user.click(accountButton);
    await user.click(screen.getByRole('button', { name: 'Sign out' }));
    await waitFor(() => expect(locationRef.current.pathname).toBe('/'));
  });
});
