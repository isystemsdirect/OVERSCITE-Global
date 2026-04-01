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
import { AUTH_MODE } from '@/config/auth';
import { normalizeUser, getDevUser } from './getCurrentUser';

interface AuthState {
    user: any | null; // Unified user structure
    loading: boolean;
    error: string | null;
    setUser: (user: any | null) => void;
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
    // Set a timeout to force loading to false if Firebase hangs or is unavailable
    // Reduced to 2s to improve user experience on cold boots/emulator delays.
    const timeoutId = setTimeout(() => {
        const currentState = useAuthStore.getState();
        if (currentState.loading) {
            console.warn("[AUTH] Initial baseline wait reached. Forcing UI state to READY (bypass).");
            useAuthStore.getState().setLoading(false);
        }
    }, 2000); 

    try {
        if (typeof window === 'undefined') {
            return () => {}; // No-op on server
        }

        // --- GENERIC MODE HANDLER ---
        if (AUTH_MODE === "GENERIC") {
            console.log("[AUTH] Initialized in GENERIC mode.");
            const devUser = getDevUser();
            if (devUser) {
                console.log("[AUTH] Resolution acquired (GENERIC):", devUser.id);
                useAuthStore.getState().setUser(normalizeUser(devUser));
            } else {
                console.log("[AUTH] No active dev session found.");
                useAuthStore.getState().setLoading(false);
            }
            clearTimeout(timeoutId);
            return () => {};
        }

        // --- ARC MODE HANDLER ---
        const auth = getFirebaseAuth();
        if (!auth) {
            console.warn("[AUTH] Firebase Auth engine not detected. Falling back to GUEST.");
            useAuthStore.getState().setLoading(false);
            clearTimeout(timeoutId);
            return () => {};
        }

        console.log("[AUTH] Attaching state observer to Scing Engine...");
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            console.log("[AUTH] Resolution acquired (ARC):", user ? `IDENTITY: ${user.uid}` : "ANONYMOUS/GUEST");
            useAuthStore.getState().setUser(normalizeUser(user));
            clearTimeout(timeoutId);
        }, (error) => {
            console.error("[AUTH] Observer linkage failed:", error);
            useAuthStore.getState().setError(error.message);
            useAuthStore.getState().setLoading(false);
            clearTimeout(timeoutId);
        });

        return () => {
            unsubscribe();
            clearTimeout(timeoutId);
        };
    } catch (e) {
        console.error("[AUTH] Critical initialization failure:", e);
        useAuthStore.getState().setLoading(false);
        clearTimeout(timeoutId);
        return () => {};
    }
};

export const logout = async () => {
    if (AUTH_MODE === "GENERIC") {
        localStorage.removeItem("devUser");
        useAuthStore.getState().setUser(null);
        return;
    }

    const auth = getFirebaseAuth();
    if (auth) {
        await signOut(auth);
    }
};
