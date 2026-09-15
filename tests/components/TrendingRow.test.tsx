import { act, render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { TrendingRow } from '../../src/components/TrendingRow/TrendingRow';
import { shows } from '../helpers/fixtures';

describe('TrendingRow', () => {
  it('lists trending shows and scrolls a focused card into view', () => {
    const scrollIntoView = vi.fn();
    Element.prototype.scrollIntoView = scrollIntoView;
    render(<TrendingRow shows={shows.filter((show) => show.isTrending)} />);

    const list = screen.getByRole('list', { name: 'Trending shows' });
    expect(within(list).getAllByRole('listitem')).toHaveLength(5);

    const card = within(list).getByRole('article', { name: 'Dark Side of the Moon' });
    act(() => card.focus());
    expect(scrollIntoView).toHaveBeenCalledWith({ block: 'nearest', inline: 'nearest' });
  });
});
