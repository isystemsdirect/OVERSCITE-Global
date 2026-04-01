'use client';

import React, { useState, useEffect } from 'react';
import { RepoNode } from '@/lib/types/repository';
import { RepoIconBuilder } from './RepoIconBuilder';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TruthStateBadge } from '@/components/layout/TruthStateBadge';

interface RepoNodeItemProps {
  node: RepoNode;
  depth: number;
  expandedIds: Set<string>;
  selectedId: string | null;
  onToggle: (id: string) => void;
  onSelect: (node: RepoNode) => void;
}

export function RepoNodeItem({
  node,
  depth,
  expandedIds,
  selectedId,
  onToggle,
  onSelect,
}: RepoNodeItemProps) {
  const isExpanded = expandedIds.has(node.id);
  const isSelected = selectedId === node.id;
  const hasChildren = node.children && node.children.length > 0;
  
  const paddingLeft = depth * 16; 

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggle(node.id);
  };

  const generateBranchLines = () => {
    const lines = [];
    for (let i = 0; i < depth; i++) {
      lines.push(
        <div 
          key={i} 
          className="absolute top-0 bottom-0 border-l border-white/5 pointer-events-none"
          style={{ left: `${(i * 16) + 12}px` }}
        />
      );
    }
    // Specific horizontal tie-in line
    if (depth > 0) {
      lines.push(
        <div 
          key="h-connector"
          className="absolute border-t border-white/5 w-3 pointer-events-none"
          style={{ left: `${(depth - 1) * 16 + 12}px`, top: '50%' }}
        />
      );
    }
    return lines;
  };

  const isProtectedRoot = node.node_kind === 'root' && 
    (node.canonical_class === 'System' || node.canonical_class === 'Audit' || node.canonical_class === 'Evidence');

  return (
    <div className="flex flex-col">
      <div 
        role="button"
        onClick={() => onSelect(node)}
        className={cn(
          "relative flex items-center h-[34px] select-none transition-colors group",
          "hover:bg-white/5",
          isSelected ? "bg-primary/10 shadow-sm" : ""
        )}
      >
        {generateBranchLines()}
        
        {/* Fill left padding gap to push content securely past lines */}
        <div style={{ width: `${paddingLeft + 8}px` }} className="shrink-0 h-full inline-block" />

        <div className="flex items-center flex-1 h-full min-w-0 pr-2">
          {hasChildren ? (
            <div 
              role="button"
              onClick={handleToggle}
              className={cn(
                "w-4 h-4 flex items-center justify-center mr-1.5 shrink-0 rounded-sm hover:bg-white/10 transition-colors z-10",
                isExpanded ? "text-foreground" : "text-muted-foreground"
              )}
            >
              {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </div>
          ) : (
             <div className="w-5.5 shrink-0" />
          )}

          <div className="mr-2.5 shrink-0 z-10">
            <RepoIconBuilder 
              canonicalClass={node.canonical_class as string} 
              kind={node.node_kind} 
              isOpen={isExpanded} 
              size={15} 
            />
          </div>

          <span className={cn(
            "text-[12px] font-mono truncate z-10 tracking-tight",
            isSelected ? "text-primary font-semibold" : (isProtectedRoot ? "text-foreground/90 font-medium" : "text-foreground/70")
          )}>
            {node.label}
          </span>
          
          <div className="flex-1" />

          {/* Compact Metadata Tags */}
          {node.mutation_class !== 'user_flex' && node.node_kind === 'root' && (
             <div className="opacity-0 group-hover:opacity-100 transition-opacity ml-2 shrink-0 z-10">
               <TruthStateBadge state={node.trust_state} showIcon={false} className="h-4 px-1.5 text-[9px] border-none bg-black/40" />
             </div>
          )}
        </div>
      </div>

      {isExpanded && hasChildren && (
        <div className="flex flex-col">
           {node.children!.map((child) => (
             <RepoNodeItem 
               key={child.id}
               node={child}
               depth={depth + 1}
               expandedIds={expandedIds}
               selectedId={selectedId}
               onToggle={onToggle}
               onSelect={onSelect}
             />
           ))}
        </div>
      )}
    </div>
  );
}
