import { screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AppRoutes } from '../../src/AppRoutes';
import { expectNoAxeViolations } from '../helpers/axe';
import { renderWithProviders } from '../helpers/renderWithProviders';

describe.each([
  { route: '/movies', heading: 'Movies', category: 'Movie', count: 15 },
  { route: '/tv-series', heading: 'TV Series', category: 'TV Series', count: 14 },
])('$heading page', ({ route, heading, category, count }) => {
  it(`lists only ${category} shows under a visible h1`, async () => {
    const { container } = renderWithProviders(<AppRoutes />, { route });
    const h1 = await screen.findByRole('heading', { level: 1, name: heading });
    expect(h1).not.toHaveClass('visually-hidden');

    const articles = await screen.findAllByRole('article');
    expect(articles).toHaveLength(count);
    for (const article of articles) {
      expect(within(article).getByText(category, { exact: true })).toBeInTheDocument();
    }
    expect(document.title).toBe(`${heading} | Entertainment web app`);
    await expectNoAxeViolations(container);
  });
});
