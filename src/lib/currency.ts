import { cn } from "@/lib/utils";
export function formatCurrency(amount: number): string {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  return formatter.format(amount);
}
export function getPnlColorClass(amount: number, type: 'text' | 'bg' | 'border' = 'text'): string {
  if (amount > 0) {
    if (type === 'text') return 'text-emerald-400';
    if (type === 'bg') return 'bg-emerald-500/10';
    return 'border-emerald-500/20';
  }
  if (amount < 0) {
    if (type === 'text') return 'text-rose-400';
    if (type === 'bg') return 'bg-rose-500/10';
    return 'border-rose-500/20';
  }
  if (type === 'text') return 'text-zinc-400';
  if (type === 'bg') return 'bg-zinc-900';
  return 'border-white/5';
}