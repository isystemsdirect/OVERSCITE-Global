export type ThreadCategory = 'general' | 'incident' | 'inspection' | 'analysis' | 'governance';

export interface Thread {
  thread_id: string;
  workspace_id: string;
  title: string;
  category: ThreadCategory;
  route_context: string;
  entity_context?: string;
  created_at: Date;
  updated_at: Date;
  status: 'active' | 'archived' | 'locked';
  pinned: boolean;
  archived: boolean;
}
