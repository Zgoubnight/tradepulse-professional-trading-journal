import React from 'react';
import { format, isSameMonth, isToday } from 'date-fns';
import { cn } from '@/lib/utils';
import { useJournalStore } from '@/store/useJournalStore';
import { formatCurrency, getPnlColorClass } from '@/lib/currency';
interface DayCellProps {
  date: Date;
  currentDate: Date;
  onClick: (date: Date) => void;
}
export function DayCell({ date, currentDate, onClick }: DayCellProps) {
  const dateKey = format(date, 'yyyy-MM-dd');
  // Strict primitive selectors to prevent re-render loops and dispatcher loss
  const entries = useJournalStore((s) => s.entries);
  const data = entries[dateKey];
  const isCurrentMonth = isSameMonth(date, currentDate);
  const today = isToday(date);
  const pnl = data?.pnl ?? 0;
  const trades = data?.tradeCount ?? 0;
  const hasNotes = !!data?.notes;
  // Visualization logic: Range [-200, 600]
  const MIN_RANGE = -200;
  const MAX_RANGE = 600;
  const TOTAL_RANGE = MAX_RANGE - MIN_RANGE;
  const calculateHeight = (val: number) => {
    const clamped = Math.max(MIN_RANGE, Math.min(MAX_RANGE, val));
    return (Math.abs(clamped) / TOTAL_RANGE) * 100;
  };
  const barHeight = calculateHeight(pnl);
  const isPositive = pnl >= 0;
  const baselineOffset = (Math.abs(MIN_RANGE) / TOTAL_RANGE) * 100;
  if (!isCurrentMonth) {
    return (
      <div className="h-28 md:h-32 border border-white/5 bg-transparent opacity-10 pointer-events-none" />
    );
  }
  return (
    <button
      onClick={() => onClick(date)}
      className={cn(
        "relative flex flex-col items-start p-3 h-28 md:h-32 border border-white/5 transition-all duration-200 group overflow-hidden bg-zinc-950",
        "hover:z-10 hover:border-white/20 hover:-translate-y-1 hover:shadow-2xl"
      )}
    >
      {/* Visual Goal Guidelines */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-0 w-full border-t border-emerald-500/50" />
        <div className="absolute bottom-0 w-full border-b border-rose-500/50" />
        <div
          className="absolute w-full border-t border-zinc-700/50"
          style={{ bottom: `${baselineOffset}%` }}
        />
      </div>
      {/* Performance Bar */}
      {pnl !== 0 && (
        <div
          className={cn(
            "absolute left-0 w-1 transition-all duration-500",
            isPositive ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]",
            pnl >= MAX_RANGE || pnl <= MIN_RANGE ? "w-1.5 opacity-100" : "opacity-60"
          )}
          style={{
            height: `${barHeight}%`,
            bottom: isPositive ? `${baselineOffset}%` : `calc(${baselineOffset}% - ${barHeight}%)`
          }}
        />
      )}
      <span className={cn(
        "text-[10px] font-bold mb-auto z-10",
        today ? "bg-white text-black px-1 rounded-[2px]" : "text-zinc-600"
      )}>
        {format(date, 'd')}
      </span>
      {data && (
        <div className="mt-auto w-full text-left z-10">
          <p className={cn(
            "text-xs md:text-sm font-mono font-bold truncate leading-none mb-1",
            getPnlColorClass(pnl)
          )}>
            {pnl !== 0 ? formatCurrency(pnl) : ''}
          </p>
          <p className="text-[9px] text-zinc-500 font-medium uppercase tracking-tighter">
            {trades} {trades <= 1 ? 'trade' : 'trades'}
          </p>
        </div>
      )}
      {hasNotes && (
        <div className="absolute top-3 right-3 w-1 h-1 rounded-full bg-zinc-700 group-hover:bg-white transition-colors" />
      )}
    </button>
  );
}