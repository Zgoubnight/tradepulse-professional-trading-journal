import React, { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/currency';
import { EquityChart } from './EquityChart';
import { Calculator, Play, TrendingUp, AlertTriangle, Target, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
export function SimulatorTab() {
  const [config, setConfig] = useState({
    capital: 10000,
    winRate: 89,
    rrRatio: 1.1,
    accountCount: 100,
    tradesCount: 100,
    riskPercent: 2,
  });
  const [simResults, setSimResults] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const expectancy = useMemo(() => {
    const winProb = config.winRate / 100;
    const lossProb = 1 - winProb;
    return (winProb * config.rrRatio) - (lossProb * 1);
  }, [config.winRate, config.rrRatio]);
  const ruinThreshold = Math.floor(100 / config.riskPercent);
  const runSimulation = () => {
    const accounts = Array.from({ length: config.accountCount }).map(() => ({
      balance: config.capital,
      history: [config.capital],
      ruined: false,
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
      let sumOfSurvivors = 0;
      let survivorCount = 0;
      accounts.forEach((acc, aIndex) => {
        const val = acc.history[tIndex];
        entry[`acc${aIndex}`] = val;
        entry[`status${aIndex}`] = acc.ruined && val === 0 ? 'ruined' : 'survivor';
        if (val > 0) {
          sumOfSurvivors += val;
          survivorCount++;
        }
      });
      entry.medianSurvivor = survivorCount > 0 ? sumOfSurvivors / survivorCount : 0;
      return entry;
    });
    const finalBalances = accounts.map(a => a.balance);
    const ruinedCount = accounts.filter(a => a.ruined).length;
    const survivors = finalBalances.filter(b => b > 0);
    const median = survivors.length > 0 ? survivors.sort((a, b) => a - b)[Math.floor(survivors.length / 2)] : 0;
    const best = Math.max(...finalBalances);
    const worstSurviving = survivors.length > 0 ? Math.min(...survivors) : 0;
    const jackpots = finalBalances.filter(b => b >= config.capital * 3).length;
    setStats({ 
      ruinedCount, 
      ruinRate: (ruinedCount / config.accountCount) * 100,
      median, 
      best, 
      worstSurviving,
      jackpots,
      jackpotRate: (jackpots / config.accountCount) * 100 
    });
    setSimResults(chartData);
  };
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        <Card className="bg-zinc-900/40 border-white/5 backdrop-blur-md xl:col-span-1">
          <CardHeader className="border-b border-white/5">
            <CardTitle className="text-xs font-bold uppercase tracking-widest flex items-center gap-2">
              <Calculator className="w-4 h-4 text-amber-500" />
              Configuration Probabiliste
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-8">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label className="text-[10px] text-zinc-500 uppercase font-bold">Risque par Trade (%)</Label>
                <span className="text-xs font-mono font-bold text-white">{config.riskPercent}%</span>
              </div>
              <Slider 
                value={[config.riskPercent]} 
                min={0.1} max={10} step={0.1}
                onValueChange={([v]) => setConfig({...config, riskPercent: v})}
              />
              <p className="text-[10px] text-rose-400/80 italic">
                Une série de {ruinThreshold} pertes consécutives suffit à mettre le compte à zéro.
              </p>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label className="text-[10px] text-zinc-500 uppercase font-bold">Taux de Victoire (%)</Label>
                <span className="text-xs font-mono font-bold text-white">{config.winRate}%</span>
              </div>
              <Slider 
                value={[config.winRate]} 
                min={1} max={100} step={1}
                onValueChange={([v]) => setConfig({...config, winRate: v})}
              />
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label className="text-[10px] text-zinc-500 uppercase font-bold">Ratio R:R</Label>
                <span className="text-xs font-mono font-bold text-white">{config.rrRatio}</span>
              </div>
              <Slider 
                value={[config.rrRatio]} 
                min={0.1} max={10} step={0.1}
                onValueChange={([v]) => setConfig({...config, rrRatio: v})}
              />
            </div>
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
              <div className="space-y-2">
                <Label className="text-[10px] text-zinc-500 uppercase font-bold">Capital Initial</Label>
                <Input type="number" value={config.capital} onChange={e => setConfig({...config, capital: Number(e.target.value)})} className="bg-zinc-950 border-white/10 h-8 text-xs font-mono" />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] text-zinc-500 uppercase font-bold">Nb de Comptes</Label>
                <Input type="number" value={config.accountCount} onChange={e => setConfig({...config, accountCount: Number(e.target.value)})} className="bg-zinc-950 border-white/10 h-8 text-xs font-mono" />
              </div>
              <div className="space-y-2 col-span-2">
                <Label className="text-[10px] text-zinc-500 uppercase font-bold">Nombre de Trades</Label>
                <Input type="number" value={config.tradesCount} onChange={e => setConfig({...config, tradesCount: Number(e.target.value)})} className="bg-zinc-950 border-white/10 h-8 text-xs font-mono" />
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <span className="text-[10px] text-zinc-500 uppercase font-bold">Espérance :</span>
                <span className={cn("text-sm font-mono font-bold", expectancy > 0 ? "text-emerald-400" : "text-rose-400")}>
                  {expectancy > 0 ? '+' : ''}{expectancy.toFixed(3)} R / trade
                </span>
              </div>
              <Button 
                onClick={runSimulation} 
                className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-black font-black uppercase tracking-tighter gap-2 h-12 shadow-[0_0_20px_rgba(245,158,11,0.2)]"
              >
                <Play className="w-4 h-4 fill-current" />
                Nouvelle Simulation
              </Button>
            </div>
          </CardContent>
        </Card>
        <div className="xl:col-span-3 space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <ResultCard 
              label="Taux de Ruine" 
              value={stats ? `${stats.ruinRate.toFixed(1)}%` : '-'} 
              subValue={`${stats?.ruinedCount ?? 0} comptes`}
              color={stats?.ruinedCount > 0 ? "text-rose-500" : "text-emerald-500"}
              icon={<AlertTriangle className="w-3.5 h-3.5" />}
            />
            <ResultCard 
              label="Meilleur Cas" 
              value={stats ? formatCurrency(stats.best) : '-'} 
              subValue={stats ? `x${(stats.best / config.capital).toFixed(1)}` : ''}
              color="text-emerald-400"
              icon={<Target className="w-3.5 h-3.5" />}
            />
            <ResultCard 
              label="Pire Survivant" 
              value={stats ? formatCurrency(stats.worstSurviving) : '-'} 
              subValue={stats?.worstSurviving === 0 ? "RUINÉ" : "OPÉRATIONNEL"}
              color={stats?.worstSurviving === 0 ? "text-rose-600" : "text-zinc-300"}
              icon={<Zap className="w-3.5 h-3.5" />}
            />
            <ResultCard 
              label="Médiane Survivants" 
              value={stats ? formatCurrency(stats.median) : '-'} 
              subValue={stats ? `x${(stats.median / config.capital).toFixed(1)}` : ''}
              color="text-white"
              icon={<TrendingUp className="w-3.5 h-3.5" />}
            />
            <ResultCard 
              label="Jackpot (>= 3x)" 
              value={stats ? `${stats.jackpotRate.toFixed(1)}%` : '-'} 
              subValue={`${stats?.jackpots ?? 0} comptes`}
              color="text-amber-500"
              icon={<Zap className="w-3.5 h-3.5" />}
            />
          </div>
          <Card className="bg-zinc-900/40 border-white/5 backdrop-blur-md overflow-hidden">
             <CardHeader className="border-b border-white/5 py-4 flex flex-row items-center justify-between">
               <CardTitle className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">
                Courbes d'équité des {config.accountCount} comptes
               </CardTitle>
               <div className="flex gap-4">
                 <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-500/40" /><span className="text-[9px] text-zinc-500">SURVIVANTS</span></div>
                 <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-rose-500/40" /><span className="text-[9px] text-zinc-500">RUINES</span></div>
                 <div className="flex items-center gap-1.5"><div className="w-2 h-0.5 bg-white" /><span className="text-[9px] text-zinc-500">MÉDIANE</span></div>
               </div>
             </CardHeader>
             <CardContent className="p-0">
               {simResults.length > 0 ? (
                 <EquityChart data={simResults} accountCount={config.accountCount} />
               ) : (
                 <div className="h-[450px] flex flex-col items-center justify-center text-zinc-600 border border-dashed border-white/5 m-4 rounded-2xl">
                    <div className="p-4 rounded-full bg-zinc-900/50 mb-4">
                      <Play className="w-8 h-8 opacity-20" />
                    </div>
                    <p className="text-xs font-bold uppercase tracking-widest opacity-40">Lancer une simulation</p>
                 </div>
               )}
             </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
function ResultCard({ label, value, subValue, color, icon }: any) {
  return (
    <div className="bg-zinc-900/60 border border-white/5 p-4 rounded-2xl backdrop-blur-md">
      <div className="flex items-center gap-2 mb-2 text-zinc-500">
        {icon}
        <p className="text-[9px] font-bold uppercase tracking-widest">{label}</p>
      </div>
      <p className={cn("text-lg font-mono font-bold leading-none mb-1", color)}>{value}</p>
      <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-tighter">{subValue}</p>
    </div>
  );
}