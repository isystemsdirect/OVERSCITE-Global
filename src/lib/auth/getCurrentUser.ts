/**
 * OVERSCITE Global — Unified Identity Resolver
 * 
 * Handles identity discovery for both GENERIC (internal) and ARC (production) modes.
 */
import { AUTH_MODE } from "@/config/auth";
import { getFirebaseAuth } from "../firebase";
import { User as FirebaseUser } from "firebase/auth";

export const getDevUser = () => {
    if (typeof window === 'undefined') return null;
    const stored = localStorage.getItem("devUser");
    return stored ? JSON.parse(stored) : null;
};

export const getARCUser = () => {
    // Return current Firebase user from auth store or instance
    const auth = getFirebaseAuth();
    return auth?.currentUser || null;
};

export const getCurrentUser = () => {
    if (AUTH_MODE === "GENERIC") {
        return getDevUser();
    }
    return getARCUser();
};

/**
 * Normalizes a user object to a common structure for internal app consumption.
 */
export const normalizeUser = (user: any) => {
    if (!user) return null;
    
    // If it's a DevUser
    if (user.id && user.role) {
        return {
            uid: user.id,
            email: user.email,
            displayName: user.name,
            role: user.role,
            authorityLevel: user.authorityLevel,
            isGeneric: true
        };
    }
    
    // If it's a Firebase User
    const fbUser = user as FirebaseUser;
    return {
        uid: fbUser.uid,
        email: fbUser.email,
        displayName: fbUser.displayName,
        role: "inspector", // Default Role for ARC users until role-resolution service is active
        authorityLevel: "standard",
        isGeneric: false
    };
};
