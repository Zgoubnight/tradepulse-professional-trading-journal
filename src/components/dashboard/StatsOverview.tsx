import React, { useMemo } from 'react';
import { useJournalStore, TradeEntry } from '@/store/useJournalStore';
import { formatCurrency, getPnlColorClass } from '@/lib/currency';
import { cn } from '@/lib/utils';
import { isSameMonth, parseISO } from 'date-fns';
interface StatsOverviewProps {
  currentDate: Date;
}
export function StatsOverview({ currentDate }: StatsOverviewProps) {
  const entries = useJournalStore((s) => s.entries);
  const stats = useMemo(() => {
    const monthEntries = Object.values(entries).filter((entry) => 
      isSameMonth(parseISO(entry.date), currentDate)
    );
    const netPnl = monthEntries.reduce((sum, e) => sum + e.pnl, 0);
    const totalTrades = monthEntries.reduce((sum, e) => sum + e.tradeCount, 0);
    const winningDays = monthEntries.filter((e) => e.pnl > 0).length;
    const totalTradingDays = monthEntries.length;
    const winRate = totalTradingDays > 0 ? (winningDays / totalTradingDays) * 100 : 0;
    return { netPnl, totalTrades, winRate };
  }, [entries, currentDate]);
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <StatCard 
        label="Monthly Net P/L" 
        value={formatCurrency(stats.netPnl)} 
        valueClass={getPnlColorClass(stats.netPnl)}
      />
      <StatCard 
        label="Total Trades" 
        value={stats.totalTrades.toString()} 
      />
      <StatCard 
        label="Win Rate (Days)" 
        value={`${stats.winRate.toFixed(1)}%`} 
        valueClass={stats.winRate >= 50 ? 'text-emerald-400' : 'text-rose-400'}
      />
    </div>
  );
}
function StatCard({ label, value, valueClass }: { label: string; value: string; valueClass?: string }) {
  return (
    <div className="bg-zinc-900/50 border border-white/5 p-6 rounded-xl backdrop-blur-sm">
      <p className="text-zinc-500 text-xs font-medium uppercase tracking-wider mb-1">{label}</p>
      <p className={cn("text-3xl font-mono font-bold tabular-nums", valueClass || "text-white")}>
        {value}
      </p>
    </div>
  );
}