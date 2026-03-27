'use client';

import React, { useMemo } from 'react';
import { useOverhudStore } from '@/lib/stores/overhud-store';
import { ExplorerNode } from '@/lib/overhud/types';
import { File, Folder, ChevronRight, FolderOpen, Lock, Shield, Archive, Bot, BrainCircuit } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

const TreeNode = ({ nodeId, level }: { nodeId: string, level: number }) => {
    const { 
        tree, 
        childrenMap, 
        expandedNodePaths, 
        toggleNodeExpansion, 
        selectedNodeId, 
        setSelectedNodeId,
        showHidden,
        searchQuery
    } = useOverhudStore();
    
    const node = tree[nodeId];

    if (!node || (node.isHidden && !showHidden)) {
        return null;
    }

    const isExpanded = expandedNodePaths.includes(node.path);
    const isSelected = selectedNodeId === node.id;
    const childIds = childrenMap[node.id] || [];
    
    const handleToggle = (e: React.MouseEvent) => {
        e.stopPropagation();
        toggleNodeExpansion(node.path);
    };

    const handleSelect = () => {
        setSelectedNodeId(node.id);
    }
    
    // Filter visibility based on search
    const isVisible = searchQuery.length === 0 || node.name.toLowerCase().includes(searchQuery.toLowerCase());
    if (!isVisible) return null;

    const Icon = node.nodeType === 'directory' 
        ? (isExpanded ? FolderOpen : Folder)
        : File;

    const iconColor = node.nodeType === 'directory' ? "text-primary" : "text-muted-foreground";

    return (
        <div>
            <div
                onClick={handleSelect}
                className={cn(
                    "flex items-center p-1 rounded-md cursor-pointer hover:bg-accent/80 text-foreground",
                    isSelected && "bg-accent"
                )}
                style={{ paddingLeft: `${level * 16}px` }}
            >
                {node.hasChildren ? (
                    <ChevronRight
                        className={cn("h-4 w-4 mr-1 transition-transform shrink-0", isExpanded && "rotate-90")}
                        onClick={handleToggle}
                        style={{ marginLeft: level === 0 ? '-4px' : '0' }}
                    />
                ) : (
                    <div className="w-4 h-4 mr-1 shrink-0"></div>
                )}
                <Icon className={cn("h-4 w-4 mr-2 shrink-0", iconColor)} />
                <span className="truncate flex-1">{node.name}</span>
                <div className="flex items-center gap-1.5 ml-auto pr-1">
                    {node.isCanonical && <Shield size={12} className="text-green-500" title="Canonical" />}
                    {node.isProtected && <Lock size={12} className="text-red-500" title="Protected" />}
                    {node.isArchived && <Archive size={12} className="text-yellow-500" title="Archived" />}
                    {node.isGenerated && <Bot size={12} className="text-purple-500" title="AI Generated" />}
                    {node.isSensitive && <BrainCircuit size={12} className="text-orange-500" title="Sensitive" />}
                </div>
            </div>
            {isExpanded && childIds.map(childId => (
                <TreeNode key={childId} nodeId={childId} level={level + 1} />
            ))}
        </div>
    );
};


export default function FileTree() {
  const { rootNodeIds, activeRepoId } = useOverhudStore();
  const activeRootIds = rootNodeIds[activeRepoId || ''] || [];

  if (!activeRepoId) return <div className="text-muted-foreground text-center p-4 text-xs">Select a repository to begin.</div>;

  return (
    <ScrollArea className="h-full">
        <div className="space-y-0.5 pr-2">
            {activeRootIds.map(nodeId => <TreeNode key={nodeId} nodeId={nodeId} level={0} />)}
        </div>
    </ScrollArea>
  );
}
