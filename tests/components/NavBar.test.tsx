import { screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AppRoutes } from '../../src/AppRoutes';
import { renderWithProviders } from '../helpers/renderWithProviders';

const LINK_NAMES = ['Home', 'Movies', 'TV Series', 'Bookmarked shows'];

describe('NavBar', () => {
  it('names the nav and every link uniquely', async () => {
    renderWithProviders(<AppRoutes />, { route: '/' });
    const nav = await screen.findByRole('navigation', { name: 'Main' });
    for (const name of LINK_NAMES) {
      expect(within(nav).getByRole('link', { name })).toBeInTheDocument();
    }
    expect(within(nav).getByRole('link', { name: 'Entertainment web app home' })).toHaveAttribute('href', '/');
    const names = within(nav)
      .getAllByRole('link')
      .map((link) => link.getAttribute('aria-label') ?? link.textContent);
    expect(new Set(names).size).toBe(names.length);
  });

  it.each([
    ['/', 'Home'],
    ['/movies', 'Movies'],
    ['/tv-series', 'TV Series'],
  ])('marks only the current page link on %s', async (route, activeName) => {
    renderWithProviders(<AppRoutes />, { route });
    const nav = await screen.findByRole('navigation', { name: 'Main' });
    for (const name of LINK_NAMES) {
      const link = within(nav).getByRole('link', { name });
      if (name === activeName) expect(link).toHaveAttribute('aria-current', 'page');
      else expect(link).not.toHaveAttribute('aria-current');
    }
  });

  it('navigates between pages', async () => {
    const { user } = renderWithProviders(<AppRoutes />, { route: '/tv-series' });
    const nav = await screen.findByRole('navigation', { name: 'Main' });
    await user.click(within(nav).getByRole('link', { name: 'Movies' }));
    expect(await screen.findByRole('heading', { level: 1, name: 'Movies' })).toBeInTheDocument();
    // Each page renders its own layout, so query the nav again.
    const navOnMovies = screen.getByRole('navigation', { name: 'Main' });
    await user.click(within(navOnMovies).getByRole('link', { name: 'Home' }));
    expect(await screen.findByRole('heading', { level: 1, name: 'Home' })).toBeInTheDocument();
  });
});
