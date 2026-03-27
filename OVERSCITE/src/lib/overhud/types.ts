export interface MountedRepo {
  id: string;
  name: string;
  rootPath: string;
  sourceType: 'local' | 'remote' | 'mirror' | 'sdk_workspace' | 'archive_snapshot';
  branch?: string;
  headSha?: string;
  readOnly: boolean;
  syncState: 'clean' | 'dirty' | 'syncing' | 'offline' | 'conflict';
  trustState: 'trusted' | 'restricted' | 'unknown';
  policyProfile?: string;
  isActive: boolean;
}

export interface ExplorerNode {
  id: string;
  repoId: string;
  name: string;
  path: string;
  relativePath: string;
  nodeType: 'file' | 'directory';
  extension?: string;
  size?: number;
  modifiedAt?: string;
  isHidden?: boolean;
  isProtected?: boolean;
  isCanonical?: boolean;
  isArchived?: boolean;
  isGenerated?: boolean;
  isSensitive?: boolean;
  gitState?: 'clean' | 'modified' | 'untracked' | 'deleted' | 'renamed' | 'staged';
  hasChildren?: boolean;
  childrenLoaded?: boolean;
  tags?: string[];
}

export type ExplorerAction =
  | 'open'
  | 'create_file'
  | 'create_folder'
  | 'rename'
  | 'duplicate'
  | 'move'
  | 'soft_delete'
  | 'restore'
  | 'copy_path'
  | 'copy_relative_path'
  | 'pin'
  | 'unpin'
  | 'tag'
  | 'archive'
  | 'view_diff';
  
export interface ExplorerOverlayGroup {
  id: string;
  name: string;
  groupType: 'recent' | 'pinned' | 'task_set' | 'module_context' | 'canonical_view';
  nodeIds: string[];
  sourceContext: string;
}

export interface Mutation {
    id: string;
    action: ExplorerAction;
    targetPath: string;
    repoId: string;
    requiresArchive: boolean;
    requiresElevation: boolean;
    status: 'pending' | 'approved' | 'blocked' | 'completed' | 'failed';
}

export interface OverhudExplorerState {
  repos: MountedRepo[];
  activeRepoId?: string;
  tree: Record<string, ExplorerNode>;
  childrenMap: Record<string, string[]>;
  rootNodeIds: Record<string, string[]>;
  expandedNodePaths: string[];
  selectedNodeId?: string;
  searchQuery: string;
  showHidden: boolean;
  pinnedNodeIds: string[];
  recentNodeIds: string[];
  overlayGroups: ExplorerOverlayGroup[];
  mutationQueue: Mutation[];
  
  // Actions
  setActiveRepoId: (repoId: string) => void;
  toggleNodeExpansion: (path: string) => void;
  setSelectedNodeId: (nodeId: string | undefined) => void;
  setSearchQuery: (query: string) => void;
  toggleShowHidden: () => void;
}
