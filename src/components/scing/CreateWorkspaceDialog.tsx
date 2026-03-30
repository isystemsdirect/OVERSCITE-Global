'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useShellLayout } from '@/lib/layout/shell-layout-state';
import { WorkSPACE, WorkspaceContextType } from '@/types/workspace';

interface CreateWorkspaceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateWorkspaceDialog({ open, onOpenChange }: CreateWorkspaceDialogProps) {
  const { addWorkspace, setActiveWorkspaceId } = useShellLayout();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [contextType, setContextType] = useState<WorkspaceContextType>('GLOBAL');
  const [contextId, setContextId] = useState('');

  const handleCreate = () => {
    if (!name.trim()) return;

    const newWs: WorkSPACE = {
      workspace_id: 'ws_' + Date.now().toString(36),
      name,
      description,
      context_type: contextType,
      context_id: contextType !== 'GLOBAL' ? contextId : undefined,
      created_at: new Date(),
      updated_at: new Date(),
      owner: 'system', // Mock User
      linked_entities: contextType !== 'GLOBAL' && contextId ? [contextId] : [],
      status: 'active',
    };

    addWorkspace(newWs);
    setActiveWorkspaceId(newWs.workspace_id);
    onOpenChange(false);

    // Reset Form
    setName('');
    setDescription('');
    setContextType('GLOBAL');
    setContextId('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] border-border/30 bg-background/95 backdrop-blur-md">
        <DialogHeader>
          <DialogTitle className="text-primary tracking-widest uppercase font-mono text-sm">Create New WorkSPACE</DialogTitle>
          <DialogDescription>
            Establish a governed operational boundary for new tasks.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">WorkSPACE Name</Label>
            <Input
              id="name"
              placeholder="e.g. Audit OS-G_12"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-black/20 border-border/20 focus-visible:ring-primary/50"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Input
              id="description"
              placeholder="Primary objective..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-black/20 border-border/20 focus-visible:ring-primary/50"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="contextType">Boundary Alignment (Context)</Label>
            <Select
              value={contextType}
              onValueChange={(val) => setContextType(val as WorkspaceContextType)}
            >
              <SelectTrigger id="contextType" className="bg-black/20 border-border/20">
                <SelectValue placeholder="Select context constraint..." />
              </SelectTrigger>
              <SelectContent className="bg-background/95 backdrop-blur-md border-border/30">
                <SelectItem value="GLOBAL">Global Architecture</SelectItem>
                <SelectItem value="CLIENT">Client Bounded</SelectItem>
                <SelectItem value="PROPERTY">Property Bounded</SelectItem>
                <SelectItem value="PROJECT">Project Bounded</SelectItem>
                <SelectItem value="INSPECTION">Inspection Scope</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {contextType !== 'GLOBAL' && (
            <div className="grid gap-2 animate-in fade-in slide-in-from-top-2">
              <Label htmlFor="contextId">Target {contextType.charAt(0) + contextType.slice(1).toLowerCase()} ID</Label>
              <Input
                id="contextId"
                placeholder={`Enter ${contextType.toLowerCase()} identifier...`}
                value={contextId}
                onChange={(e) => setContextId(e.target.value)}
                className="bg-black/20 border-border/20 focus-visible:ring-primary/50 text-cyan-400 font-mono text-xs"
              />
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="border-border/30 hover:bg-white/5">
            Cancel
          </Button>
          <Button onClick={handleCreate} disabled={!name} className="bg-primary/20 text-primary border border-primary/30 hover:bg-primary/30">
            Provision WorkSPACE
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
