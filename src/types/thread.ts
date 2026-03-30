export type ThreadCategory =
  | 'Operational'
  | 'Inspection'
  | 'Client'
  | 'Report'
  | 'Standards'
  | 'Safety'
  | 'Device'
  | 'Drone'
  | 'Contractor'
  | 'Marketplace'
  | 'Strategy'
  | 'Archive';

export type ThreadStatus = 'active' | 'archived' | 'resolved';

export interface Thread {
  thread_id: string;
  title: string;
  workspace_id: string;
  category: ThreadCategory;
  route_context: string;
  entity_context?: string;
  created_at: Date;
  updated_at: Date;
  status: ThreadStatus;
  pinned: boolean;
  archived: boolean;
}
