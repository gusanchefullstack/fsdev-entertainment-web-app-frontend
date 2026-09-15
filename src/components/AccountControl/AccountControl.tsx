import { useEffect, useId, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import avatar from '../../assets/image-avatar.png';
import { useAuth } from '../../context/AuthContext';
import { useLayoutEvents } from '../AppLayout/LayoutEvents';
import styles from './AccountControl.module.css';

export function AccountControl() {
  const { status, user, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const location = useLocation();
  const navigate = useNavigate();

  const { searchActivity } = useLayoutEvents();

  useEffect(() => {
    setOpen(false);
  }, [location.pathname, searchActivity]);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  if (status !== 'signedIn' || !user) {
    return (
      <Link to="/login" className={styles.avatarControl}>
        <img className={styles.avatar} src={avatar} alt="" />
        <span className="visually-hidden">Log in</span>
      </Link>
    );
  }

  const handleSignOut = async () => {
    setOpen(false);
    // Leave the signed-in-only page first so it does not redirect to Login.
    if (location.pathname === '/bookmarks') navigate('/', { replace: true });
    await signOut();
  };

  return (
    <div ref={containerRef} className={styles.container}>
      <button
        ref={buttonRef}
        type="button"
        className={styles.avatarControl}
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((current) => !current)}
      >
        <img className={styles.avatar} src={avatar} alt="" />
        <span className="visually-hidden">Account menu</span>
      </button>
      <div id={menuId} className={styles.menu} hidden={!open}>
        <p className={styles.email}>{user.email}</p>
        <button type="button" className={styles.signOut} onClick={handleSignOut}>
          Sign out
        </button>
      </div>
    </div>
  );
}
