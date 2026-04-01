import { 
  collection, 
  query, 
  where,
  orderBy, 
  limit, 
  onSnapshot,
  Timestamp,
  Firestore,
  doc,
  updateDoc,
  serverTimestamp
} from 'firebase/firestore';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { getDb, getApp } from './firebase';

let clientSequence = Date.now(); // Simple monotonic sequence for Beta

function getNextSequence() {
  return ++clientSequence;
}

function getBaneMetadata() {
  return {
    _bane_nonce: Math.random().toString(36).substring(2),
    _bane_seq: getNextSequence()
  };
}

export interface ConversationMessage {
  id: string;
  sessionId: string;
  userId: string;
  type: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Timestamp;
  audioTranscript?: string;
  confidence?: number;
  metadata?: {
    wakeWordDetected?: boolean;
    speechRecognitionConfidence?: number;
    responseTime?: number;
    model?: string;
  };
}

export interface ConversationSession {
  id: string;
  userId: string;
  startTime: Timestamp;
  endTime?: Timestamp;
  messageCount: number;
  totalDuration?: number;
  context: {
    userProfile?: any;
    preferences?: any;
    scingularIntegration?: any;
  };
}

class ConversationStore {
  private get db() {
    const dbInstance = getDb();
    if (!dbInstance) {
        // This can happen on the server. Return a mock or handle appropriately.
        // For now, we'll throw an error if used incorrectly.
        if (typeof window !== 'undefined') {
            throw new Error("Firestore is not initialized. Check Firebase config.");
        }
    }
    return dbInstance;
  }

  private get conversationsCollection() {
    if (!this.db) return null;
    return collection(this.db, 'conversations');
  }

  private get sessionsCollection() {
    if (!this.db) return null;
    return collection(this.db, 'conversationSessions');
  }


  private get functions() {
    const app = getApp();
    if (!app) throw new Error("Firebase app not initialized");
    return getFunctions(app);
  }

  async createSession(userId: string, context: any = {}): Promise<string> {
    const fn = httpsCallable(this.functions, 'scing-createConversationSession');
    const result = await fn({
      userId,
      context,
      ...getBaneMetadata()
    });
    
    const data = result.data as { ok: boolean; id: string };
    if (!data.ok) throw new Error("Failed to create conversation session");
    return data.id;
  }

  async addMessage(
    sessionId: string, 
    userId: string, 
    type: 'user' | 'assistant' | 'system',
    content: string,
    metadata: any = {}
  ): Promise<string> {
    const fn = httpsCallable(this.functions, 'scing-recordConversationMessage');
    const result = await fn({
      sessionId,
      userId,
      type,
      content,
      metadata,
      ...getBaneMetadata()
    });

    const data = result.data as { ok: boolean; id: string };
    if (!data.ok) throw new Error("Failed to record conversation message");
    return data.id;
  }

  subscribeToSession(
    sessionId: string, 
    callback: (messages: ConversationMessage[]) => void
  ): () => void {
    if (!this.conversationsCollection) return () => {};
    
    // Corrected query: Filter by sessionId on the server side
    const q = query(
      this.conversationsCollection,
      where('sessionId', '==', sessionId),
      orderBy('timestamp', 'asc'),
      limit(50)
    );

    return onSnapshot(q, (snapshot) => {
      const messages: ConversationMessage[] = [];
      
      snapshot.forEach((doc) => {
        const data = doc.data();
        // ID is already on doc, spread data correctly
        messages.push({
          id: doc.id,
          ...data
        } as ConversationMessage);
      });

      callback(messages);
    });
  }

  async endSession(sessionId: string): Promise<void> {
    const fn = httpsCallable(this.functions, 'scing-endConversationSession');
    await fn({
      sessionId,
      ...getBaneMetadata()
    });
  }
}

export const conversationStore = new ConversationStore();
