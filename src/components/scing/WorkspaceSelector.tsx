'use client';

import React from 'react';
import { useShellLayout } from '@/lib/layout/shell-layout-state';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Boxes, ChevronDown, Folders, PlusCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CreateWorkspaceDialog } from './CreateWorkspaceDialog';

export function WorkspaceSelector() {
  const { activeWorkspaceId, setActiveWorkspaceId, workspaces } = useShellLayout();
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  const currentWs = workspaces.find(w => w.workspace_id === activeWorkspaceId) || workspaces[0];

  if (!currentWs) return null; // Safe fallback

  return (
    <>
      <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "h-8 px-2.5 rounded-md gap-2 border border-border/30",
            "bg-black/20 hover:bg-black/40 text-muted-foreground hover:text-foreground"
          )}
        >
          <Boxes className="h-4 w-4 text-primary" />
          <span className="text-xs font-medium max-w-[120px] truncate">
            {currentWs.name}
          </span>
          <ChevronDown className="h-3 w-3 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[240px] border-border/30 bg-background/95 backdrop-blur-md">
        <DropdownMenuLabel className="text-xs font-mono uppercase tracking-wider text-muted-foreground/70">
          Active WorkSPACE
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-border/30" />
        {workspaces.map((ws) => (
          <DropdownMenuItem
            key={ws.workspace_id}
            onClick={() => setActiveWorkspaceId(ws.workspace_id)}
            className="flex flex-col items-start px-3 py-2 cursor-pointer focus:bg-primary/10"
          >
            <div className="flex items-center gap-2 w-full">
              <Folders className="h-4 w-4 shrink-0 opacity-70" />
              <span className="text-sm font-medium leading-none">{ws.name}</span>
            </div>
            {activeWorkspaceId === ws.workspace_id && (
              <span className="text-[10px] text-primary/70 mt-1 uppercase font-mono tracking-widest pl-6">
                Current
              </span>
            )}
          </DropdownMenuItem>
        ))}
        
        <DropdownMenuSeparator className="bg-border/30" />
        <DropdownMenuItem
          onClick={() => setIsDialogOpen(true)}
          className="flex items-center gap-2 px-3 py-2 cursor-pointer text-primary focus:bg-primary/10"
        >
          <PlusCircle className="h-4 w-4 shrink-0" />
          <span className="text-sm font-medium">Create New WorkSPACE...</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>

    <CreateWorkspaceDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
  </>
  );
}
