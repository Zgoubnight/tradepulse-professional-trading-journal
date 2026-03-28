import React from 'react';
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format
} from 'date-fns';
import { DayCell } from './DayCell';
import { useJournalStore } from '@/store/useJournalStore';
interface CalendarGridProps {
  currentDate: Date;
  onSelectDate: (date: Date) => void;
}
export function CalendarGrid({ currentDate, onSelectDate }: CalendarGridProps) {
  const entries = useJournalStore((s) => s.entries);
  const days = React.useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
    return eachDayOfInterval({ start: startDate, end: endDate });
  }, [currentDate]);
  const weekDays = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
  return (
    <div className="bg-zinc-950 border border-white/5 rounded-xl overflow-hidden shadow-2xl">
      <div className="grid grid-cols-7 border-b border-white/5 bg-zinc-900/50">
        {weekDays.map((day) => (
          <div key={day} className="py-3 text-center text-[10px] uppercase tracking-widest text-zinc-500 font-bold">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {days.map((day) => {
          const dateKey = format(day, 'yyyy-MM-dd');
          return (
            <DayCell
              key={dateKey}
              date={day}
              currentDate={currentDate}
              data={entries[dateKey]}
              onClick={onSelectDate}
            />
          );
        })}
      </div>
    </div>
  );
}