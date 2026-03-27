'use client';

import { 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged,
    type User 
} from 'firebase/auth';
import { getFirebaseAuth } from '../firebase';
import { create } from 'zustand';

interface AuthState {
    user: User | null;
    loading: boolean;
    error: string | null;
    setUser: (user: User | null) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    loading: true,
    error: null,
    setUser: (user) => set({ user, loading: false }),
    setLoading: (loading) => set({ loading }),
    setError: (error) => set({ error }),
}));

export const initAuthListener = () => {
    // Set a timeout to force loading to false if Firebase hangs
    const timeoutId = setTimeout(() => {
        if (useAuthStore.getState().loading) {
            console.warn("Auth listener timed out. Forcing UI load.");
            useAuthStore.getState().setLoading(false);
        }
    }, 3000); // 3 second max wait time

    try {
        const auth = getFirebaseAuth();
        if (!auth) {
            useAuthStore.getState().setLoading(false);
            clearTimeout(timeoutId);
            return () => {};
        }

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            useAuthStore.getState().setUser(user);
            clearTimeout(timeoutId);
        }, (error) => {
            console.error("Auth state change error:", error);
            useAuthStore.getState().setError(error.message);
            useAuthStore.getState().setLoading(false);
            clearTimeout(timeoutId);
        });

        return () => {
            unsubscribe();
            clearTimeout(timeoutId);
        };
    } catch (e) {
        console.error("Auth initialization exception:", e);
        useAuthStore.getState().setLoading(false);
        clearTimeout(timeoutId);
        return () => {};
    }
};

export const logout = async () => {
    const auth = getFirebaseAuth();
    if (auth) {
        await signOut(auth);
    }
};
