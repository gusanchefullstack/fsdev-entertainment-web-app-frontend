import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactElement } from 'react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router';
import { ApiClientContext } from '../../src/api/ApiClient';
import { createFakeApi, type FakeApi } from './fakeApi';

interface Options {
  route?: string;
  api?: FakeApi;
}

export const locationRef: { current: { pathname: string; search: string } } = {
  current: { pathname: '/', search: '' },
};

function LocationSpy() {
  const location = useLocation();
  locationRef.current = { pathname: location.pathname, search: location.search };
  return null;
}

/** Renders `ui` inside the router and all app providers. */
export function renderWithProviders(ui: ReactElement, { route = '/', api = createFakeApi() }: Options = {}) {
  const user = userEvent.setup();
  const result = render(
    <MemoryRouter initialEntries={[route]}>
      <ApiClientContext value={api}>
        <LocationSpy />
        {ui}
      </ApiClientContext>
    </MemoryRouter>,
  );
  return { ...result, api, user };
}

export { Route, Routes };
