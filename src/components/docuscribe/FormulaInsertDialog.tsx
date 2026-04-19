/**
 * DocuSCRIBE™ — Formula Insert Dialog
 *
 * @classification UI_COMPONENT
 * @authority DocuSCRIBE Division
 * @status P3_CONNECTOR
 *
 * UI for browsing and inserting engineering formulas.
 */

'use client';

import React, { useState, useMemo } from 'react';
import { Search, Sigma, GitCommitVertical } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  FORMULA_LIBRARY,
  getAvailableCategories,
  searchFormulas,
  getFormulasByCategory,
  EngineeringFormula
} from '@/lib/docuscribe/formula-library';

interface FormulaInsertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onInsert: (text: string) => void;
}

export function FormulaInsertDialog({ open, onOpenChange, onInsert }: FormulaInsertDialogProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const categories = getAvailableCategories();
  
  const searchResults = useMemo(() => {
    if (searchTerm.trim() === '') return [];
    return searchFormulas(searchTerm);
  }, [searchTerm]);

  const handleInsert = (formula: EngineeringFormula) => {
    onInsert(formula.insertText);
    setSearchTerm('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl h-[85vh] flex flex-col bg-background/95 backdrop-blur-xl border-white/10 p-0 overflow-hidden">
        
        {/* Header */}
        <div className="shrink-0 p-6 pb-4 border-b border-white/10">
          <DialogHeader>
            <div className="flex items-center gap-2 mb-1">
              <Sigma className="w-5 h-5 text-primary" />
              <DialogTitle className="text-sm font-black uppercase tracking-tight">
                Formula Library
              </DialogTitle>
            </div>
            <DialogDescription className="text-xs text-muted-foreground">
              Select technical formulas to insert into your document.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search formulas by name, variable, or description..."
              className="pl-9 bg-white/[0.03] border-white/10 text-white placeholder-white/20"
            />
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 min-h-0 bg-black/20">
          {searchTerm ? (
            <ScrollArea className="h-full">
              <div className="p-6 space-y-4">
                {searchResults.length === 0 ? (
                  <div className="text-center py-12 text-sm text-white/30 italic">
                    No formulas found matching "{searchTerm}"
                  </div>
                ) : (
                  searchResults.map(formula => (
                    <FormulaCard key={formula.id} formula={formula} onInsert={() => handleInsert(formula)} />
                  ))
                )}
              </div>
            </ScrollArea>
          ) : (
            <Tabs defaultValue={categories[0]} className="h-full flex flex-col">
              <div className="shrink-0 pt-2 px-6 border-b border-white/5 overflow-x-auto scrollbar-hide">
                <TabsList className="bg-transparent h-auto p-0 flex space-x-6 justify-start">
                  {categories.map(cat => (
                    <TabsTrigger
                      key={cat}
                      value={cat}
                      className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary pb-3 px-0 rounded-none text-[11px] font-bold uppercase tracking-wider text-white/40 border-b-2 border-transparent"
                    >
                      {cat}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>
              
              <div className="flex-1 min-h-0">
                {categories.map(cat => (
                  <TabsContent key={cat} value={cat} className="h-full m-0 data-[state=active]:flex flex-col">
                    <ScrollArea className="h-full">
                      <div className="p-6 space-y-4">
                        {getFormulasByCategory(cat).map(formula => (
                          <FormulaCard key={formula.id} formula={formula} onInsert={() => handleInsert(formula)} />
                        ))}
                      </div>
                    </ScrollArea>
                  </TabsContent>
                ))}
              </div>
            </Tabs>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Formula Card Component ──────────────────────────────────────────

function FormulaCard({ formula, onInsert }: { formula: EngineeringFormula, onInsert: () => void }) {
  return (
    <div className="group relative bg-white/[0.02] border border-white/5 rounded-xl p-4 hover:border-primary/30 transition-all duration-300">
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-bold text-white/90 mb-1 leading-tight">{formula.name}</h4>
          <p className="text-[11px] text-white/50 mb-3">{formula.description}</p>
          
          <div className="bg-black/40 rounded-lg p-3 font-mono text-sm text-primary mb-3 overflow-x-auto flex items-center gap-2 border border-primary/10">
             <Sigma className="w-4 h-4 text-primary/50 shrink-0" />
             {formula.expression}
          </div>
          
          <div className="space-y-1">
            <div className="text-[9px] font-bold uppercase tracking-widest text-white/30 mb-2">Variables</div>
            {formula.variables.map(v => (
              <div key={v.symbol} className="flex items-start gap-2 text-[11px]">
                <div className="flex items-center gap-1.5 w-8 shrink-0">
                  <GitCommitVertical className="w-3 h-3 text-white/20" />
                  <span className="font-mono font-bold text-amber-200">{v.symbol}</span>
                </div>
                <span className="text-white/60 flex-1">{v.definition}</span>
                <span className="text-white/30 italic tabular-nums">[{v.unit}]</span>
              </div>
            ))}
          </div>
        </div>
        
        <button
          onClick={onInsert}
          className="shrink-0 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 hover:border-primary/40 px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-colors"
        >
          Insert
        </button>
      </div>
    </div>
  );
}
