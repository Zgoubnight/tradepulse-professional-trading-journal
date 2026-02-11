import { create } from 'zustand';
import { persist } from 'zustand/middleware';
export interface ScalingTrade {
  id: string;
  timestamp: string;
  type: 'win' | 'loss' | 'be';
  amount: number;
  capitalBefore: number;
  capitalAfter: number;
  riskApplied: number;
  levelIndex: number;
}
interface ScalingState {
  capital: number;
  levelIndex: number; // 0 to 5 (corresponds to 2% to 7%)
  winStreak: number; // 0 to 3
  lossStreak: number; // 0 to 2
  history: ScalingTrade[];
  version: number;
  // Actions
  initPlan: (startingCapital: number) => void;
  resetPlan: () => void;
  addTrade: (type: 'win' | 'loss' | 'be', amount: number) => void;
  undoLast: () => void;
}
export const RISK_LADDER = [2, 3, 4, 5, 6, 7];
export const useScalingStore = create<ScalingState>()(
  persist(
    (set) => ({
      capital: 100000,
      levelIndex: 0,
      winStreak: 0,
      lossStreak: 0,
      history: [],
      version: 0,
      initPlan: (startingCapital) => set((state) => ({
        capital: startingCapital,
        levelIndex: 0,
        winStreak: 0,
        lossStreak: 0,
        history: [],
        version: state.version + 1
      })),
      resetPlan: () => set((state) => ({
        capital: 100000,
        levelIndex: 0,
        winStreak: 0,
        lossStreak: 0,
        history: [],
        version: state.version + 1
      })),
      addTrade: (type, amount) => set((state) => {
        const capitalBefore = state.capital;
        const capitalAfter = capitalBefore + amount;
        const currentRisk = RISK_LADDER[state.levelIndex];
        let newWinStreak = state.winStreak;
        let newLossStreak = state.lossStreak;
        let newLevelIndex = state.levelIndex;
        if (type === 'win') {
          newWinStreak += 1;
          newLossStreak = 0;
          if (newWinStreak >= 3) {
            newLevelIndex = Math.min(5, newLevelIndex + 1);
            newWinStreak = 0;
          }
        } else if (type === 'loss') {
          newLossStreak += 1;
          newWinStreak = 0;
          if (newLossStreak >= 2) {
            newLevelIndex = Math.max(0, newLevelIndex - 1);
            newLossStreak = 0;
          }
        } else {
          // Break-even
          newWinStreak = 0;
          newLossStreak = 0;
        }
        const newTrade: ScalingTrade = {
          id: crypto.randomUUID(),
          timestamp: new Date().toISOString(),
          type,
          amount,
          capitalBefore,
          capitalAfter,
          riskApplied: currentRisk,
          levelIndex: state.levelIndex,
        };
        return {
          capital: capitalAfter,
          levelIndex: newLevelIndex,
          winStreak: newWinStreak,
          lossStreak: newLossStreak,
          history: [newTrade, ...state.history],
          version: state.version + 1
        };
      }),
      undoLast: () => set((state) => {
        if (state.history.length === 0) return state;
        const [lastTrade, ...remainingHistory] = state.history;
        // We restore the state from before the trade
        // Note: This logic assumes we want to revert streaks and levels too
        // In a real app, we might need more complex snapshotting, but for this plan:
        return {
          capital: lastTrade.capitalBefore,
          levelIndex: lastTrade.levelIndex,
          // Streaks are harder to "undo" perfectly without full snapshots, 
          // but we'll reset them for simplicity on undo to prevent ladder gaming.
          winStreak: 0, 
          lossStreak: 0,
          history: remainingHistory,
          version: state.version + 1
        };
      }),
    }),
    {
      name: 'tradepulse-scaling-storage',
      partialize: (state) => ({
        capital: state.capital,
        levelIndex: state.levelIndex,
        winStreak: state.winStreak,
        lossStreak: state.lossStreak,
        history: state.history,
        version: state.version
      }),
    }
  )
);