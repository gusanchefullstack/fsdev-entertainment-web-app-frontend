import { vi } from 'vitest';
import { ApiError, type ApiClientLike } from '../../src/api/ApiClient';
import { shows, user } from './fixtures';

export type FakeApi = { [K in keyof ApiClientLike]: ReturnType<typeof vi.fn> & ApiClientLike[K] };

/** Signed-out by default: getCurrentUser rejects with 401. */
export function createFakeApi(overrides: Partial<ApiClientLike> = {}): FakeApi {
  const api = {
    listShows: vi.fn(async () => shows),
    signUp: vi.fn(async (email: string) => ({ ...user, email })),
    signIn: vi.fn(async (email: string) => ({ ...user, email })),
    signOut: vi.fn(async () => undefined),
    getCurrentUser: vi.fn(async () => {
      throw new ApiError(401, 'UNAUTHENTICATED');
    }),
    listBookmarks: vi.fn(async () => [] as string[]),
    addBookmark: vi.fn(async () => undefined),
    removeBookmark: vi.fn(async () => undefined),
  };
  for (const [key, value] of Object.entries(overrides)) {
    (api as Record<string, unknown>)[key] = vi.fn(value as (...args: unknown[]) => unknown);
  }
  return api as unknown as FakeApi;
}

export function signedInApi(overrides: Partial<ApiClientLike> = {}): FakeApi {
  return createFakeApi({ getCurrentUser: async () => user, ...overrides });
}
