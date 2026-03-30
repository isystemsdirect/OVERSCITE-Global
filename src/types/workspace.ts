export type WorkspaceStatus = 'active' | 'archived' | 'suspended';
export type WorkspaceContextType = 'GLOBAL' | 'CLIENT' | 'PROPERTY' | 'PROJECT' | 'INSPECTION' | 'INCIDENT';

export interface WorkSPACE {
  workspace_id: string;
  name: string;
  description: string;
  context_type: WorkspaceContextType;
  context_id?: string;
  created_at: Date;
  updated_at: Date;
  owner: string; // User ID
  linked_entities: string[]; // e.g. Inspection IDs, Property IDs
  status: WorkspaceStatus;
}
