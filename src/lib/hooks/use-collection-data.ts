import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, QueryConstraint, Firestore } from 'firebase/firestore';
import { getDb } from '@/lib/firebase';

export function useCollectionData<T = any>(collectionPath: string, queryConstraints: QueryConstraint[] = []) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const db = getDb();
    if (!db) {
      setError(new Error('Firebase not initialized'));
      setLoading(false);
      return;
    }

    const colRef = collection(db as Firestore, collectionPath);
    const q = queryConstraints.length > 0 ? query(colRef, ...queryConstraints) : colRef;

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const results: T[] = [];
      snapshot.forEach((doc) => {
        results.push({ id: doc.id, ...doc.data() } as unknown as T);
      });
      setData(results);
      setLoading(false);
    }, (err) => {
      console.error(`Error fetching collection ${collectionPath}:`, err);
      setError(err as Error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [collectionPath, JSON.stringify(queryConstraints)]);

  return { data, loading, error };
}
