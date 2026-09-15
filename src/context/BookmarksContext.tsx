import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { useLocation, useNavigate } from 'react-router';
import { ApiError, useApiClient } from '../api/ApiClient';
import type { Show } from '../api/types';
import { friendlyMessage } from '../lib/errorMessages';
import { clearPendingBookmark, readPendingBookmark, savePendingBookmark } from '../lib/pendingBookmark';
import { safeReturnTo } from '../lib/safeReturnTo';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

type BookmarksStatus = 'idle' | 'loading' | 'ready';

interface BookmarksValue {
  status: BookmarksStatus;
  bookmarkedIds: ReadonlySet<string>;
  isBookmarked: (showId: string) => boolean;
  toggle: (show: Show) => void;
  /** Saves a bookmark attempted while signed out; returns where the visitor was, if any. */
  applyPendingBookmark: () => Promise<string | null>;
}

const BookmarksContext = createContext<BookmarksValue | null>(null);

const loginPath = (returnTo: string) => `/login?returnTo=${encodeURIComponent(returnTo)}`;

export function BookmarksProvider({ children }: { children: ReactNode }) {
  const api = useApiClient();
  const { status: authStatus, markSignedOut } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [ids, setIds] = useState<ReadonlySet<string>>(new Set());
  const [status, setStatus] = useState<BookmarksStatus>('idle');
  // Local changes not yet reflected in a loaded list; re-applied on top of the next load.
  const changesSinceLoad = useRef(new Map<string, boolean>());

  const setBookmarked = useCallback((showId: string, bookmarked: boolean) => {
    changesSinceLoad.current.set(showId, bookmarked);
    setIds((current) => {
      const next = new Set(current);
      if (bookmarked) next.add(showId);
      else next.delete(showId);
      return next;
    });
  }, []);

  useEffect(() => {
    if (authStatus !== 'signedIn') {
      changesSinceLoad.current = new Map();
      setIds(new Set());
      setStatus(authStatus === 'loading' ? 'loading' : 'idle');
      return;
    }
    let cancelled = false;
    setStatus('loading');
    api
      .listBookmarks()
      .then((loaded) => {
        if (cancelled) return;
        const next = new Set(loaded);
        for (const [showId, bookmarked] of changesSinceLoad.current) {
          if (bookmarked) next.add(showId);
          else next.delete(showId);
        }
        changesSinceLoad.current = new Map();
        setIds(next);
        setStatus('ready');
      })
      .catch(() => {
        if (cancelled) return;
        setStatus('ready');
        showToast(friendlyMessage('BOOKMARK_SAVE'));
      });
    return () => {
      cancelled = true;
    };
  }, [api, authStatus, showToast]);

  const toggle = useCallback(
    (show: Show) => {
      const returnTo = safeReturnTo(location.pathname);
      if (authStatus !== 'signedIn') {
        savePendingBookmark({ showId: show.id, returnTo });
        navigate(loginPath(returnTo));
        return;
      }

      const wasBookmarked = ids.has(show.id);
      setBookmarked(show.id, !wasBookmarked);
      const request = wasBookmarked ? api.removeBookmark(show.id) : api.addBookmark(show.id);
      request.catch((error: unknown) => {
        setBookmarked(show.id, wasBookmarked);
        if (error instanceof ApiError && error.code === 'UNAUTHENTICATED') {
          showToast(friendlyMessage('SESSION_ENDED'));
          markSignedOut();
          navigate(loginPath(returnTo));
        } else {
          showToast(friendlyMessage('BOOKMARK_SAVE'));
        }
      });
    },
    [api, authStatus, ids, location.pathname, markSignedOut, navigate, setBookmarked, showToast],
  );

  const applyPendingBookmark = useCallback(async () => {
    const pending = readPendingBookmark();
    if (!pending) return null;
    clearPendingBookmark();
    try {
      await api.addBookmark(pending.showId);
      setBookmarked(pending.showId, true);
    } catch {
      showToast(friendlyMessage('BOOKMARK_SAVE'));
    }
    return safeReturnTo(pending.returnTo);
  }, [api, setBookmarked, showToast]);

  const value = useMemo<BookmarksValue>(
    () => ({
      status,
      bookmarkedIds: ids,
      isBookmarked: (showId: string) => ids.has(showId),
      toggle,
      applyPendingBookmark,
    }),
    [status, ids, toggle, applyPendingBookmark],
  );

  return <BookmarksContext value={value}>{children}</BookmarksContext>;
}

export function useBookmarks(): BookmarksValue {
  const value = useContext(BookmarksContext);
  if (!value) throw new Error('useBookmarks must be used inside BookmarksProvider.');
  return value;
}
