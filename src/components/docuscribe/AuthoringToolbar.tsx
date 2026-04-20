/**
 * DocuSCRIBE™ — Authoring Toolbar
 * 
 * Comprehensive command bar for document editing and formatting.
 * Categorized into Text, Paragraph, Structure, and Insertion tools.
 */

'use client';

import React, { useState } from 'react';
import { 
  Bold, Italic, Underline, Strikethrough, 
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  List, ListOrdered, Type, Heading1, Heading2, 
  Table as TableIcon, Image as ImageIcon, Sigma, Hexagon,
  Link as LinkIcon, Minus, Hash, Superscript, Subscript,
  Eraser, ChevronDown, Camera, MessageSquare, CloudRain, ShieldCheck,
  Share2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDocuScribe } from '@/lib/docuscribe/context';

interface ToolbarButtonProps {
  icon: React.ElementType;
  title: string;
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
}

function ToolbarButton({ icon: Icon, title, onClick, active, disabled }: ToolbarButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "p-2 rounded-lg transition-all duration-200",
        active 
          ? "bg-primary text-black shadow-lg shadow-primary/20" 
          : "text-white/40 hover:text-white hover:bg-white/5 disabled:opacity-20 disabled:pointer-events-none"
      )}
      title={title}
    >
      <Icon className="w-4 h-4" />
    </button>
  );
}

interface AuthoringToolbarProps {
  onCommand: (command: string, value?: string) => void;
  onOpenFormulas?: () => void;
  onOpenElements?: () => void;
  onOpenExport?: () => void;
  onOpenShare?: () => void;
}

