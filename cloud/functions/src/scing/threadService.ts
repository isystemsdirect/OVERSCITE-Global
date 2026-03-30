import * as admin from 'firebase-admin';
import { Thread, ThreadCategory } from '../types/thread';
import { ScingMessageAppend, ScingMessage } from './types'; // Legacy compat

const db = () => admin.firestore();
const THREADS_COL = 'scingThreads'; // Replaces scingSessions
const MESSAGES_SUB = 'messages';

export async function createThread(
  workspaceId: string,
  title: string,
  category: ThreadCategory,
  routeContext: string,
  entityContext?: string
): Promise<string> {
  const ref = db().collection(THREADS_COL).doc();
  const thread: Omit<Thread, 'thread_id'> = {
    title,
    workspace_id: workspaceId,
    category,
    route_context: routeContext,
    entity_context: entityContext,
    created_at: new Date(),
    updated_at: new Date(),
    status: 'active',
    pinned: false,
    archived: false
  };
  await ref.set(thread);
  return ref.id;
}

export async function listThreadsForWorkspace(
  workspaceId: string,
  limitCount = 50
): Promise<Thread[]> {
  const snap = await db()
    .collection(THREADS_COL)
    .where('workspace_id', '==', workspaceId)
    .orderBy('updated_at', 'desc')
    .limit(limitCount)
    .get();

  return snap.docs.map(doc => ({ thread_id: doc.id, ...doc.data() } as unknown as Thread));
}

export async function getThread(threadId: string): Promise<Thread> {
  const snap = await db().collection(THREADS_COL).doc(threadId).get();
  if (!snap.exists) {
    throw new Error(`Thread ${threadId} not found.`);
  }
  return { thread_id: snap.id, ...snap.data() } as unknown as Thread;
}

export async function appendMessageToThread(
  threadId: string,
  params: ScingMessageAppend
): Promise<string> {
  const ref = db().collection(THREADS_COL).doc(threadId).collection(MESSAGES_SUB).doc();
  await ref.set({
    ...params,
    timestamp: admin.firestore.FieldValue.serverTimestamp(),
  });
  
  await db().collection(THREADS_COL).doc(threadId).update({
    updated_at: admin.firestore.FieldValue.serverTimestamp()
  });

  return ref.id;
}

export async function getThreadHistory(threadId: string, limitCount = 50): Promise<ScingMessage[]> {
  const snap = await db()
    .collection(THREADS_COL)
    .doc(threadId)
    .collection(MESSAGES_SUB)
    .orderBy('timestamp', 'asc')
    .limit(limitCount)
    .get();

  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as unknown as ScingMessage));
}
