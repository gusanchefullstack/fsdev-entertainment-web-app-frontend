import { screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AppRoutes } from '../../src/AppRoutes';
import { expectNoAxeViolations } from '../helpers/axe';
import { signedInApi } from '../helpers/fakeApi';
import { renderWithProviders } from '../helpers/renderWithProviders';

const resultTitles = () =>
  screen.getAllByRole('article').map((article) => within(article).getByRole('heading', { level: 3 }).textContent);

describe('search scopes', () => {
  it.each([
    ['/', 'Search for movies or TV series'],
    ['/movies', 'Search for movies'],
    ['/tv-series', 'Search for TV series'],
    ['/bookmarks', 'Search for bookmarked shows'],
  ])('labels the search on %s as "%s"', async (route, label) => {
    renderWithProviders(<AppRoutes />, { route, api: signedInApi() });
    expect(await screen.findByRole('searchbox', { name: label })).toHaveAttribute('placeholder', label);
  });

  it('searches all shows on Home and hides the normal sections', async () => {
    const { user, container } = renderWithProviders(<AppRoutes />, { route: '/' });
    await screen.findByRole('list', { name: 'Trending shows' });
    await user.type(screen.getByRole('searchbox'), 'earth');

    expect(screen.getByRole('heading', { level: 2, name: "Found 2 results for 'earth'" })).toBeInTheDocument();
    expect(resultTitles()).toEqual(['Beyond Earth', 'Earth’s Untouched']);
    expect(screen.queryByRole('heading', { name: 'Trending' })).not.toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Recommended for you' })).not.toBeInTheDocument();
    await expectNoAxeViolations(container);

    await user.clear(screen.getByRole('searchbox'));
    expect(await screen.findByRole('heading', { name: 'Trending' })).toBeInTheDocument();
  });

  it('searches only movies on Movies', async () => {
    const { user } = renderWithProviders(<AppRoutes />, { route: '/movies' });
    await screen.findAllByRole('article');
    await user.type(screen.getByRole('searchbox'), 'dark');
    expect(resultTitles()).toEqual(['Darker']);
    const h1 = screen.getByRole('heading', { level: 1, name: 'Movies' });
    expect(h1).toHaveClass('visually-hidden');
  });

  it('searches only TV series on TV Series', async () => {
    const { user } = renderWithProviders(<AppRoutes />, { route: '/tv-series' });
    await screen.findAllByRole('article');
    await user.type(screen.getByRole('searchbox'), 'dark');
    expect(resultTitles()).toEqual(['Dark Side of the Moon']);
  });

  it('shows zero results and treats whitespace as no search', async () => {
    const { user } = renderWithProviders(<AppRoutes />, { route: '/' });
    await screen.findByRole('list', { name: 'Trending shows' });
    await user.type(screen.getByRole('searchbox'), 'zzz');
    expect(screen.getByRole('heading', { level: 2, name: "Found 0 results for 'zzz'" })).toBeInTheDocument();
    expect(screen.queryAllByRole('article')).toHaveLength(0);

    await user.clear(screen.getByRole('searchbox'));
    await user.type(screen.getByRole('searchbox'), '   ');
    expect(screen.getByRole('heading', { name: 'Trending' })).toBeInTheDocument();
  });

  it('starts empty on the next page', async () => {
    const { user } = renderWithProviders(<AppRoutes />, { route: '/movies' });
    await screen.findAllByRole('article');
    await user.type(screen.getByRole('searchbox'), 'dark');
    await user.click(within(screen.getByRole('navigation', { name: 'Main' })).getByRole('link', { name: 'TV Series' }));
    const searchbox = await screen.findByRole('searchbox', { name: 'Search for TV series' });
    expect(searchbox).toHaveValue('');
    expect(screen.getAllByRole('article')).toHaveLength(14);
  });

  it('closes the avatar menu when typing a search', async () => {
    const { user } = renderWithProviders(<AppRoutes />, { route: '/', api: signedInApi() });
    const accountButton = await screen.findByRole('button', { name: 'Account menu' });
    await user.click(accountButton);
    expect(accountButton).toHaveAttribute('aria-expanded', 'true');
    await user.type(screen.getByRole('searchbox'), 'e');
    expect(accountButton).toHaveAttribute('aria-expanded', 'false');
  });
});
