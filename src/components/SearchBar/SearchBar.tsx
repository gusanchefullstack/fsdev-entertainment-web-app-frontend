import { useId, type ChangeEvent } from 'react';
import searchIcon from '../../assets/icon-search.svg';
import { useLayoutEvents } from '../AppLayout/LayoutEvents';
import styles from './SearchBar.module.css';

interface SearchBarProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ label, value, onChange }: SearchBarProps) {
  const inputId = useId();
  const { notifySearchActivity } = useLayoutEvents();

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
    notifySearchActivity();
  };

  return (
    <form role="search" className={styles.form} onSubmit={(event) => event.preventDefault()}>
      <label htmlFor={inputId} className={styles.iconLabel}>
        <img className={styles.icon} src={searchIcon} alt="" />
        <span className="visually-hidden">{label}</span>
      </label>
      <input
        id={inputId}
        className={styles.input}
        type="search"
        placeholder={label}
        value={value}
        autoComplete="off"
        onChange={handleChange}
      />
    </form>
  );
}
