import { create } from 'zustand';
import { persist } from 'zustand/middleware';
export interface TradeEntry {
  date: string; // ISO YYYY-MM-DD
  pnl: number;
  tradeCount: number;
  notes: string;
}
interface JournalState {
  entries: Record<string, TradeEntry>;
  setEntry: (date: string, entry: Omit<TradeEntry, 'date'>) => void;
  removeEntry: (date: string) => void;
}
export const useJournalStore = create<JournalState>()(
  persist(
    (set) => ({
      entries: {},
      setEntry: (date, entry) =>
        set((state) => ({
          entries: {
            ...state.entries,
            [date]: { ...entry, date },
          },
        })),
      removeEntry: (date) =>
        set((state) => {
          const newEntries = { ...state.entries };
          delete newEntries[date];
          return { entries: newEntries };
        }),
    }),
    {
      name: 'tradepulse-journal-storage',
    }
  )
);