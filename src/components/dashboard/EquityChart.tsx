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
    <div className="h-[450px] w-full p-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#18181b" vertical={false} />
          <XAxis
            dataKey="tradeIndex"
            stroke="#3f3f46"
            fontSize={9}
            tickLine={false}
            axisLine={false}
            label={{ value: 'Séquence de Trades', position: 'insideBottom', offset: -10, fill: '#52525b', fontSize: 9, fontWeight: 'bold' }}
          />
          <YAxis
            stroke="#3f3f46"
            fontSize={9}
            tickLine={false}
            axisLine={false}
            domain={[0, 'auto']}
            tickFormatter={(val) => `${(val / 1000).toFixed(0)}k`}
          />
          <Tooltip
            contentStyle={{ backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '12px', padding: '12px' }}
            itemStyle={{ fontSize: '10px', padding: '2px 0' }}
            labelStyle={{ color: '#71717a', marginBottom: '8px', fontSize: '10px', fontWeight: 'bold' }}
            formatter={(val: number) => [formatCurrency(val), 'Solde']}
            labelFormatter={(label) => `Trade #${label}`}
          />
          {/* Main Account Lines */}
          {Array.from({ length: accountCount }).map((_, i) => {
            const finalVal = data[data.length - 1][`acc${i}`];
            const isRuined = data[data.length - 1][`status${i}`] === 'ruined';
            return (
              <Line
                key={i}
                type="monotone"
                dataKey={`acc${i}`}
                stroke={isRuined ? "#f43f5e" : "#10b981"}
                strokeWidth={1}
                dot={false}
                opacity={0.15}
                isAnimationActive={false}
                connectNulls
              />
            );
          })}
          {/* Median Path Overlay */}
          <Line
            type="monotone"
            dataKey="medianSurvivor"
            name="Médiane des Survivants"
            stroke="#ffffff"
            strokeWidth={3}
            dot={false}
            opacity={1}
            isAnimationActive={false}
            strokeDasharray="5 5"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}