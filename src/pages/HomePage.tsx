import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, LayoutDashboard, Calculator } from 'lucide-react';
import { addMonths, subMonths, format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { StatsOverview } from '@/components/dashboard/StatsOverview';
import { CalendarGrid } from '@/components/dashboard/CalendarGrid';
import { EntrySheet } from '@/components/dashboard/EntrySheet';
import { YearlyChart } from '@/components/dashboard/YearlyChart';
import { SimulatorTab } from '@/components/dashboard/SimulatorTab';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
export function HomePage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);
  const handlePrevMonth = () => setCurrentDate(prev => subMonths(prev, 1));
  const handleNextMonth = () => setCurrentDate(prev => addMonths(prev, 1));
  const handleToday = () => setCurrentDate(new Date());
  const handleSelectDate = (date: Date) => {
    setSelectedDate(date);
    setIsSheetOpen(true);
  };
  const handleCloseSheet = () => {
    setIsSheetOpen(false);
  };
  return (
    <div className="min-h-screen bg-black text-white selection:bg-emerald-500/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12">
          {/* Header Section */}
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-600 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                <LayoutDashboard className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">TradePulse</h1>
                <p className="text-zinc-500 text-sm font-medium uppercase tracking-widest">Terminal de Performance</p>
              </div>
            </div>
          </header>
          <Tabs defaultValue="journal" className="space-y-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
              <TabsList className="bg-zinc-900/50 border border-white/5 p-1 h-11">
                <TabsTrigger value="journal" className="data-[state=active]:bg-zinc-800 data-[state=active]:text-emerald-400 px-6 gap-2">
                  <LayoutDashboard className="w-4 h-4" />
                  Journal de Bord
                </TabsTrigger>
                <TabsTrigger value="simulator" className="data-[state=active]:bg-zinc-800 data-[state=active]:text-emerald-400 px-6 gap-2">
                  <Calculator className="w-4 h-4" />
                  Simulateur Monte Carlo
                </TabsTrigger>
              </TabsList>
              <TabsContent value="journal" className="m-0">
                <div className="flex items-center gap-2">
                  <div className="flex items-center bg-zinc-900/50 rounded-lg border border-white/5 p-1 backdrop-blur-sm">
                    <Button variant="ghost" size="icon" onClick={handlePrevMonth} className="h-8 w-8 text-zinc-400 hover:text-white">
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <div className="px-4 py-1 min-w-[140px] text-center">
                      <span className="text-sm font-bold uppercase tracking-widest">
                        {format(currentDate, 'MMMM yyyy', { locale: fr })}
                      </span>
                    </div>
                    <Button variant="ghost" size="icon" onClick={handleNextMonth} className="h-8 w-8 text-zinc-400 hover:text-white">
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                  <Button variant="outline" size="sm" onClick={handleToday} className="border-white/10 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300">
                    Aujourd'hui
                  </Button>
                </div>
              </TabsContent>
            </div>
            <TabsContent value="journal" className="space-y-12 mt-0 focus-visible:outline-none">
              <StatsOverview currentDate={currentDate} />
              <main className="space-y-12">
                <section>
                  <CalendarGrid
                    currentDate={currentDate}
                    onSelectDate={handleSelectDate}
                  />
                </section>
                <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <YearlyChart />
                </section>
              </main>
            </TabsContent>
            <TabsContent value="simulator" className="mt-0 focus-visible:outline-none">
              <SimulatorTab />
            </TabsContent>
          </Tabs>
          {/* Legend/Footer */}
          <footer className="mt-12 flex flex-wrap items-center justify-between gap-6 text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em] border-t border-white/5 pt-8">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                <div className="w-2 h-0.5 bg-emerald-500" />
                <span>Objectif (+600€)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-0.5 bg-rose-500" />
                <span>Perte Max (-200€)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-0.5 bg-zinc-700" />
                <span>Base</span>
              </div>
            </div>
            <div>
              &copy; {new Date().getFullYear()} TradePulse Journal Terminal
            </div>
          </footer>
        </div>
      </div>
      <EntrySheet
        isOpen={isSheetOpen}
        date={selectedDate}
        onClose={handleCloseSheet}
      />
    </div>
  );
}