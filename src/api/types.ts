export type Category = 'Movie' | 'TV Series';
export type Rating = 'PG' | 'E' | '18+';

export interface Show {
  id: string;
  title: string;
  year: number;
  category: Category;
  rating: Rating;
  isTrending: boolean;
  thumbnail: {
    trending?: { small: string; large: string };
    regular: { small: string; medium: string; large: string };
  };
}

export interface User {
  id: string;
  email: string;
}

export type ErrorCode =
  | 'VALIDATION_ERROR'
  | 'EMAIL_TAKEN'
  | 'INVALID_CREDENTIALS'
  | 'SIGN_IN_PAUSED'
  | 'UNAUTHENTICATED'
  | 'SHOW_NOT_FOUND'
  | 'UNSUPPORTED_MEDIA_TYPE'
  | 'NOT_FOUND'
  | 'INTERNAL_ERROR';

export interface ErrorBody {
  error: { code: ErrorCode; message: string; fields?: Record<string, string> };
}
