import { screen, waitFor, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ApiError } from '../../src/api/ApiClient';
import { AppRoutes } from '../../src/AppRoutes';
import { deferred } from '../helpers/deferred';
import { signedInApi } from '../helpers/fakeApi';
import { locationRef, renderWithProviders } from '../helpers/renderWithProviders';

describe('BookmarksContext', () => {
  it('updates the button immediately, before the save finishes', async () => {
    const save = deferred();
    const api = signedInApi({ addBookmark: () => save.promise });
    const { user } = renderWithProviders(<AppRoutes />, { route: '/movies', api });
    const button = await screen.findByRole('button', { name: 'Bookmark Beyond Earth' });
    await user.click(button);
    expect(screen.getByRole('button', { name: 'Remove Beyond Earth from bookmarks' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(api.addBookmark).toHaveBeenCalledWith('beyond-earth');
    save.resolve();
  });

  it('reverts and shows a friendly toast when saving fails', async () => {
    const api = signedInApi({
      addBookmark: async () => {
        throw new ApiError(500, 'INTERNAL_ERROR');
      },
    });
    const { user } = renderWithProviders(<AppRoutes />, { route: '/movies', api });
    await user.click(await screen.findByRole('button', { name: 'Bookmark Beyond Earth' }));
    expect(await screen.findByText("We couldn't update your bookmarks. Please try again.")).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Bookmark Beyond Earth' })).toHaveAttribute('aria-pressed', 'false');
  });

  it('reverts and asks to log in again when the session has ended', async () => {
    const api = signedInApi({
      removeBookmark: async () => {
        throw new ApiError(401, 'UNAUTHENTICATED');
      },
      listBookmarks: async () => ['beyond-earth'],
    });
    const { user } = renderWithProviders(<AppRoutes />, { route: '/movies', api });
    await user.click(await screen.findByRole('button', { name: 'Remove Beyond Earth from bookmarks' }));
    expect(await screen.findByText('Your session has ended. Please log in again.')).toBeInTheDocument();
    await waitFor(() => expect(locationRef.current.pathname).toBe('/login'));
    expect(new URLSearchParams(locationRef.current.search).get('returnTo')).toBe('/movies');
  });

  it('clears bookmarks on sign-out', async () => {
    const api = signedInApi({ listBookmarks: async () => ['beyond-earth'] });
    const { user } = renderWithProviders(<AppRoutes />, { route: '/movies', api });
    await screen.findByRole('button', { name: 'Remove Beyond Earth from bookmarks' });
    await user.click(screen.getByRole('button', { name: 'Account menu' }));
    const menu = document.getElementById(
      screen.getByRole('button', { name: 'Account menu' }).getAttribute('aria-controls') ?? '',
    ) as HTMLElement;
    await user.click(within(menu).getByRole('button', { name: 'Sign out' }));
    expect(await screen.findByRole('button', { name: 'Bookmark Beyond Earth' })).toHaveAttribute('aria-pressed', 'false');
  });
});
