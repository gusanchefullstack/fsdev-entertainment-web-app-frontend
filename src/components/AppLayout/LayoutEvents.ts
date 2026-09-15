import { createContext, useContext } from 'react';

interface LayoutEvents {
  /** Bumped whenever the visitor types a search, so open menus can close. */
  searchActivity: number;
  notifySearchActivity: () => void;
}

export const LayoutEventsContext = createContext<LayoutEvents>({
  searchActivity: 0,
  notifySearchActivity: () => {},
});

export function useLayoutEvents(): LayoutEvents {
  return useContext(LayoutEventsContext);
}
