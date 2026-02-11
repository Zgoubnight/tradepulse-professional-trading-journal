import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, LayoutDashboard, PlusCircle } from 'lucide-react';
import { addMonths, subMonths, format } from 'date-fns';
import { StatsOverview } from '@/components/dashboard/StatsOverview';
import { CalendarGrid } from '@/components/dashboard/CalendarGrid';
import { EntrySheet } from '@/components/dashboard/EntrySheet';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/sonner';
export function HomePage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  // Force dark mode for financial dashboard look
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);
  const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const handleToday = () => setCurrentDate(new Date());
  const handleSelectDate = (date: Date) => {
    setSelectedDate(date);
    setIsSheetOpen(true);
  };
  return (
    <div className="min-h-screen bg-black text-white selection:bg-emerald-500/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12">
          {/* Header Section */}
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-600 flex items-center justify-center">
                <LayoutDashboard className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">TradePulse</h1>
                <p className="text-zinc-500 text-sm font-medium">Professional Trading Journal</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center bg-zinc-900 rounded-lg border border-white/5 p-1">
                <Button variant="ghost" size="icon" onClick={handlePrevMonth} className="h-8 w-8 text-zinc-400 hover:text-white">
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <div className="px-4 py-1 min-w-[140px] text-center">
                  <span className="text-sm font-bold uppercase tracking-wider">
                    {format(currentDate, 'MMMM yyyy')}
                  </span>
                </div>
                <Button variant="ghost" size="icon" onClick={handleNextMonth} className="h-8 w-8 text-zinc-400 hover:text-white">
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
              <Button variant="outline" size="sm" onClick={handleToday} className="border-white/5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300">
                Today
              </Button>
            </div>
          </header>
          {/* Stats Bar */}
          <StatsOverview currentDate={currentDate} />
          {/* Main Calendar */}
          <main>
            <CalendarGrid 
              currentDate={currentDate} 
              onSelectDate={handleSelectDate} 
            />
          </main>
          {/* Legend/Footer */}
          <footer className="mt-12 flex flex-wrap items-center justify-between gap-6 text-zinc-500 text-xs font-medium uppercase tracking-widest border-t border-white/5 pt-8">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Profit</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-rose-500" />
                <span>Loss</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-zinc-700" />
                <span>No Data</span>
              </div>
            </div>
            <div>
              &copy; {new Date().getFullYear()} TradePulse Journal
            </div>
          </footer>
        </div>
      </div>
      <EntrySheet 
        isOpen={isSheetOpen} 
        date={selectedDate} 
        onClose={() => setIsSheetOpen(false)} 
      />
      <Toaster position="bottom-right" theme="dark" richColors />
    </div>
  );
}