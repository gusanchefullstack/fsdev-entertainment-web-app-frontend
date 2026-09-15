import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { SearchBar } from '../../src/components/SearchBar/SearchBar';

describe('SearchBar', () => {
  it('is a labelled search form whose placeholder matches the label', () => {
    render(<SearchBar label="Search for movies" value="" onChange={() => {}} />);
    expect(screen.getByRole('search')).toBeInTheDocument();
    const input = screen.getByRole('searchbox', { name: 'Search for movies' });
    expect(input).toHaveAttribute('placeholder', 'Search for movies');
  });

  it('reports every keystroke and never submits', async () => {
    const onChange = vi.fn();
    render(<SearchBar label="Search for movies" value="" onChange={onChange} />);
    await userEvent.type(screen.getByRole('searchbox'), 'abc');
    expect(onChange).toHaveBeenCalledTimes(3);

    const form = screen.getByRole('search');
    const submit = new Event('submit', { bubbles: true, cancelable: true });
    fireEvent(form, submit);
    expect(submit.defaultPrevented).toBe(true);
  });
});
