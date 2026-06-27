import React, { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/currency';
import { EquityChart } from './EquityChart';
import { Calculator, Play, TrendingUp, AlertTriangle, Target } from 'lucide-react';
export function SimulatorTab() {
  const [config, setConfig] = useState({
    capital: 10000,
    winRate: 50,
    rrRatio: 2,
    accountCount: 20,
    tradesCount: 100,
    riskPercent: 1,
    slPoints: 20,
    pointValue: 10
  });
  const [simResults, setSimResults] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const riskAmount = (config.capital * config.riskPercent) / 100;
  const lotSize = config.slPoints > 0 ? riskAmount / (config.slPoints * config.pointValue) : 0;
  const runSimulation = () => {
    const allPaths = [];
    const accounts = Array.from({ length: config.accountCount }).map(() => ({
      balance: config.capital,
      history: [config.capital],
      ruined: false
    }));
    for (let t = 0; t < config.tradesCount; t++) {
      accounts.forEach(acc => {
        if (acc.ruined) {
          acc.history.push(0);
          return;
        }
        const win = Math.random() * 100 < config.winRate;
        const currentRisk = (acc.balance * config.riskPercent) / 100;
        if (win) {
          acc.balance += currentRisk * config.rrRatio;
        } else {
          acc.balance -= currentRisk;
        }
        if (acc.balance <= 0) {
          acc.balance = 0;
          acc.ruined = true;
        }
        acc.history.push(acc.balance);
      });
    }
    const chartData = Array.from({ length: config.tradesCount + 1 }).map((_, tIndex) => {
      const entry: any = { tradeIndex: tIndex };
      accounts.forEach((acc, aIndex) => {
        entry[`acc${aIndex}`] = acc.history[tIndex];
      });
      return entry;
    });
    const finalBalances = accounts.map(a => a.balance);
    const ruinedCount = accounts.filter(a => a.ruined).length;
    const survivors = finalBalances.filter(b => b > 0);
    const median = survivors.length > 0 ? survivors.sort((a, b) => a - b)[Math.floor(survivors.length / 2)] : 0;
    const best = Math.max(...finalBalances);
    const superPerformers = finalBalances.filter(b => b > config.capital * 3).length;
    setStats({ ruinedCount, median, best, superPerformers });
    setSimResults(chartData);
  };
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Configuration Column */}
        <Card className="bg-zinc-900/40 border-white/5 backdrop-blur-md lg:col-span-1">
          <CardHeader className="border-b border-white/5">
            <CardTitle className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
              <Calculator className="w-4 h-4 text-emerald-500" />
              Paramètres du Test
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[10px] text-zinc-500 uppercase font-bold">Capital (€)</Label>
                <Input type="number" value={config.capital} onChange={e => setConfig({...config, capital: Number(e.target.value)})} className="bg-zinc-950 border-white/10 h-9 text-xs" />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] text-zinc-500 uppercase font-bold">Risque (%)</Label>
                <Input type="number" value={config.riskPercent} onChange={e => setConfig({...config, riskPercent: Number(e.target.value)})} className="bg-zinc-950 border-white/10 h-9 text-xs" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[10px] text-zinc-500 uppercase font-bold">Taux Victoire (%)</Label>
                <Input type="number" value={config.winRate} onChange={e => setConfig({...config, winRate: Number(e.target.value)})} className="bg-zinc-950 border-white/10 h-9 text-xs" />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] text-zinc-500 uppercase font-bold">Ratio R:R</Label>
                <Input type="number" value={config.rrRatio} onChange={e => setConfig({...config, rrRatio: Number(e.target.value)})} className="bg-zinc-950 border-white/10 h-9 text-xs" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
              <div className="space-y-2">
                <Label className="text-[10px] text-zinc-500 uppercase font-bold">SL (Points)</Label>
                <Input type="number" value={config.slPoints} onChange={e => setConfig({...config, slPoints: Number(e.target.value)})} className="bg-zinc-950 border-white/10 h-9 text-xs" />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] text-zinc-500 uppercase font-bold">Valeur Point (€)</Label>
                <Input type="number" value={config.pointValue} onChange={e => setConfig({...config, pointValue: Number(e.target.value)})} className="bg-zinc-950 border-white/10 h-9 text-xs" />
              </div>
            </div>
            <div className="mt-6 p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
              <p className="text-[10px] text-emerald-500 font-bold uppercase mb-2">Position Calculée</p>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-zinc-500 text-[10px]">Risque / Trade</p>
                  <p className="text-lg font-mono font-bold text-white">{formatCurrency(riskAmount)}</p>
                </div>
                <div className="text-right">
                  <p className="text-zinc-500 text-[10px]">Taille (Lots)</p>
                  <p className="text-lg font-mono font-bold text-emerald-400">{lotSize.toFixed(2)}</p>
                </div>
              </div>
            </div>
            <Button onClick={runSimulation} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold gap-2 mt-4">
              <Play className="w-4 h-4 fill-current" />
              Lancer Simulation
            </Button>
          </CardContent>
        </Card>
        {/* Results/Stats Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="Faillites" value={stats?.ruinedCount ?? '-'} icon={<AlertTriangle className="w-4 h-4 text-rose-500" />} color="text-rose-500" />
            <StatCard label="Médiane Finale" value={stats ? formatCurrency(stats.median) : '-'} icon={<TrendingUp className="w-4 h-4 text-blue-500" />} />
            <StatCard label="Meilleur Cas" value={stats ? formatCurrency(stats.best) : '-'} icon={<Target className="w-4 h-4 text-emerald-500" />} />
            <StatCard label="Super Perf. (>3x)" value={stats?.superPerformers ?? '-'} icon={<TrendingUp className="w-4 h-4 text-amber-500" />} color="text-amber-500" />
          </div>
          <Card className="bg-zinc-900/40 border-white/5 backdrop-blur-md overflow-hidden">
             <CardHeader className="border-b border-white/5 py-4">
               <CardTitle className="text-xs font-bold uppercase tracking-widest text-zinc-400">Courbe de Dispersion Monte Carlo</CardTitle>
             </CardHeader>
             <CardContent className="p-0">
               {simResults.length > 0 ? (
                 <EquityChart data={simResults} accountCount={config.accountCount} />
               ) : (
                 <div className="h-[400px] flex flex-col items-center justify-center text-zinc-600 border border-dashed border-white/5 m-4 rounded-xl">
                    <Play className="w-12 h-12 mb-4 opacity-20" />
                    <p className="text-sm font-medium">Lancer une simulation pour voir les probabilités</p>
                 </div>
               )}
             </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
function StatCard({ label, value, icon, color = "text-white" }: { label: string, value: string | number, icon: React.ReactNode, color?: string }) {
  return (
    <div className="bg-zinc-900/40 border border-white/5 p-4 rounded-xl backdrop-blur-sm">
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">{label}</p>
      </div>
      <p className={`text-xl font-mono font-bold ${color}`}>{value}</p>
    </div>
  );
}