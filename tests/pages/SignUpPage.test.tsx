import { screen, waitFor, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ApiError } from '../../src/api/ApiClient';
import { AppRoutes } from '../../src/AppRoutes';
import { expectNoAxeViolations } from '../helpers/axe';
import { createFakeApi } from '../helpers/fakeApi';
import { locationRef, renderWithProviders } from '../helpers/renderWithProviders';

const fields = () => ({
  email: screen.getByLabelText('Email address'),
  password: screen.getByLabelText('Password'),
  repeat: screen.getByLabelText('Repeat password'),
});

describe('SignUpPage', () => {
  it('renders the labelled form with a Login link that keeps returnTo', async () => {
    const { container } = renderWithProviders(<AppRoutes />, { route: '/sign-up?returnTo=/movies' });
    expect(await screen.findByRole('heading', { level: 1, name: 'Sign Up' })).toBeInTheDocument();
    fields();
    expect(screen.getByRole('button', { name: 'Create an account' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Login' })).toHaveAttribute('href', '/login?returnTo=%2Fmovies');
    expect(screen.queryByRole('navigation', { name: 'Main' })).not.toBeInTheDocument();
    expect(document.title).toBe('Sign Up | Entertainment web app');
    await expectNoAxeViolations(container);
  });

  it('shows per-field errors on empty submit without calling the API', async () => {
    const { user, api } = renderWithProviders(<AppRoutes />, { route: '/sign-up' });
    await user.click(await screen.findByRole('button', { name: 'Create an account' }));
    const { email, password, repeat } = fields();
    for (const field of [email, password, repeat]) {
      expect(field).toHaveAttribute('aria-invalid', 'true');
      const describedBy = field.getAttribute('aria-describedby');
      expect(describedBy && document.getElementById(describedBy)).toHaveTextContent("Can't be empty");
    }
    expect(email).toHaveFocus();
    expect(api.signUp).not.toHaveBeenCalled();
  });

  it('checks password length and matching passwords', async () => {
    const { user, api } = renderWithProviders(<AppRoutes />, { route: '/sign-up' });
    await screen.findByRole('button', { name: 'Create an account' });
    const { email, password, repeat } = fields();
    await user.type(email, 'qa1@example.com');
    await user.type(password, 'short');
    await user.type(repeat, 'different');
    await user.click(screen.getByRole('button', { name: 'Create an account' }));
    expect(screen.getByText('Must be at least 8 characters')).toBeInTheDocument();
    expect(screen.getByText("Passwords don't match")).toBeInTheDocument();
    expect(api.signUp).not.toHaveBeenCalled();
  });

  it('explains EMAIL_TAKEN with a Login link and keeps the email', async () => {
    const api = createFakeApi({
      signUp: async () => {
        throw new ApiError(409, 'EMAIL_TAKEN', { email: 'Already in use' });
      },
    });
    const { user } = renderWithProviders(<AppRoutes />, { route: '/sign-up', api });
    await screen.findByRole('button', { name: 'Create an account' });
    const { email, password, repeat } = fields();
    await user.type(email, 'qa1@example.com');
    await user.type(password, 'password1');
    await user.type(repeat, 'password1');
    await user.click(screen.getByRole('button', { name: 'Create an account' }));

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent('An account with this email already exists.');
    expect(within(alert).getByRole('link', { name: 'Login' })).toHaveAttribute('href', '/login');
    expect(email).toHaveValue('qa1@example.com');
  });

  it('signs up and goes to a safe returnTo', async () => {
    const { user, api } = renderWithProviders(<AppRoutes />, { route: '/sign-up?returnTo=/tv-series' });
    await screen.findByRole('button', { name: 'Create an account' });
    const { email, password, repeat } = fields();
    await user.type(email, 'qa1@example.com');
    await user.type(password, 'password1');
    await user.type(repeat, 'password1');
    await user.click(screen.getByRole('button', { name: 'Create an account' }));
    await waitFor(() => expect(locationRef.current.pathname).toBe('/tv-series'));
    expect(api.signUp).toHaveBeenCalledWith('qa1@example.com', 'password1');
  });
});
