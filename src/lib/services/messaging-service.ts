import { MessagingThread, Message } from '../types';

// Seed initial threads for truthfulness
const SEED_THREADS: MessagingThread[] = [
  {
    id: 'th-001',
    title: 'Site Inspection: 123 Industrial Way',
    last_message_preview: 'The roof drainage looks clear in the latest drone sweep.',
    last_activity_at: new Date('2023-11-20T10:30:00').toISOString(),
    participants: ['system', 'Director Anderson'],
    status: 'active',
    unread_count: 2,
  },
  {
    id: 'th-002',
    title: 'Governance Batch: Q4 tightened',
    last_message_preview: 'Audit trail for the latest library upload is verified.',
    last_activity_at: new Date('2023-11-19T14:45:00').toISOString(),
    participants: ['Scing', 'system'],
    status: 'pinned',
    unread_count: 0,
  },
  {
    id: 'th-003',
    title: 'Equipment Maintenance Coordination',
    last_message_preview: 'Drone Fleet 7 scheduled for recalibration tomorrow.',
    last_activity_at: new Date('2023-11-18T09:00:00').toISOString(),
    participants: ['Tech Lead', 'system'],
    status: 'archived',
    unread_count: 0,
  }
];

export async function getMessagingThreads(): Promise<MessagingThread[]> {
  // Simulate fetch
  return [...SEED_THREADS];
}

export async function getMessagesForThread(threadId: string): Promise<Message[]> {
  // Return dummy messages for the thread
  return [
    {
      id: 'msg-1',
      thread_id: threadId,
      sender_id: 'system',
      sender_name: 'SCINGULAR System',
      content: `Initial thread generated for reference ${threadId}. Communication is bounded to operational context.`,
      sent_at: new Date('2023-11-18T08:00:00').toISOString(),
    }
  ];
}
