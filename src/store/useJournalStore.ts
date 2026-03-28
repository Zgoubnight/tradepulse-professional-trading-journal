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
  version: number;
  setEntry: (date: string, entry: Omit<TradeEntry, 'date'>) => void;
  removeEntry: (date: string) => void;
}
export const useJournalStore = create<JournalState>()(
  persist(
    (set) => ({
      entries: {},
      version: 0,
      setEntry: (date, entry) =>
        set((state) => ({
          version: state.version + 1,
          entries: {
            ...state.entries,
            [date]: { ...entry, date },
          },
        })),
      removeEntry: (date) =>
        set((state) => {
          const newEntries = { ...state.entries };
          delete newEntries[date];
          return { 
            entries: newEntries,
            version: state.version + 1 
          };
        }),
    }),
    {
      name: 'tradepulse-journal-storage',
      partialize: (state) => ({ entries: state.entries, version: state.version }),
    }
  )
);