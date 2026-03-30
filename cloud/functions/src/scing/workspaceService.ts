import * as admin from 'firebase-admin';
import { WorkSPACE, WorkspaceStatus } from '../types/workspace';

const db = () => admin.firestore();
const WORKSPACES_COL = 'workspaces';

export async function createWorkspace(
  ownerId: string,
  name: string,
  description: string,
  linkedEntities: string[] = []
): Promise<string> {
  const ref = db().collection(WORKSPACES_COL).doc();
  const workspace: Omit<WorkSPACE, 'workspace_id'> = {
    name,
    description,
    owner: ownerId,
    linked_entities: linkedEntities,
    context_type: 'PROJECT',
    status: 'active',
    created_at: new Date(),
    updated_at: new Date()
  };
  await ref.set(workspace);
  return ref.id;
}

export async function getWorkspace(workspaceId: string, userId: string): Promise<WorkSPACE> {
  const snap = await db().collection(WORKSPACES_COL).doc(workspaceId).get();
  if (!snap.exists) {
    throw new Error(`Workspace ${workspaceId} not found.`);
  }
  const data = snap.data() as any;
  if (data.owner !== userId) {
    throw new Error('Workspace ownership/access validation failed. Governance Blocked.');
  }
  return { workspace_id: snap.id, ...data };
}

export async function listWorkspaces(userId: string): Promise<WorkSPACE[]> {
  const snap = await db()
    .collection(WORKSPACES_COL)
    .where('owner', '==', userId)
    .where('status', '==', 'active')
    .orderBy('updated_at', 'desc')
    .get();

  return snap.docs.map(doc => ({ workspace_id: doc.id, ...doc.data() } as any));
}

export async function setWorkspaceStatus(workspaceId: string, status: WorkspaceStatus): Promise<void> {
  await db().collection(WORKSPACES_COL).doc(workspaceId).update({
    status,
    updated_at: admin.firestore.FieldValue.serverTimestamp()
  });
}
