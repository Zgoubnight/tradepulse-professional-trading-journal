import React, { useMemo } from 'react';
import { useJournalStore } from '@/store/useJournalStore';
import { formatCurrency, getPnlColorClass } from '@/lib/currency';
import { cn } from '@/lib/utils';
import { isSameMonth, parseISO } from 'date-fns';
import { Progress } from '@/components/ui/progress';
interface StatsOverviewProps {
  currentDate: Date;
}
export function StatsOverview({ currentDate }: StatsOverviewProps) {
  // Use 'version' to trigger updates, but we'll clean up the memo to avoid lint errors
  const entries = useJournalStore((s) => s.entries);
  // Selector for version to ensure component re-renders when data changes
  useJournalStore((s) => s.version);
  const stats = useMemo(() => {
    const monthEntries = Object.values(entries).filter((entry) =>
      isSameMonth(parseISO(entry.date), currentDate)
    );
    const netPnl = monthEntries.reduce((sum, e) => sum + e.pnl, 0);
    const totalTrades = monthEntries.reduce((sum, e) => sum + e.tradeCount, 0);
    const winningDays = monthEntries.filter((e) => e.pnl > 0).length;
    const totalTradingDays = monthEntries.length;
    const winRate = totalTradingDays > 0 ? (winningDays / totalTradingDays) * 100 : 0;
    // Monthly Goal: 600€ * 22 days = 13,200€
    const monthlyGoal = 13200;
    const progress = Math.min(100, Math.max(0, (netPnl / monthlyGoal) * 100));
    return { netPnl, totalTrades, winRate, progress, monthlyGoal };
  }, [entries, currentDate]);
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <div className="md:col-span-2 bg-zinc-900/40 border border-white/5 p-6 rounded-2xl backdrop-blur-sm relative overflow-hidden group">
        <div className="relative z-10 flex flex-col h-full justify-between">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-1">P/L Net Mensuel</p>
              <p className={cn("text-4xl font-mono font-bold tabular-nums tracking-tighter", getPnlColorClass(stats.netPnl))}>
                {formatCurrency(stats.netPnl)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-1">Progression Objectif</p>
              <p className="text-xl font-mono font-bold text-white">{stats.progress.toFixed(0)}%</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-end">
               <p className="text-[10px] text-zinc-500 font-medium">
                Objectif : {formatCurrency(stats.monthlyGoal)} / mois
              </p>
            </div>
            <Progress value={stats.progress} className="h-1.5 bg-zinc-800" />
          </div>
        </div>
        <div className={cn(
          "absolute -right-20 -top-20 w-64 h-64 blur-[100px] opacity-10 transition-colors duration-1000",
          stats.netPnl >= 0 ? "bg-emerald-500" : "bg-rose-500"
        )} />
      </div>
      <div className="grid grid-rows-2 gap-4">
        <div className="bg-zinc-900/40 border border-white/5 p-4 rounded-xl backdrop-blur-sm flex justify-between items-center">
          <div>
            <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Trades</p>
            <p className="text-2xl font-mono font-bold text-white">{stats.totalTrades}</p>
          </div>
          <div className="h-8 w-8 rounded-full bg-zinc-800/50 flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
          </div>
        </div>
        <div className="bg-zinc-900/40 border border-white/5 p-4 rounded-xl backdrop-blur-sm flex justify-between items-center">
          <div>
            <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Taux de Victoire</p>
            <p className={cn("text-2xl font-mono font-bold", stats.winRate >= 50 ? 'text-emerald-400' : 'text-rose-400')}>
              {stats.winRate.toFixed(1)}%
            </p>
          </div>
          <div className="h-8 w-8 rounded-full bg-zinc-800/50 flex items-center justify-center">
            <div className={cn("w-1.5 h-1.5 rounded-full", stats.winRate >= 50 ? 'bg-emerald-500' : 'bg-rose-500')} />
          </div>
        </div>
      </div>
    </div>
  );
}