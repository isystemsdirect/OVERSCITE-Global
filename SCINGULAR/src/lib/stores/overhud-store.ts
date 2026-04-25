import { create } from 'zustand';
import { OverhudExplorerState } from '../overhud/types';
import { mockRepos, mockFileTree, processTreeForStore } from '../overhud/mock-data';

const { tree, childrenMap, rootNodeIds } = processTreeForStore(mockFileTree, 'repo-overscite');

export const useOverhudStore = create<OverhudExplorerState>((set) => ({
  // State
  repos: mockRepos,
  activeRepoId: mockRepos.find(r => r.isActive)?.id,
  tree,
  childrenMap,
  rootNodeIds: { 'repo-overscite': rootNodeIds },
  expandedNodePaths: ['/src', '/src/app'],
  selectedNodeId: undefined,
  searchQuery: '',
  showHidden: false,
  pinnedNodeIds: [],
  recentNodeIds: [],
  overlayGroups: [],
  mutationQueue: [],

  // Actions
  setActiveRepoId: (repoId) => set({ activeRepoId: repoId, selectedNodeId: undefined }), // Reset selection on repo change
  
  toggleNodeExpansion: (path) => set((state) => ({
    expandedNodePaths: state.expandedNodePaths.includes(path)
      ? state.expandedNodePaths.filter((p) => p !== path)
      : [...state.expandedNodePaths, path],
  })),
  
  setSelectedNodeId: (nodeId) => set({ selectedNodeId: nodeId }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  toggleShowHidden: () => set((state) => ({ showHidden: !state.showHidden })),
}));
