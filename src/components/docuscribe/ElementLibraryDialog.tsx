/**
 * DocuSCRIBE™ — Element Library Dialog (Periodic Table)
 *
 * @classification UI_COMPONENT
 * @authority DocuSCRIBE Division
 * @status P3_CONNECTOR
 *
 * Interactive periodic table UI for inserting element data.
 */

'use client';

import React, { useState } from 'react';
import { Hexagon, Search, ArrowRight } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  ChemicalElement,
  ELEMENT_LIBRARY,
  searchElements,
  getElementCategoryColor,
  getElementInsertText
} from '@/lib/docuscribe/element-library';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ElementLibraryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onInsert: (text: string) => void;
}

export function ElementLibraryDialog({ open, onOpenChange, onInsert }: ElementLibraryDialogProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedElement, setSelectedElement] = useState<ChemicalElement | null>(null);

  const searchResults = searchTerm.trim() ? searchElements(searchTerm) : ELEMENT_LIBRARY;

  return (
    <Dialog open={open} onOpenChange={(val) => {
      onOpenChange(val);
      if (!val) {
        setSearchTerm('');
        setSelectedElement(null);
      }
    }}>
      <DialogContent className="sm:max-w-[90vw] lg:max-w-5xl h-[85vh] flex flex-col bg-[#0a0a0a]/95 backdrop-blur-2xl border-white/10 p-0 overflow-hidden">
        
        {/* Header */}
        <div className="shrink-0 p-6 pb-4 border-b border-white/10 bg-white/[0.01]">
          <div className="flex justify-between items-start gap-4">
            <DialogHeader className="text-left">
              <div className="flex items-center gap-2 mb-1">
                <Hexagon className="w-5 h-5 text-indigo-400" />
                <DialogTitle className="text-sm font-black uppercase tracking-tight text-white/90">
                  Element Library
                </DialogTitle>
              </div>
              <DialogDescription className="text-xs text-muted-foreground">
                Periodic table dataset. Select an element to view properties or insert into document.
              </DialogDescription>
            </DialogHeader>

            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <Input
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  if (e.target.value.trim() === '') setSelectedElement(null);
                }}
                placeholder="Search..."
                className="pl-9 bg-white/[0.03] border-white/10 text-white placeholder-white/20 h-8 text-xs"
              />
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 min-h-0 flex overflow-hidden">
          
          {/* Main Grid Area */}
          <div className="flex-1 overflow-auto bg-[#050505] p-6 scrollbar-hide">
            {searchTerm.trim() ? (
              /* Linear Search Results List */
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {searchResults.map(el => (
                  <button
                    key={el.atomic_number}
                    onClick={() => setSelectedElement(el)}
                    className={cn(
                      "flex flex-col p-3 rounded-lg border text-left transition-all",
                      selectedElement?.atomic_number === el.atomic_number
                        ? "border-white border-2" 
                        : "border-transparent",
                      getElementCategoryColor(el.category)
                    )}
                  >
                    <div className="flex justify-between w-full opacity-60 text-[9px] font-mono">
                      <span>{el.atomic_number}</span>
                      <span>{el.atomic_mass.toFixed(1)}</span>
                    </div>
                    <div className="text-2xl font-black">{el.symbol}</div>
                    <div className="text-[10px] uppercase font-bold tracking-wider mt-1 truncate w-full">{el.name}</div>
                  </button>
                ))}
              </div>
            ) : (
              /* Pseudo Periodic Table Layout (Flex/Float layout for simplicity over strict CSS grid) */
              <div className="flex flex-col gap-2 min-w-max mx-auto">
                <div className="flex gap-2">
                  <ElementCell el={ELEMENT_LIBRARY[0]} selected={selectedElement} onSelect={setSelectedElement} />
                  <div className="w-[calc(16*4rem+16*0.5rem)]" /> {/* Spacer */}
                  <ElementCell el={ELEMENT_LIBRARY[1]} selected={selectedElement} onSelect={setSelectedElement} />
                </div>
                
                <div className="flex gap-2">
                  <ElementCell el={ELEMENT_LIBRARY[2]} selected={selectedElement} onSelect={setSelectedElement} />
                  <ElementCell el={ELEMENT_LIBRARY[3]} selected={selectedElement} onSelect={setSelectedElement} />
                  <div className="w-[calc(10*4rem+10*0.5rem)]" /> {/* Spacer */}
                  {ELEMENT_LIBRARY.slice(4, 10).map(el => <ElementCell key={el.atomic_number} el={el} selected={selectedElement} onSelect={setSelectedElement} />)}
                </div>

                <div className="flex gap-2">
                  <ElementCell el={ELEMENT_LIBRARY[10]} selected={selectedElement} onSelect={setSelectedElement} />
                  <ElementCell el={ELEMENT_LIBRARY[11]} selected={selectedElement} onSelect={setSelectedElement} />
                  <div className="w-[calc(10*4rem+10*0.5rem)]" /> {/* Spacer */}
                  {ELEMENT_LIBRARY.slice(12, 18).map(el => <ElementCell key={el.atomic_number} el={el} selected={selectedElement} onSelect={setSelectedElement} />)}
                </div>

                {/* Simplified Period 4-7 to just a flowing grid for P3 scope to avoid massive layout math mapping */}
                <div className="mt-8 text-[10px] text-white/30 uppercase tracking-widest font-bold mb-2">Selected Heavier Elements</div>
                <div className="flex flex-wrap gap-2">
                  {ELEMENT_LIBRARY.slice(18).map(el => <ElementCell key={el.atomic_number} el={el} selected={selectedElement} onSelect={setSelectedElement} />)}
                </div>
              </div>
            )}
          </div>

          {/* Right Detail Panel */}
          {selectedElement && (
            <div className="w-80 shrink-0 border-l border-white/5 bg-white/[0.01] flex flex-col z-10">
              <ScrollArea className="flex-1 p-6">
                
                {/* Big Element Display */}
                <div className={cn(
                  "w-32 h-32 mx-auto rounded-2xl border flex flex-col justify-center items-center shadow-lg mb-6",
                  getElementCategoryColor(selectedElement.category)
                )}>
                  <span className="text-sm font-mono opacity-60 absolute top-3 left-3">{selectedElement.atomic_number}</span>
                  <span className="text-6xl font-black tracking-tighter">{selectedElement.symbol}</span>
                  <span className="text-xs font-mono opacity-80 absolute bottom-3">{selectedElement.atomic_mass.toFixed(3)}</span>
                </div>

                <h3 className="text-2xl font-black text-center mb-1">{selectedElement.name}</h3>
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 text-center mb-8">
                  {selectedElement.category}
                </p>

                <div className="space-y-4">
                  <DetailRow label="Group" value={selectedElement.group?.toString() || '—'} />
                  <DetailRow label="Period" value={selectedElement.period.toString()} />
                  <DetailRow label="Density" value={selectedElement.density ? `${selectedElement.density} g/cm³` : 'Unknown'} />
                  <DetailRow label="Melting Point" value={selectedElement.melting_point ? `${selectedElement.melting_point} K` : 'Unknown'} />
                  <DetailRow label="Boiling Point" value={selectedElement.boiling_point ? `${selectedElement.boiling_point} K` : 'Unknown'} />
                </div>
              </ScrollArea>
              
              <div className="p-4 border-t border-white/5 bg-black/20">
                <button
                  onClick={() => {
                    onInsert(getElementInsertText(selectedElement));
                    onOpenChange(false);
                    setSearchTerm('');
                    setSelectedElement(null);
                  }}
                  className="w-full flex justify-center items-center gap-2 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/30 rounded-lg p-3 text-xs font-bold uppercase tracking-wider transition-colors"
                >
                  Insert Data Block
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Helpers ───

function ElementCell({ el, selected, onSelect }: { el: ChemicalElement, selected: ChemicalElement | null, onSelect: (e: ChemicalElement) => void }) {
  const isSelected = selected?.atomic_number === el.atomic_number;
  return (
    <button
      onClick={() => onSelect(el)}
      className={cn(
        "w-16 h-16 rounded-md border flex flex-col justify-center items-center transition-all flex-shrink-0 cursor-pointer overflow-hidden relative",
        isSelected ? "border-white border-2 scale-110 shadow-lg z-10" : "border-transparent opacity-80 hover:opacity-100",
        getElementCategoryColor(el.category)
      )}
    >
      <span className="text-[8px] font-mono opacity-50 absolute top-1 left-1">{el.atomic_number}</span>
      <span className="text-xl font-black">{el.symbol}</span>
    </button>
  );
}

function DetailRow({ label, value }: { label: string, value: string }) {
  return (
    <div className="flex justify-between items-baseline border-b border-white/5 pb-2">
      <span className="text-[10px] font-bold uppercase tracking-widest text-white/30">{label}</span>
      <span className="text-xs font-mono text-white/70">{value}</span>
    </div>
  );
}
