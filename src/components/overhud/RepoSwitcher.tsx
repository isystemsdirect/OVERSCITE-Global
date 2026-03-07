
'use client';
import { useOverhudStore } from '@/lib/stores/overhud-store';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { GitBranch, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

const syncStateVariant: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    clean: 'default',
    dirty: 'destructive',
    syncing: 'secondary',
    offline: 'outline',
    conflict: 'destructive'
}

export default function RepoSwitcher() {
  const { repos, activeRepoId, setActiveRepoId } = useOverhudStore();
  const activeRepo = repos.find(r => r.id === activeRepoId);

  if (!activeRepo) return null;

  return (
    <div className="space-y-2">
        <Select value={activeRepoId} onValueChange={setActiveRepoId}>
            <SelectTrigger className="font-semibold text-base h-11">
                <SelectValue placeholder="Select Repository" />
            </SelectTrigger>
            <SelectContent>
                {repos.map(repo => (
                    <SelectItem key={repo.id} value={repo.id}>{repo.name}</SelectItem>
                ))}
            </SelectContent>
        </Select>
        <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
            <div className="flex items-center gap-1">
                <GitBranch className="h-3 w-3" />
                <span>{activeRepo.branch}</span>
            </div>
            {activeRepo.readOnly && <div className="flex items-center gap-1"><Lock className="h-3 w-3" /><span>Read-only</span></div>}
            <Badge variant={syncStateVariant[activeRepo.syncState] || 'outline'} className="capitalize">{activeRepo.syncState}</Badge>
        </div>
    </div>
  );
}
