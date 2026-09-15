import { screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ApiError } from '../../src/api/ApiClient';
import { AppRoutes } from '../../src/AppRoutes';
import { expectNoAxeViolations } from '../helpers/axe';
import { createFakeApi } from '../helpers/fakeApi';
import { shows } from '../helpers/fixtures';
import { renderWithProviders } from '../helpers/renderWithProviders';

const cardTitles = (container: HTMLElement) =>
  within(container)
    .getAllByRole('article')
    .map((article) => within(article).getByRole('heading', { level: 3 }).textContent);

describe('HomePage', () => {
  it('shows a loading status, then 5 trending and 24 recommended shows without duplicates', async () => {
    const { container } = renderWithProviders(<AppRoutes />, { route: '/' });
    expect(screen.getByRole('status')).toHaveTextContent('Loading shows');

    const trendingList = await screen.findByRole('list', { name: 'Trending shows' });
    const trendingTitles = cardTitles(trendingList);
    expect(trendingTitles).toEqual(shows.filter((show) => show.isTrending).map((show) => show.title));

    const recommended = screen.getByRole('region', { name: 'Recommended for you' });
    const recommendedTitles = cardTitles(recommended);
    expect(recommendedTitles).toHaveLength(24);
    expect(recommendedTitles[0]).toBe('The Great Lands');
    expect(recommendedTitles.filter((title) => trendingTitles.includes(title))).toEqual([]);

    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(container.querySelectorAll('main')).toHaveLength(1);
    expect(document.title).toBe('Home | Entertainment web app');
    await expectNoAxeViolations(container);
  });

  it('shows a friendly error with a retry when the catalog fails to load', async () => {
    let calls = 0;
    const api = createFakeApi({
      listShows: async () => {
        calls += 1;
        if (calls === 1) throw new ApiError(500, 'INTERNAL_ERROR');
        return shows;
      },
    });
    const { user } = renderWithProviders(<AppRoutes />, { route: '/', api });

    expect(await screen.findByText("We couldn't load shows right now.")).toBeInTheDocument();
    expect(screen.queryByText(/INTERNAL_ERROR/)).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Try again' }));
    expect(await screen.findByRole('list', { name: 'Trending shows' })).toBeInTheDocument();
    expect(api.listShows).toHaveBeenCalledTimes(2);
  });
});
