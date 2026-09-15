import { createContext, useContext } from 'react';
import type { ErrorBody, ErrorCode, Show, User } from './types';

export class ApiError extends Error {
  readonly status: number;
  readonly code: ErrorCode;
  readonly fields?: Record<string, string>;

  constructor(status: number, code: ErrorCode, fields?: Record<string, string>) {
    super(code);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    if (fields) this.fields = fields;
  }
}

export class ApiClient {
  listShows(): Promise<Show[]> {
    return this.request<{ shows: Show[] }>('GET', '/shows').then((body) => body.shows);
  }

  signUp(email: string, password: string): Promise<User> {
    return this.request<{ user: User }>('POST', '/auth/signup', { email, password }).then(
      (body) => body.user,
    );
  }

  signIn(email: string, password: string): Promise<User> {
    return this.request<{ user: User }>('POST', '/auth/login', { email, password }).then(
      (body) => body.user,
    );
  }

  signOut(): Promise<void> {
    return this.request<void>('POST', '/auth/logout');
  }

  getCurrentUser(): Promise<User> {
    return this.request<{ user: User }>('GET', '/auth/me').then((body) => body.user);
  }

  listBookmarks(): Promise<string[]> {
    return this.request<{ showIds: string[] }>('GET', '/bookmarks').then((body) => body.showIds);
  }

  addBookmark(showId: string): Promise<void> {
    return this.request<void>('PUT', `/bookmarks/${encodeURIComponent(showId)}`);
  }

  removeBookmark(showId: string): Promise<void> {
    return this.request<void>('DELETE', `/bookmarks/${encodeURIComponent(showId)}`);
  }

  private async request<T>(method: string, path: string, body?: unknown): Promise<T> {
    let response: Response;
    try {
      response = await fetch(`/api${path}`, {
        method,
        credentials: 'same-origin',
        ...(body === undefined
          ? {}
          : { headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }),
      });
    } catch {
      throw new ApiError(0, 'INTERNAL_ERROR');
    }

    if (response.status === 204) return undefined as T;

    if (!response.ok) {
      const errorBody = await response.json().catch(() => null);
      if (isErrorBody(errorBody)) {
        throw new ApiError(response.status, errorBody.error.code, errorBody.error.fields);
      }
      throw new ApiError(response.status, 'INTERNAL_ERROR');
    }

    try {
      return (await response.json()) as T;
    } catch {
      throw new ApiError(response.status, 'INTERNAL_ERROR');
    }
  }
}

function isErrorBody(value: unknown): value is ErrorBody {
  return (
    typeof value === 'object' &&
    value !== null &&
    'error' in value &&
    typeof (value as ErrorBody).error?.code === 'string'
  );
}

export type ApiClientLike = Pick<ApiClient, keyof ApiClient>;

export const apiClient = new ApiClient();
export const ApiClientContext = createContext<ApiClientLike>(apiClient);

export function useApiClient(): ApiClientLike {
  return useContext(ApiClientContext);
}
