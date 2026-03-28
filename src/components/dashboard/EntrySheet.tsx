import React, { useEffect, useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';
import { useJournalStore } from '@/store/useJournalStore';
interface EntrySheetProps {
  date: Date | null;
  isOpen: boolean;
  onClose: () => void;
}
export function EntrySheet({ date, isOpen, onClose }: EntrySheetProps) {
  const entries = useJournalStore((s) => s.entries);
  const setEntry = useJournalStore((s) => s.setEntry);
  const removeEntry = useJournalStore((s) => s.removeEntry);
  const [pnl, setPnl] = useState('');
  const [tradeCount, setTradeCount] = useState('');
  const [notes, setNotes] = useState('');
  useEffect(() => {
    if (date && isOpen) {
      const dateKey = format(date, 'yyyy-MM-dd');
      const existing = entries[dateKey];
      if (existing) {
        setPnl(existing.pnl.toString());
        setTradeCount(existing.tradeCount.toString());
        setNotes(existing.notes);
      } else {
        setPnl('');
        setTradeCount('');
        setNotes('');
      }
    }
  }, [date, entries, isOpen]);
  const handleSave = () => {
    if (!date) return;
    const dateKey = format(date, 'yyyy-MM-dd');
    setEntry(dateKey, {
      pnl: parseFloat(pnl) || 0,
      tradeCount: parseInt(tradeCount) || 0,
      notes,
    });
    onClose();
  };
  const handleDelete = () => {
    if (!date) return;
    const dateKey = format(date, 'yyyy-MM-dd');
    removeEntry(dateKey);
    onClose();
  };
  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="bg-zinc-950 border-zinc-900 text-white w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="text-white text-xl font-bold">
            {date ? format(date, 'MMMM do, yyyy') : 'Edit Entry'}
          </SheetTitle>
          <SheetDescription className="text-zinc-500">
            Log your daily P/L and trading volume.
          </SheetDescription>
        </SheetHeader>
        <div className="space-y-6 py-8">
          <div className="space-y-2">
            <Label htmlFor="pnl" className="text-zinc-400 text-xs font-bold uppercase tracking-widest">Net P/L (€)</Label>
            <Input
              id="pnl"
              type="number"
              placeholder="e.g. 600 or -200"
              value={pnl}
              onChange={(e) => setPnl(e.target.value)}
              className="bg-zinc-900 border-zinc-800 focus:ring-emerald-500/50 h-12 text-lg font-mono"
            />
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="text-[10px] h-7 border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/10"
                onClick={() => setPnl('600')}
              >
                +600€ Target
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-[10px] h-7 border-rose-500/20 text-rose-500 hover:bg-rose-500/10"
                onClick={() => setPnl('-200')}
              >
                -200€ Max Loss
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="trades" className="text-zinc-400 text-xs font-bold uppercase tracking-widest">Total Trades</Label>
            <Input
              id="trades"
              type="number"
              placeholder="0"
              value={tradeCount}
              onChange={(e) => setTradeCount(e.target.value)}
              className="bg-zinc-900 border-zinc-800 focus:ring-emerald-500/50 h-12 font-mono"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-zinc-400 text-xs font-bold uppercase tracking-widest">Trade Notes</Label>
            <Textarea
              id="notes"
              placeholder="Market conditions, mistakes, or wins..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="bg-zinc-900 border-zinc-800 min-h-[140px] focus:ring-emerald-500/50 resize-none"
            />
          </div>
        </div>
        <SheetFooter className="flex-col sm:flex-row gap-3 pt-4 border-t border-white/5">
          <Button variant="ghost" onClick={handleDelete} className="w-full sm:w-auto text-rose-500 hover:text-rose-400 hover:bg-rose-500/10">
            Delete Record
          </Button>
          <div className="flex-1" />
          <Button onClick={handleSave} className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-8">
            Save Performance
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}