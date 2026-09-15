import { screen, waitFor, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AppRoutes } from '../../src/AppRoutes';
import { createFakeApi, signedInApi } from '../helpers/fakeApi';
import { locationRef, renderWithProviders } from '../helpers/renderWithProviders';

const returnToParam = () => new URLSearchParams(locationRef.current.search).get('returnTo');

async function signInFromLogin(user: ReturnType<typeof renderWithProviders>['user']) {
  await user.type(await screen.findByLabelText('Email address'), 'qa1@example.com');
  await user.type(screen.getByLabelText('Password'), 'password1');
  await user.click(screen.getByRole('button', { name: 'Login to your account' }));
}

describe('bookmark flows', () => {
  it('completes a signed-out bookmark after signing in', async () => {
    const api = createFakeApi();
    const { user } = renderWithProviders(<AppRoutes />, { route: '/', api });
    await user.click(await screen.findByRole('button', { name: 'Bookmark Bottom Gear' }));

    await waitFor(() => expect(locationRef.current.pathname).toBe('/login'));
    expect(returnToParam()).toBe('/');
    expect(JSON.parse(sessionStorage.getItem('pendingBookmark') ?? 'null')).toEqual({
      showId: 'bottom-gear',
      returnTo: '/',
    });
    expect(api.addBookmark).not.toHaveBeenCalled();

    await signInFromLogin(user);
    await waitFor(() => expect(locationRef.current.pathname).toBe('/'));
    expect(api.addBookmark).toHaveBeenCalledWith('bottom-gear');
    expect(sessionStorage.getItem('pendingBookmark')).toBeNull();
    expect(await screen.findByRole('button', { name: 'Remove Bottom Gear from bookmarks' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });

  it('completes a signed-out bookmark after signing up', async () => {
    const api = createFakeApi();
    const { user } = renderWithProviders(<AppRoutes />, { route: '/movies', api });
    await user.click(await screen.findByRole('button', { name: 'Bookmark Beyond Earth' }));
    await waitFor(() => expect(locationRef.current.pathname).toBe('/login'));
    await user.click(screen.getByRole('link', { name: 'Sign Up' }));

    await user.type(await screen.findByLabelText('Email address'), 'qa2@example.com');
    await user.type(screen.getByLabelText('Password'), 'password1');
    await user.type(screen.getByLabelText('Repeat password'), 'password1');
    await user.click(screen.getByRole('button', { name: 'Create an account' }));

    await waitFor(() => expect(locationRef.current.pathname).toBe('/movies'));
    expect(api.addBookmark).toHaveBeenCalledWith('beyond-earth');
  });

  it('never removes an existing bookmark when applying the pending one', async () => {
    sessionStorage.setItem('pendingBookmark', JSON.stringify({ showId: 'dogs', returnTo: '/tv-series' }));
    const api = createFakeApi({ listBookmarks: async () => ['dogs'] });
    const { user } = renderWithProviders(<AppRoutes />, { route: '/login?returnTo=/tv-series', api });
    await signInFromLogin(user);
    await waitFor(() => expect(locationRef.current.pathname).toBe('/tv-series'));
    expect(await screen.findByRole('button', { name: 'Remove Dogs from bookmarks' })).toBeInTheDocument();
    expect(api.removeBookmark).not.toHaveBeenCalled();
  });

  it('saves nothing when the visitor leaves Login without signing in', async () => {
    const api = createFakeApi();
    const { user } = renderWithProviders(<AppRoutes />, { route: '/', api });
    await user.click(await screen.findByRole('button', { name: 'Bookmark Bottom Gear' }));
    await waitFor(() => expect(locationRef.current.pathname).toBe('/login'));
    await user.click(screen.getByRole('link', { name: 'Entertainment web app home' }));
    await screen.findByRole('heading', { level: 1, name: 'Home' });
    expect(api.addBookmark).not.toHaveBeenCalled();
    expect(screen.getByRole('button', { name: 'Bookmark Bottom Gear' })).toHaveAttribute('aria-pressed', 'false');
  });

  it('sends signed-out visitors from Bookmarked to Login and back', async () => {
    const { user } = renderWithProviders(<AppRoutes />, { route: '/', api: createFakeApi() });
    const nav = await screen.findByRole('navigation', { name: 'Main' });
    await user.click(within(nav).getByRole('link', { name: 'Bookmarked shows' }));
    await waitFor(() => expect(locationRef.current.pathname).toBe('/login'));
    expect(returnToParam()).toBe('/bookmarks');
    await signInFromLogin(user);
    await waitFor(() => expect(locationRef.current.pathname).toBe('/bookmarks'));
  });

  it('keeps the bookmark state in sync across pages', async () => {
    const { user } = renderWithProviders(<AppRoutes />, { route: '/', api: signedInApi() });
    const trending = await screen.findByRole('list', { name: 'Trending shows' });
    await user.click(within(trending).getByRole('button', { name: 'Bookmark Beyond Earth' }));
    const nav = screen.getByRole('navigation', { name: 'Main' });
    await user.click(within(nav).getByRole('link', { name: 'Movies' }));
    expect(await screen.findByRole('button', { name: 'Remove Beyond Earth from bookmarks' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });
});
