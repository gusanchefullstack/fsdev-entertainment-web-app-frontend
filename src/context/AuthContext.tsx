import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useApiClient } from '../api/ApiClient';
import type { User } from '../api/types';

type AuthStatus = 'loading' | 'signedIn' | 'signedOut';

interface AuthValue {
  status: AuthStatus;
  user: User | null;
  signUp: (email: string, password: string) => Promise<User>;
  signIn: (email: string, password: string) => Promise<User>;
  signOut: () => Promise<void>;
  /** Marks the session as ended (e.g. after a 401) without calling the API. */
  markSignedOut: () => void;
}

const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const api = useApiClient();
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<AuthStatus>('loading');

  useEffect(() => {
    let cancelled = false;
    api
      .getCurrentUser()
      .then((current) => {
        if (cancelled) return;
        setUser(current);
        setStatus('signedIn');
      })
      .catch(() => {
        if (cancelled) return;
        setUser(null);
        setStatus('signedOut');
      });
    return () => {
      cancelled = true;
    };
  }, [api]);

  const signUp = useCallback(
    async (email: string, password: string) => {
      const created = await api.signUp(email, password);
      setUser(created);
      setStatus('signedIn');
      return created;
    },
    [api],
  );

  const signIn = useCallback(
    async (email: string, password: string) => {
      const signedIn = await api.signIn(email, password);
      setUser(signedIn);
      setStatus('signedIn');
      return signedIn;
    },
    [api],
  );

  const markSignedOut = useCallback(() => {
    setUser(null);
    setStatus('signedOut');
  }, []);

  const signOut = useCallback(async () => {
    try {
      await api.signOut();
    } finally {
      markSignedOut();
    }
  }, [api, markSignedOut]);

  const value = useMemo(
    () => ({ status, user, signUp, signIn, signOut, markSignedOut }),
    [status, user, signUp, signIn, signOut, markSignedOut],
  );
  return <AuthContext value={value}>{children}</AuthContext>;
}

export function useAuth(): AuthValue {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAuth must be used inside AuthProvider.');
  return value;
}
