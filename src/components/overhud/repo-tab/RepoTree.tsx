'use client';

import React, { useState, useEffect } from 'react';
import { RepoNode } from '@/lib/types/repository';
import { RepoNodeItem } from './RepoNodeItem';

interface RepoTreeProps {
  nodes: RepoNode[];
  onNodeSelect: (node: RepoNode) => void;
}

export function RepoTree({ nodes, onNodeSelect }: RepoTreeProps) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    // Optionally pre-expand the high-priority protected roots
    const initialExpansion = new Set<string>();
    nodes.forEach(n => {
      if (['System', 'Audit', 'Evidence'].includes(n.canonical_class as string)) {
        initialExpansion.add(n.id);
      }
    });
    setExpandedIds(initialExpansion);
  }, [nodes]);

  const handleToggle = (id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleSelect = (node: RepoNode) => {
    setSelectedId(node.id);
    onNodeSelect(node);
  };

  return (
    <div className="flex flex-col h-full w-full overflow-y-auto overflow-x-hidden p-1 space-y-[1px]">
      {nodes.map(node => (
        <RepoNodeItem
          key={node.id}
          node={node}
          depth={0}
          expandedIds={expandedIds}
          selectedId={selectedId}
          onToggle={handleToggle}
          onSelect={handleSelect}
        />
      ))}
    </div>
  );
}
