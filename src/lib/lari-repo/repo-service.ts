import { RepoNode, CanonicalRoot, CANONICAL_ROOT_ORDER } from '../types/repository';

export class RepoService {
  private tree: RepoNode[] = [];

  constructor() {
    this.tree = this.buildCanonicalRoots();
  }

  private buildCanonicalRoots(): RepoNode[] {
    const policies: Record<string, any> = {
      System: { mutation_class: 'protected', trust_state: 'live', visibility_policy: 'bane_shield' },
      Audit: { mutation_class: 'append_only', trust_state: 'live', visibility_policy: 'bane_shield' },
      Evidence: { mutation_class: 'protected', trust_state: 'live', visibility_policy: 'bane_shield' },
      CaptureSessions: { mutation_class: 'structured', trust_state: 'live', visibility_policy: 'bane_shield' },
      Sensors: { mutation_class: 'structured', trust_state: 'live', visibility_policy: 'bane_shield' },
      Devices: { mutation_class: 'structured', trust_state: 'live', visibility_policy: 'bane_shield' },
      Analysis: { mutation_class: 'structured', trust_state: 'live', visibility_policy: 'public' },
      Reports: { mutation_class: 'structured', trust_state: 'live', visibility_policy: 'public' },
      Sync: { mutation_class: 'ephemeral', trust_state: 'live', visibility_policy: 'bane_shield' },
      Exports: { mutation_class: 'structured', trust_state: 'live', visibility_policy: 'public' },
      Archives: { mutation_class: 'append_only', trust_state: 'live', visibility_policy: 'public' },
      Recovery: { mutation_class: 'protected', trust_state: 'live', visibility_policy: 'bane_shield' },
      Temp: { mutation_class: 'ephemeral', trust_state: 'live', visibility_policy: 'public' },
      UserSpace: { mutation_class: 'user_flex', trust_state: 'live', visibility_policy: 'public' },
    };

    return CANONICAL_ROOT_ORDER.map((root) => {
      const p = policies[root];
      return {
        id: `root-${root.toLowerCase()}`,
        label: root,
        canonical_class: root,
        node_kind: 'root',
        trust_state: p.trust_state,
        visibility_policy: p.visibility_policy,
        mutation_class: p.mutation_class,
        children: this.buildMockChildren(root)
      };
    });
  }

  private buildMockChildren(root: CanonicalRoot): RepoNode[] | undefined {
    // Generate some mock children for verification without losing the semantic structure
    const tsTimestamp = new Date().toISOString();
    if (root === CanonicalRoot.Evidence) {
      return [
        {
          id: 'ev-img',
          label: 'Images',
          canonical_class: 'Evidence.Images',
          node_kind: 'folder',
          trust_state: 'live',
          visibility_policy: 'bane_shield',
          mutation_class: 'protected',
          children: [
            {
              id: 'ev-img-001',
              label: 'capture-001.jpg',
              canonical_class: 'Evidence.Images',
              node_kind: 'file',
              trust_state: 'live',
              visibility_policy: 'bane_shield',
              mutation_class: 'protected',
              timestamp: tsTimestamp
            }
          ]
        },
        { id: 'ev-thm', label: 'Thermal', canonical_class: 'Evidence.Thermal', node_kind: 'folder', trust_state: 'live', visibility_policy: 'bane_shield', mutation_class: 'protected' },
        { id: 'ev-lid', label: 'LiDAR', canonical_class: 'Evidence.LiDAR', node_kind: 'folder', trust_state: 'live', visibility_policy: 'bane_shield', mutation_class: 'protected' }
      ];
    }
    
    if (root === CanonicalRoot.Audit) {
      return [
        { id: 'aud-acc', label: 'Access Logs', canonical_class: 'Audit.Access', node_kind: 'file', trust_state: 'live', visibility_policy: 'bane_shield', mutation_class: 'append_only' },
        { id: 'aud-inv', label: 'Invocation Records', canonical_class: 'Audit.Invocation', node_kind: 'file', trust_state: 'live', visibility_policy: 'bane_shield', mutation_class: 'append_only' }
      ];
    }
    
    return []; // other roots empty initially
  }

  async getTree(): Promise<RepoNode[]> {
    return this.tree;
  }

  // --- LEGACY ADAPTERS FOR LARI-REPO COMPILE INTEGRITY ---
  // Transforms the Canonical node into the deprecated flat RepoFile interface for older overlays.
  
  private findNodeBFS(id: string, nodes: RepoNode[]): RepoNode | undefined {
    for (const n of nodes) {
      if (n.id === id) return n;
      if (n.children) {
        const found = this.findNodeBFS(id, n.children);
        if (found) return found;
      }
    }
    return undefined;
  }

  public async getFile(id: string): Promise<any | undefined> {
    const node = this.findNodeBFS(id, this.tree);
    if (!node) return undefined;
    
    // Simulate legacy RepoFile cast
    return {
      id: node.id,
      name: node.label,
      type: 'image',
      jobId: 'legacy-adapter-job',
      clientId: 'legacy',
      createdAt: node.timestamp || new Date().toISOString(),
      createdBy: node.created_by || 'system',
      reviewStatus: 'pending',
      ingestionEligibility: 'not_eligible',
      version: '1.0',
      currentVersionNumber: 1,
      metadata: {}
    };
  }

  public async fileArtifact(file: any): Promise<void> {
    // Adapter: do nothing, simply preventing TS crash in legacy systems.
    // Real mutations must occur through BANE and OCIT.
  }
}

export const repoService = new RepoService();