export function AuthoringToolbar({ onCommand, onOpenFormulas, onOpenElements, onOpenExport, onOpenShare }: AuthoringToolbarProps) {
  const { activeDocument, updateFormatting, createSnapshot, addComment, insertDataBlock } = useDocuScribe();
  const [activeCategory, setActiveCategory] = useState<'text' | 'para' | 'struct' | 'insert'>('text');

  const categories = [
    { id: 'text', name: 'Text', icon: Type },
    { id: 'para', name: 'Paragraph', icon: AlignLeft },
    { id: 'struct', name: 'Structure', icon: Hash },
    { id: 'insert', name: 'Insert', icon: Sigma },
  ];

  const lineSpacings = [1.0, 1.15, 1.5, 2.0];
  const fonts = [
    { name: 'Inter', family: 'Inter' },
    { name: 'Roboto', family: 'Roboto' },
    { name: 'Technical', family: 'JetBrains Mono' }
  ];

  return (
    <div className="flex flex-col border border-white/5 bg-black/10 rounded-t-xl overflow-hidden transition-all duration-500">
      {/* ─── Category Tabs ─── */}
      <div className="flex px-4 pt-4 gap-6 border-b border-white/[0.02]">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id as any)}
            className={cn(
              "pb-3 px-1 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative",
              activeCategory === cat.id 
                ? "text-primary opacity-100" 
                : "text-white/20 hover:text-white/40 opacity-50"
            )}
          >
            {cat.name}
            {activeCategory === cat.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary shadow-glow shadow-primary/20" />
            )}
          </button>
        ))}
      </div>

      {/* ─── Command Row ─── */}
      <div className="flex items-center justify-between p-2 px-4 h-12">
        <div className="flex items-center gap-1">
          {activeCategory === 'text' && (
            <>
              <ToolbarButton icon={Bold} title="Bold" onClick={() => onCommand('bold')} />
              <ToolbarButton icon={Italic} title="Italic" onClick={() => onCommand('italic')} />
              <ToolbarButton icon={Underline} title="Underline" onClick={() => onCommand('underline')} />
              <ToolbarButton icon={Strikethrough} title="Strikethrough" onClick={() => onCommand('strikeThrough')} />
              <div className="w-px h-6 bg-white/5 mx-1" />
              <ToolbarButton icon={Superscript} title="Superscript" onClick={() => onCommand('superscript')} />
              <ToolbarButton icon={Subscript} title="Subscript" onClick={() => onCommand('subscript')} />
              <div className="w-px h-6 bg-white/5 mx-1" />
              
              <select 
                className="bg-transparent text-[10px] text-white/60 font-black uppercase tracking-wider outline-none cursor-pointer border border-white/10 rounded px-1 hover:text-white"
                value={activeDocument?.formatting.fontFamily}
                onChange={(e) => updateFormatting({ fontFamily: e.target.value })}
              >
                {fonts.map(f => (
                  <option key={f.family} value={f.family} className="bg-zinc-900">{f.name}</option>
                ))}
              </select>

              <div className="w-px h-6 bg-white/5 mx-1" />
              <ToolbarButton icon={Eraser} title="Clear Formatting" onClick={() => onCommand('removeFormat')} />
            </>
          )}

          {activeCategory === 'para' && (
            <>
              <ToolbarButton icon={AlignLeft} title="Align Left" onClick={() => onCommand('justifyLeft')} />
              <ToolbarButton icon={AlignCenter} title="Align Center" onClick={() => onCommand('justifyCenter')} />
              <ToolbarButton icon={AlignRight} title="Align Right" onClick={() => onCommand('justifyRight')} />
              <ToolbarButton icon={AlignJustify} title="Justify" onClick={() => onCommand('justifyFull')} />
              <div className="w-px h-6 bg-white/5 mx-1" />
              <ToolbarButton icon={List} title="Bulleted List" onClick={() => onCommand('insertUnorderedList')} />
              <ToolbarButton icon={ListOrdered} title="Numbered List" onClick={() => onCommand('insertOrderedList')} />
              <div className="w-px h-6 bg-white/5 mx-1" />
              
              <div className="flex items-center gap-1">
                {lineSpacings.map(s => (
                  <button
                    key={s}
                    onClick={() => updateFormatting({ lineSpacing: s })}
                    className={cn(
                      "px-1.5 py-0.5 text-[9px] font-black rounded transition-all",
                      activeDocument?.formatting.lineSpacing === s
                        ? "bg-primary text-black"
                        : "text-white/40 hover:text-white hover:bg-white/5"
                    )}
                  >
                    {s}x
                  </button>
                ))}
              </div>
            </>
          )}

          {activeCategory === 'struct' && (
            <>
              <ToolbarButton icon={Heading1} title="Heading 1" onClick={() => onCommand('formatBlock', 'H1')} />
              <ToolbarButton icon={Heading2} title="Heading 2" onClick={() => onCommand('formatBlock', 'H2')} />
              {[3, 4, 5, 6].map(n => (
                <button 
                  key={n}
                  onClick={() => onCommand('formatBlock', `H${n}`)}
                  className="px-2 py-1 text-[9px] font-black text-white/20 hover:text-primary transition-colors border border-white/5 rounded-md hover:border-primary/20"
                >
                  H{n}
                </button>
              ))}
              <div className="w-px h-6 bg-white/5 mx-1" />
              <ToolbarButton icon={Hash} title="Section Break (HR)" onClick={() => onCommand('insertHorizontalRule')} />
            </>
          )}

          {activeCategory === 'insert' && (
            <>
              <ToolbarButton 
                icon={TableIcon} 
                title="Insert Table" 
                onClick={() => onCommand('insertHTML', '<table style=\"width:100%; border-collapse: collapse; margin: 1em 0;\"><tr style=\"border: 1px solid #ddd;\"><td style=\"border: 1px solid #ddd; padding: 8px;\">Cell 1</td><td style=\"border: 1px solid #ddd; padding: 8px;\">Cell 2</td></tr><tr style=\"border: 1px solid #ddd;\"><td style=\"border: 1px solid #ddd; padding: 8px;\">Cell 3</td><td style=\"border: 1px solid #ddd; padding: 8px;\">Cell 4</td></tr></table>')} 
              />
              <ToolbarButton icon={ImageIcon} title="Insert Image" onClick={() => alert('Image upload integration in next sub-phase')} />
              <div className="w-px h-6 bg-white/5 mx-1" />
              <ToolbarButton icon={Sigma} title="Formula Library" onClick={onOpenFormulas || (() => {})} />
              <ToolbarButton icon={Hexagon} title="Element Library" onClick={onOpenElements || (() => {})} />
              <div className="w-px h-6 bg-white/5 mx-1" />
              <ToolbarButton 
                icon={CloudRain} 
                title="Insert Weather Intelligence" 
                onClick={() => {
                  const pageId = activeDocument?.pages[0]?.page_id;
                  if (pageId) insertDataBlock(pageId, 'weather');
                }} 
              />
              <ToolbarButton 
                icon={ShieldCheck} 
                title="Insert Inspection Findings" 
                onClick={() => {
                  const pageId = activeDocument?.pages[0]?.page_id;
                  if (pageId) insertDataBlock(pageId, 'inspection_section');
                }} 
              />
            </>
          )}
        </div>

        {/* ─── Governance & Review ─── */}
        <div className="flex items-center gap-1.5 px-3 border-r border-white/5">
          <button 
            onClick={() => createSnapshot()}
            className="p-1.5 rounded hover:bg-white/5 text-white/40 hover:text-primary transition-all"
            title="Capture Version Snapshot"
          >
            <Camera className="w-4 h-4" />
          </button>
          <button 
            onClick={() => {
              const text = window.prompt('Enter Review Comment:');
              if (text) addComment(text);
            }}
            className="p-1.5 rounded hover:bg-white/5 text-white/40 hover:text-primary transition-all"
            title="Add Review Comment"
          >
            <MessageSquare className="w-4 h-4" />
          </button>
        </div>

        {/* ─── Technical & Export ─── */}
        <div className="flex items-center gap-1.5 px-3">
          <button
            onClick={onOpenShare || (() => {})}
            className="px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20 text-[10px] font-black uppercase tracking-widest text-primary hover:bg-primary hover:text-black transition-all flex items-center gap-2"
          >
            <Share2 className="w-3 h-3" />
            Share
          </button>
          <button
            onClick={onOpenExport || (() => {})}
            className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-white hover:bg-white/10 transition-all"
          >
            Export
          </button>
        </div>
      </div>
    </div>
  );
}
