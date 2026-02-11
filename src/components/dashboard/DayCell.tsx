import React from 'react';
import { format, isSameMonth, isToday } from 'date-fns';
import { cn } from '@/lib/utils';
import { TradeEntry } from '@/store/useJournalStore';
import { formatCurrency, getPnlColorClass } from '@/lib/currency';
interface DayCellProps {
  date: Date;
  currentDate: Date;
  data?: TradeEntry;
  onClick: (date: Date) => void;
}
export function DayCell({ date, currentDate, data, onClick }: DayCellProps) {
  const isCurrentMonth = isSameMonth(date, currentDate);
  const today = isToday(date);
  const pnl = data?.pnl || 0;
  const trades = data?.tradeCount || 0;
  return (
    <button
      onClick={() => onClick(date)}
      className={cn(
        "relative flex flex-col items-start p-3 h-28 md:h-32 border border-white/5 transition-all duration-200 group overflow-hidden",
        isCurrentMonth ? "bg-zinc-900/30" : "bg-transparent opacity-20 pointer-events-none",
        pnl !== 0 && getPnlColorClass(pnl, 'bg'),
        "hover:z-10 hover:border-white/20 hover:-translate-y-1 hover:shadow-xl"
      )}
    >
      <span className={cn(
        "text-xs font-medium mb-auto",
        today ? "bg-white text-black px-1.5 rounded-sm" : "text-zinc-500"
      )}>
        {format(date, 'd')}
      </span>
      {data && (
        <div className="mt-auto w-full text-left">
          <p className={cn("text-sm md:text-base font-mono font-bold truncate", getPnlColorClass(pnl))}>
            {pnl !== 0 ? formatCurrency(pnl) : ''}
          </p>
          <p className="text-[10px] md:text-xs text-zinc-500 font-medium">
            {trades} {trades === 1 ? 'trade' : 'trades'}
          </p>
        </div>
      )}
      {/* Decorative indicator for notes */}
      {data?.notes && (
        <div className="absolute top-2 right-2 w-1 h-1 rounded-full bg-zinc-600 group-hover:bg-white" />
      )}
    </button>
  );
}