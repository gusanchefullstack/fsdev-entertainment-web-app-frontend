import { afterEach, describe, expect, it, vi } from 'vitest';
import { ApiClient, ApiError } from '../../src/api/ApiClient';

function mockFetch(response: Partial<Response> & { jsonBody?: unknown }) {
  const fetchMock = vi.fn(async (_input: string, _init?: RequestInit) => ({
    ok: response.ok ?? true,
    status: response.status ?? 200,
    json: async () => response.jsonBody,
  }));
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('ApiClient', () => {
  const client = new ApiClient();

  it('lists shows with GET /api/shows', async () => {
    const fetchMock = mockFetch({ jsonBody: { shows: [{ id: 'beyond-earth' }] } });
    await expect(client.listShows()).resolves.toEqual([{ id: 'beyond-earth' }]);
    expect(fetchMock).toHaveBeenCalledWith('/api/shows', { method: 'GET', credentials: 'same-origin' });
  });

  it('sends JSON bodies for sign up and sign in', async () => {
    const fetchMock = mockFetch({ status: 201, jsonBody: { user: { id: '1', email: 'a@b.co' } } });
    await client.signUp('a@b.co', 'password1');
    await client.signIn('a@b.co', 'password1');
    expect(fetchMock).toHaveBeenNthCalledWith(1, '/api/auth/signup', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'a@b.co', password: 'password1' }),
    });
    expect(fetchMock).toHaveBeenNthCalledWith(2, '/api/auth/login', expect.objectContaining({ method: 'POST' }));
  });

  it('uses the contract paths for session and bookmark calls', async () => {
    const fetchMock = mockFetch({ status: 204 });
    await client.signOut();
    await client.addBookmark('beyond-earth');
    await client.removeBookmark('beyond-earth');
    expect(fetchMock.mock.calls.map((call) => [call[0], call[1]?.method])).toEqual([
      ['/api/auth/logout', 'POST'],
      ['/api/bookmarks/beyond-earth', 'PUT'],
      ['/api/bookmarks/beyond-earth', 'DELETE'],
    ]);
  });

  it('returns undefined for 204 responses', async () => {
    mockFetch({ status: 204 });
    await expect(client.addBookmark('dogs')).resolves.toBeUndefined();
  });

  it('turns error bodies into ApiError with code and fields', async () => {
    mockFetch({
      ok: false,
      status: 400,
      jsonBody: { error: { code: 'VALIDATION_ERROR', message: 'x', fields: { email: "Can't be empty" } } },
    });
    const error = await client.signUp('', '').catch((caught: unknown) => caught);
    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({ status: 400, code: 'VALIDATION_ERROR', fields: { email: "Can't be empty" } });
  });

  it('turns network failures into ApiError(0, INTERNAL_ERROR)', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => Promise.reject(new TypeError('Failed to fetch'))));
    await expect(client.listShows()).rejects.toMatchObject({ status: 0, code: 'INTERNAL_ERROR' });
  });
});
