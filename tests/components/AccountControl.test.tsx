import { screen, waitFor, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AppRoutes } from '../../src/AppRoutes';
import { signedInApi } from '../helpers/fakeApi';
import { locationRef, renderWithProviders } from '../helpers/renderWithProviders';

describe('AccountControl', () => {
  it('links signed-out visitors to Login', async () => {
    renderWithProviders(<AppRoutes />, { route: '/' });
    const nav = await screen.findByRole('navigation', { name: 'Main' });
    expect(await within(nav).findByRole('link', { name: 'Log in' })).toHaveAttribute('href', '/login');
  });

  it('opens and closes the account menu', async () => {
    const { user } = renderWithProviders(<AppRoutes />, { route: '/', api: signedInApi() });
    const button = await screen.findByRole('button', { name: 'Account menu' });
    expect(button).toHaveAttribute('aria-expanded', 'false');

    await user.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'true');
    const menu = document.getElementById(button.getAttribute('aria-controls') ?? '');
    expect(menu).toHaveTextContent('qa1@example.com');
    expect(within(menu as HTMLElement).getByRole('button', { name: 'Sign out' })).toBeInTheDocument();

    await user.keyboard('{Escape}');
    expect(button).toHaveAttribute('aria-expanded', 'false');
    expect(button).toHaveFocus();

    await user.click(button);
    await user.click(document.body);
    expect(button).toHaveAttribute('aria-expanded', 'false');

    await user.click(button);
    await user.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'false');
  });

  it('closes on route change', async () => {
    const { user } = renderWithProviders(<AppRoutes />, { route: '/', api: signedInApi() });
    await user.click(await screen.findByRole('button', { name: 'Account menu' }));
    await user.click(screen.getByRole('link', { name: 'Movies' }));
    await screen.findByRole('heading', { level: 1, name: 'Movies' });
    expect(screen.getByRole('button', { name: 'Account menu' })).toHaveAttribute('aria-expanded', 'false');
  });

  it('signs out and stays on the current page', async () => {
    const api = signedInApi();
    const { user } = renderWithProviders(<AppRoutes />, { route: '/movies', api });
    await user.click(await screen.findByRole('button', { name: 'Account menu' }));
    await user.click(screen.getByRole('button', { name: 'Sign out' }));
    expect(await screen.findByRole('link', { name: 'Log in' })).toBeInTheDocument();
    expect(api.signOut).toHaveBeenCalled();
    await waitFor(() => expect(locationRef.current.pathname).toBe('/movies'));
  });
});
