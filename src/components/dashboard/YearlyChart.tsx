import React, { useMemo } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  ReferenceLine, ReferenceArea, Line, ComposedChart
} from 'recharts';
import { useJournalStore } from '@/store/useJournalStore';
import { format, parseISO, isSameYear, getMonth, startOfYear, endOfYear, eachMonthOfInterval } from 'date-fns';
import { formatCurrency } from '@/lib/currency';
export function YearlyChart() {
  const entries = useJournalStore(s => s.entries);
  const currentYear = new Date().getFullYear();
  const data = useMemo(() => {
    const months = eachMonthOfInterval({
      start: startOfYear(new Date(currentYear, 0, 1)),
      end: endOfYear(new Date(currentYear, 0, 1))
    });
    const monthlyTarget = 600 * 22; // 13,200 EUR
    let cumulativeActual = 0;
    return months.map((month) => {
      const monthIdx = getMonth(month);
      const monthLabel = format(month, 'MMM');
      const monthlySum = Object.values(entries)
        .filter(e => {
          const d = parseISO(e.date);
          return isSameYear(d, month) && getMonth(d) === monthIdx;
        })
        .reduce((sum, e) => sum + e.pnl, 0);
      cumulativeActual += monthlySum;
      return {
        name: monthLabel,
        actual: monthlySum,
        target: monthlyTarget,
        cumulative: cumulativeActual,
        isCurrent: getMonth(new Date()) === monthIdx
      };
    });
  }, [entries, currentYear]);
  const currentMonthData = data.find(d => d.isCurrent);
  const deltaVsTarget = currentMonthData 
    ? ((currentMonthData.actual / currentMonthData.target) * 100).toFixed(0)
    : "0";
  return (
    <div className="bg-zinc-900/30 border border-white/5 rounded-2xl p-6 md:p-8 backdrop-blur-sm">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">Yearly Growth vs Goals</h2>
          <p className="text-zinc-500 text-sm">Targeting {formatCurrency(13200)} / month based on daily +600€</p>
        </div>
        <div className="bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-lg">
          <span className="text-emerald-400 text-xs font-bold uppercase tracking-wider">
            Current Month: {deltaVsTarget}% of Goal
          </span>
        </div>
      </div>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data}>
            <defs>
              <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#71717a', fontSize: 12 }} 
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#71717a', fontSize: 10 }}
              tickFormatter={(val) => `${val/1000}k`}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '8px' }}
              itemStyle={{ fontSize: '12px' }}
              formatter={(val: number) => [formatCurrency(val), '']}
            />
            <ReferenceArea 
              x1={format(new Date(), 'MMM')} 
              x2={format(new Date(), 'MMM')} 
              strokeOpacity={0.3} 
              fill="#27272a" 
            />
            <Area 
              type="monotone" 
              dataKey="actual" 
              stroke="#3b82f6" 
              fillOpacity={1} 
              fill="url(#colorActual)" 
              strokeWidth={2}
            />
            <Line 
              type="monotone" 
              dataKey="target" 
              stroke="#10b981" 
              strokeDasharray="5 5" 
              dot={false} 
              strokeWidth={1.5}
            />
            <Line 
              type="monotone" 
              dataKey="cumulative" 
              stroke="#f59e0b" 
              dot={{ r: 2, fill: '#f59e0b' }} 
              strokeWidth={1}
              opacity={0.5}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-6 flex gap-6">
        <div className="flex items-center gap-2">
          <div className="w-3 h-1 bg-blue-500 rounded-full" />
          <span className="text-xs text-zinc-400">Monthly Actual</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-1 bg-emerald-500 border-t border-dashed border-zinc-900" />
          <span className="text-xs text-zinc-400">Monthly Target</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-1 bg-amber-500 rounded-full" />
          <span className="text-xs text-zinc-400">Cumulative YTD</span>
        </div>
      </div>
    </div>
  );
}