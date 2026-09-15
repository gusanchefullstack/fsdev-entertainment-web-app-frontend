import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ShowCard } from '../../src/components/ShowCard/ShowCard';
import { showById } from '../helpers/fixtures';

describe('ShowCard', () => {
  it('renders an article named by its title with year, category and rating', () => {
    const { container } = render(<ShowCard show={showById('the-great-lands')} variant="regular" />);
    const article = screen.getByRole('article', { name: 'The Great Lands' });
    expect(within(article).getByRole('heading', { level: 3, name: 'The Great Lands' })).toBeInTheDocument();
    expect(within(article).getByText('2019')).toBeInTheDocument();
    expect(within(article).getByText('Movie')).toBeInTheDocument();
    expect(within(article).getByText('E')).toBeInTheDocument();
    const img = container.querySelector('img[data-thumbnail]');
    expect(img).toHaveAttribute('alt', '');
    expect(img).toHaveAttribute('src', '/thumbnails/the-great-lands/regular/small.jpg');
    expect(article).not.toHaveAttribute('tabindex');
  });

  it('keeps the Play overlay out of the accessibility tree', () => {
    const { container } = render(<ShowCard show={showById('the-great-lands')} variant="regular" />);
    const overlay = container.querySelector('[data-play-overlay]');
    expect(overlay).toHaveAttribute('aria-hidden', 'true');
    expect(overlay?.querySelector('a, button, [tabindex]')).toBeNull();
  });

  it('uses trending images and is focusable in the trending variant', () => {
    const { container } = render(<ShowCard show={showById('beyond-earth')} variant="trending" />);
    expect(screen.getByRole('article', { name: 'Beyond Earth' })).toHaveAttribute('tabindex', '0');
    expect(container.querySelector('img[data-thumbnail]')).toHaveAttribute(
      'src',
      '/thumbnails/beyond-earth/trending/small.jpg',
    );
    expect(container.querySelector('source')).toHaveAttribute(
      'srcset',
      '/thumbnails/beyond-earth/trending/large.jpg',
    );
  });

  it('swaps a broken image for a same-size placeholder', () => {
    const { container } = render(<ShowCard show={showById('dogs')} variant="regular" />);
    fireEvent.error(container.querySelector('img[data-thumbnail]') as HTMLImageElement);
    expect(container.querySelector('img[data-thumbnail]')).toBeNull();
    expect(container.querySelector('[data-thumbnail-placeholder]')).toBeInTheDocument();
  });

  it('renders the actions slot', () => {
    render(<ShowCard show={showById('dogs')} variant="regular" actions={<button type="button">Act</button>} />);
    expect(screen.getByRole('button', { name: 'Act' })).toBeInTheDocument();
  });
});
