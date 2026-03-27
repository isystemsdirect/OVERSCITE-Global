import { 
  collection, 
  addDoc, 
  query, 
  where,
  orderBy, 
  limit, 
  onSnapshot,
  serverTimestamp,
  doc,
  updateDoc,
  Timestamp,
  getCountFromServer,
  Firestore
} from 'firebase/firestore';
import { getDb } from './firebase';

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


  async createSession(userId: string, context: any = {}): Promise<string> {
    if (!this.sessionsCollection) throw new Error("Firestore not available");
    const session = await addDoc(this.sessionsCollection, {
      userId,
      startTime: serverTimestamp(),
      messageCount: 0,
      context,
      createdAt: serverTimestamp()
    });
    
    return session.id;
  }

  async addMessage(
    sessionId: string, 
    userId: string, 
    type: 'user' | 'assistant' | 'system',
    content: string,
    metadata: any = {}
  ): Promise<string> {
    if (!this.conversationsCollection || !this.sessionsCollection) throw new Error("Firestore not available");

    const message = await addDoc(this.conversationsCollection, {
      sessionId,
      userId,
      type,
      content,
      timestamp: serverTimestamp(),
      metadata,
      createdAt: serverTimestamp()
    });

    // Update session message count
    const sessionRef = doc(this.sessionsCollection, sessionId);
    // Note: getCountFromServer counts the whole collection if query is not specific. 
    // Optimization: Just increment the count or use a transaction. 
    // For now, assuming accurate count is needed but query needs to be scoped to session if we want session message count.
    // However, the original code counted *all* conversations, which seems like a bug or global counter.
    // Assuming we want count of messages IN THIS SESSION.
    const q = query(this.conversationsCollection, where("sessionId", "==", sessionId));
    const snapshot = await getCountFromServer(q);
    
    await updateDoc(sessionRef, {
      messageCount: snapshot.data().count,
      lastActivity: serverTimestamp()
    });

    return message.id;
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
    if (!this.sessionsCollection) return;
    const sessionRef = doc(this.sessionsCollection, sessionId);
    await updateDoc(sessionRef, {
      endTime: serverTimestamp(),
    });
  }
}

export const conversationStore = new ConversationStore();
