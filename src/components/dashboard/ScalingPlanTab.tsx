import React, { useState, useMemo } from 'react';
import { useScalingStore, RISK_LADDER } from '@/store/useScalingStore';
import { formatCurrency } from '@/lib/currency';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  TrendingUp, 
  RotateCcw, 
  ChevronUp, 
  ChevronDown, 
  Target, 
  History, 
  Calculator,
  Undo2,
  CheckCircle2,
  XCircle,
  MinusCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
export function ScalingPlanTab() {
  const capital = useScalingStore(s => s.capital);
  const levelIndex = useScalingStore(s => s.levelIndex);
  const winStreak = useScalingStore(s => s.winStreak);
  const lossStreak = useScalingStore(s => s.lossStreak);
  const history = useScalingStore(s => s.history);
  const version = useScalingStore(s => s.version);
  const initPlan = useScalingStore(s => s.initPlan);
  const resetPlan = useScalingStore(s => s.resetPlan);
  const addTrade = useScalingStore(s => s.addTrade);
  const undoLast = useScalingStore(s => s.undoLast);
  const [startingCapitalInput, setStartingCapitalInput] = useState('100000');
  const [tradeAmountInput, setTradeAmountInput] = useState('');
  const [slInput, setSlInput] = useState('10');
  const [pipValueInput, setPipValueInput] = useState('10');
  const currentRiskPercent = RISK_LADDER[levelIndex];
  const advisedRiskAmount = (capital * currentRiskPercent) / 100;
  // Position Size Calculation
  const lotSize = useMemo(() => {
    const sl = parseFloat(slInput) || 0;
    const pipVal = parseFloat(pipValueInput) || 0;
    if (sl <= 0 || pipVal <= 0) return 0;
    return advisedRiskAmount / (sl * pipVal);
  }, [advisedRiskAmount, slInput, pipValueInput]);
  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      {/* Configuration Header */}
      <div className="flex flex-col md:flex-row items-end gap-4 bg-zinc-900/40 border border-white/5 p-6 rounded-2xl backdrop-blur-md">
        <div className="space-y-2 flex-1">
          <Label className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Capital de Départ (EUR)</Label>
          <Input 
            type="number" 
            value={startingCapitalInput} 
            onChange={(e) => setStartingCapitalInput(e.target.value)}
            className="bg-zinc-950 border-white/10 h-10 font-mono text-white"
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Button 
            onClick={() => initPlan(parseFloat(startingCapitalInput) || 100000)}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex-1 md:flex-none px-6"
          >
            Appliquer
          </Button>
          <Button 
            variant="outline" 
            onClick={resetPlan}
            className="border-white/10 text-zinc-400 hover:text-white hover:bg-zinc-800 flex-1 md:flex-none"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Réinitialiser
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Progression Panel */}
        <Card className="bg-zinc-900/40 border-white/5 backdrop-blur-md">
          <CardHeader className="border-b border-white/5 flex flex-row items-center justify-between py-4">
            <CardTitle className="text-xs font-bold uppercase tracking-widest flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              Progression du Risque
            </CardTitle>
            <Badge variant="outline" className="border-emerald-500/20 text-emerald-400 font-mono">
              Capital: {formatCurrency(capital)}
            </Badge>
          </CardHeader>
          <CardContent className="pt-8 space-y-8">
            {/* Current Risk Display */}
            <div className="flex flex-col items-center justify-center text-center space-y-2">
              <span className="text-6xl font-black font-mono tracking-tighter text-white">
                {currentRiskPercent.toFixed(1)}%
              </span>
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em]">
                Risque Palier Courant — Marche {levelIndex + 1}/6
              </p>
              <div className="mt-4 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                <span className="text-amber-500 text-xs font-bold uppercase tracking-widest">
                  Conseillé: {formatCurrency(advisedRiskAmount)}
                </span>
              </div>
            </div>
            {/* Level Pills */}
            <div className="flex justify-between gap-1">
              {RISK_LADDER.map((risk, idx) => (
                <div 
                  key={idx}
                  className={cn(
                    "flex-1 h-2 rounded-full transition-all duration-300",
                    idx === levelIndex ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" : 
                    idx < levelIndex ? "bg-emerald-900/40" : "bg-zinc-800"
                  )}
                />
              ))}
            </div>
            {/* Progression Streaks */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                  <span className="text-emerald-500 flex items-center gap-1"><ChevronUp className="w-3 h-3"/> Montée</span>
                  <span className="text-zinc-400">{winStreak}/3</span>
                </div>
                <Progress value={(winStreak / 3) * 100} className="h-2 bg-zinc-800" indicatorClassName="bg-emerald-500" />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                  <span className="text-rose-500 flex items-center gap-1"><ChevronDown className="w-3 h-3"/> Descente</span>
                  <span className="text-zinc-400">{lossStreak}/2</span>
                </div>
                <Progress value={(lossStreak / 2) * 100} className="h-2 bg-zinc-800" indicatorClassName="bg-rose-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        {/* Position Size Calculator */}
        <Card className="bg-zinc-900/40 border-white/5 backdrop-blur-md">
          <CardHeader className="border-b border-white/5 py-4">
            <CardTitle className="text-xs font-bold uppercase tracking-widest flex items-center gap-2">
              <Calculator className="w-4 h-4 text-blue-500" />
              Calculateur de Position (Lot)
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-8 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Stop Loss (Pips/Pts)</Label>
                <Input 
                  type="number" 
                  value={slInput} 
                  onChange={(e) => setSlInput(e.target.value)}
                  className="bg-zinc-950 border-white/10 font-mono"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Valeur du Pip (1 lot)</Label>
                <Input 
                  type="number" 
                  value={pipValueInput} 
                  onChange={(e) => setPipValueInput(e.target.value)}
                  className="bg-zinc-950 border-white/10 font-mono"
                />
              </div>
            </div>
            <div className="bg-zinc-950/60 border border-white/5 rounded-2xl p-8 flex flex-col items-center justify-center text-center space-y-1">
              <span className="text-5xl font-black font-mono text-blue-400 tabular-nums">
                {lotSize.toFixed(2)}
              </span>
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em]">Taille de Lot Suggérée</p>
              <div className="w-full h-px bg-white/5 my-4" />
              <p className="text-[9px] text-zinc-600 font-medium italic">
                Formule: {formatCurrency(advisedRiskAmount)} / ({slInput} SL × {pipValueInput} PipVal)
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      {/* Trade Logger & History */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Logger Section */}
        <Card className="bg-zinc-900/40 border-white/5 backdrop-blur-md xl:col-span-1">
          <CardHeader className="border-b border-white/5">
            <CardTitle className="text-xs font-bold uppercase tracking-widest flex items-center gap-2">
              <Target className="w-4 h-4 text-orange-500" />
              Journaliseur de Trade
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <div className="space-y-2">
              <Label className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Résultat P/L (€)</Label>
              <Input 
                type="number" 
                placeholder="Ex: 500 ou -200" 
                value={tradeAmountInput}
                onChange={(e) => setTradeAmountInput(e.target.value)}
                className="bg-zinc-950 border-white/10 h-12 text-xl font-mono text-center"
              />
            </div>
            <div className="grid grid-cols-1 gap-2">
              <Button 
                onClick={() => {
                  addTrade('win', parseFloat(tradeAmountInput) || 0);
                  setTradeAmountInput('');
                }}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold h-12 uppercase tracking-tighter gap-2"
              >
                <CheckCircle2 className="w-4 h-4" /> Gagnant +
              </Button>
              <Button 
                onClick={() => {
                  addTrade('loss', parseFloat(tradeAmountInput) || 0);
                  setTradeAmountInput('');
                }}
                className="bg-rose-600 hover:bg-rose-500 text-white font-bold h-12 uppercase tracking-tighter gap-2"
              >
                <XCircle className="w-4 h-4" /> Perdant -
              </Button>
              <Button 
                onClick={() => {
                  addTrade('be', parseFloat(tradeAmountInput) || 0);
                  setTradeAmountInput('');
                }}
                variant="secondary"
                className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold h-12 uppercase tracking-tighter gap-2"
              >
                <MinusCircle className="w-4 h-4" /> Break-even
              </Button>
              <Button 
                onClick={undoLast}
                variant="ghost" 
                className="text-zinc-500 hover:text-white mt-2 text-[10px] uppercase font-bold tracking-widest h-8"
              >
                <Undo2 className="w-3 h-3 mr-2" /> Annuler dernier trade
              </Button>
            </div>
          </CardContent>
        </Card>
        {/* History Ledger */}
        <Card className="bg-zinc-900/40 border-white/5 backdrop-blur-md xl:col-span-2">
          <CardHeader className="border-b border-white/5 py-4">
            <CardTitle className="text-xs font-bold uppercase tracking-widest flex items-center gap-2">
              <History className="w-4 h-4 text-zinc-400" />
              Historique des Paliers
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="max-h-[400px] overflow-auto">
              <table className="w-full text-left border-collapse">
                <thead className="sticky top-0 bg-zinc-900 z-10">
                  <tr className="border-b border-white/5">
                    <th className="px-6 py-4 text-[9px] uppercase font-bold text-zinc-500 tracking-widest">Date / Heure</th>
                    <th className="px-6 py-4 text-[9px] uppercase font-bold text-zinc-500 tracking-widest">Type</th>
                    <th className="px-6 py-4 text-[9px] uppercase font-bold text-zinc-500 tracking-widest">Montant</th>
                    <th className="px-6 py-4 text-[9px] uppercase font-bold text-zinc-500 tracking-widest">Capital</th>
                    <th className="px-6 py-4 text-[9px] uppercase font-bold text-zinc-500 tracking-widest">Risque %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {history.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-zinc-600 text-[10px] font-bold uppercase tracking-widest">
                        Aucun historique disponible
                      </td>
                    </tr>
                  ) : (
                    history.map((trade) => (
                      <tr key={trade.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-6 py-4 text-[10px] font-mono text-zinc-400">
                          {format(new Date(trade.timestamp), 'dd/MM HH:mm', { locale: fr })}
                        </td>
                        <td className="px-6 py-4">
                          <Badge 
                            className={cn(
                              "text-[9px] font-bold uppercase tracking-tighter",
                              trade.type === 'win' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
                              trade.type === 'loss' ? "bg-rose-500/10 text-rose-500 border-rose-500/20" :
                              "bg-zinc-800 text-zinc-400 border-white/5"
                            )}
                          >
                            {trade.type === 'win' ? 'Gagnant' : trade.type === 'loss' ? 'Perdant' : 'BE'}
                          </Badge>
                        </td>
                        <td className={cn(
                          "px-6 py-4 text-xs font-mono font-bold",
                          trade.amount > 0 ? "text-emerald-400" : trade.amount < 0 ? "text-rose-400" : "text-zinc-400"
                        )}>
                          {trade.amount > 0 ? '+' : ''}{formatCurrency(trade.amount)}
                        </td>
                        <td className="px-6 py-4 text-xs font-mono text-white">
                          {formatCurrency(trade.capitalAfter)}
                        </td>
                        <td className="px-6 py-4 text-[10px] font-mono text-zinc-500">
                          {trade.riskApplied.toFixed(1)}%
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}