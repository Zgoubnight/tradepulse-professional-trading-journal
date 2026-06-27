import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { formatCurrency } from '@/lib/currency';
interface EquityChartProps {
  data: any[];
  accountCount: number;
}
export function EquityChart({ data, accountCount }: EquityChartProps) {
  if (!data || data.length === 0) return null;
  return (
    <div className="h-[400px] w-full mt-8 bg-zinc-900/20 rounded-xl p-4 border border-white/5">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
          <XAxis 
            dataKey="tradeIndex" 
            stroke="#71717a" 
            fontSize={10} 
            tickLine={false} 
            axisLine={false}
            label={{ value: 'Nombre de Trades', position: 'insideBottom', offset: -5, fill: '#71717a', fontSize: 10 }}
          />
          <YAxis 
            stroke="#71717a" 
            fontSize={10} 
            tickLine={false} 
            axisLine={false}
            tickFormatter={(val) => `${(val / 1000).toFixed(0)}k`}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '8px' }}
            itemStyle={{ fontSize: '10px' }}
            labelStyle={{ color: '#71717a', marginBottom: '4px' }}
            formatter={(val: number) => [formatCurrency(val), 'Solde']}
          />
          {Array.from({ length: accountCount }).map((_, i) => (
            <Line
              key={i}
              type="monotone"
              dataKey={`acc${i}`}
              stroke={i === 0 ? "#10b981" : "#3b82f6"}
              strokeWidth={i === 0 ? 2 : 1}
              dot={false}
              opacity={i === 0 ? 0.8 : 0.15}
              isAnimationActive={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}