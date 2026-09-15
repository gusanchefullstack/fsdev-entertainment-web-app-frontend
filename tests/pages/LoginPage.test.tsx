import { screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ApiError } from '../../src/api/ApiClient';
import { AppRoutes } from '../../src/AppRoutes';
import { expectNoAxeViolations } from '../helpers/axe';
import { createFakeApi, signedInApi } from '../helpers/fakeApi';
import { locationRef, renderWithProviders } from '../helpers/renderWithProviders';

async function fillAndSubmit(user: ReturnType<typeof renderWithProviders>['user'], email: string, password: string) {
  await screen.findByRole('button', { name: 'Login to your account' });
  if (email) await user.type(screen.getByLabelText('Email address'), email);
  if (password) await user.type(screen.getByLabelText('Password'), password);
  await user.click(screen.getByRole('button', { name: 'Login to your account' }));
}

describe('LoginPage', () => {
  it('renders the labelled form with a Sign Up link', async () => {
    const { container } = renderWithProviders(<AppRoutes />, { route: '/login?returnTo=/movies' });
    expect(await screen.findByRole('heading', { level: 1, name: 'Login' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Sign Up' })).toHaveAttribute('href', '/sign-up?returnTo=%2Fmovies');
    await expectNoAxeViolations(container);
  });

  it('requires both fields', async () => {
    const { user, api } = renderWithProviders(<AppRoutes />, { route: '/login' });
    await fillAndSubmit(user, '', '');
    expect(screen.getAllByText("Can't be empty")).toHaveLength(2);
    expect(api.signIn).not.toHaveBeenCalled();
  });

  it('shows INVALID_CREDENTIALS, clears only the password', async () => {
    const api = createFakeApi({
      signIn: async () => {
        throw new ApiError(401, 'INVALID_CREDENTIALS');
      },
    });
    const { user } = renderWithProviders(<AppRoutes />, { route: '/login', api });
    await fillAndSubmit(user, 'qa1@example.com', 'wrong-pass');
    expect(await screen.findByRole('alert')).toHaveTextContent('Incorrect email or password.');
    expect(screen.getByLabelText('Password')).toHaveValue('');
    expect(screen.getByLabelText('Email address')).toHaveValue('qa1@example.com');
  });

  it('shows SIGN_IN_PAUSED', async () => {
    const api = createFakeApi({
      signIn: async () => {
        throw new ApiError(429, 'SIGN_IN_PAUSED');
      },
    });
    const { user } = renderWithProviders(<AppRoutes />, { route: '/login', api });
    await fillAndSubmit(user, 'qa1@example.com', 'password1');
    expect(await screen.findByRole('alert')).toHaveTextContent('Too many attempts. Please try again in a few minutes.');
  });

  it.each([
    ['/login?returnTo=/movies', '/movies'],
    ['/login?returnTo=//evil.com', '/'],
    ['/login?returnTo=/login', '/'],
  ])('after sign-in from %s goes to %s', async (route, expected) => {
    const { user } = renderWithProviders(<AppRoutes />, { route });
    await fillAndSubmit(user, 'qa1@example.com', 'password1');
    await waitFor(() => expect(locationRef.current.pathname).toBe(expected));
  });

  it('redirects a signed-in user away from Login', async () => {
    renderWithProviders(<AppRoutes />, { route: '/login?returnTo=/tv-series', api: signedInApi() });
    await waitFor(() => expect(locationRef.current.pathname).toBe('/tv-series'));
  });
});
