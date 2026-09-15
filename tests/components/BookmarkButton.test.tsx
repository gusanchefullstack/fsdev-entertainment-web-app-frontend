import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { BookmarkButton } from '../../src/components/BookmarkButton/BookmarkButton';
import { signedInApi } from '../helpers/fakeApi';
import { showById } from '../helpers/fixtures';
import { renderWithProviders } from '../helpers/renderWithProviders';

describe('BookmarkButton', () => {
  it('describes the add action when not bookmarked', async () => {
    renderWithProviders(<BookmarkButton show={showById('beyond-earth')} />, { api: signedInApi() });
    const button = await screen.findByRole('button', { name: 'Bookmark Beyond Earth' });
    expect(button).toHaveAttribute('aria-pressed', 'false');
    expect(button).toHaveAttribute('data-bookmarked', 'false');
  });

  it('describes the remove action when bookmarked', async () => {
    const api = signedInApi({ listBookmarks: async () => ['beyond-earth'] });
    renderWithProviders(<BookmarkButton show={showById('beyond-earth')} />, { api });
    const button = await screen.findByRole('button', { name: 'Remove Beyond Earth from bookmarks' });
    expect(button).toHaveAttribute('aria-pressed', 'true');
    expect(button).toHaveAttribute('data-bookmarked', 'true');
  });
});
