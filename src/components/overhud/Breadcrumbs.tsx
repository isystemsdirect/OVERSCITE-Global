
'use client';
import { useOverhudStore } from '@/lib/stores/overhud-store';
import { ChevronRight } from 'lucide-react';

export default function Breadcrumbs() {
  const { selectedNodeId, tree } = useOverhudStore();
  const selectedNode = selectedNodeId ? tree[selectedNodeId] : null;

  if (!selectedNode) {
    return <div className="h-5 text-xs text-muted-foreground italic">No file selected</div>;
  }

  const pathParts = selectedNode.path.split('/').filter(p => p);

  return (
    <div className="flex items-center gap-1 text-xs text-muted-foreground overflow-x-auto whitespace-nowrap custom-scrollbar pb-1">
      <span>/</span>
      {pathParts.map((part, index) => (
        <div key={index} className="flex items-center gap-1">
          <span className="hover:text-foreground cursor-pointer">{part}</span>
          {index < pathParts.length - 1 && <ChevronRight className="h-3 w-3" />}
        </div>
      ))}
    </div>
  );
}
