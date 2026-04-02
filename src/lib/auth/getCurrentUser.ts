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
    
    // If it's a DevUser (GENERIC mode)
    if (user.id && user.role) {
        return {
            uid: user.id,
            email: user.email,
            displayName: user.displayName || user.name,
            name: user.name,
            role: user.role,
            systemRole: user.systemRole,
            authorityLevel: user.authorityLevel,
            professionalCredentialStatus: user.professionalCredentialStatus,
            professionalCredentials: user.professionalCredentials || [],
            isGeneric: true
        };
    }
    
    // If it's a Firebase User (ARC mode)
    const fbUser = user as FirebaseUser;
    return {
        uid: fbUser.uid,
        email: fbUser.email,
        displayName: fbUser.displayName || 'ARC User',
        name: fbUser.displayName || 'Unidentified ARC Operator',
        role: "inspector", 
        systemRole: "field_inspector",
        authorityLevel: "standard",
        professionalCredentialStatus: "unverified",
        professionalCredentials: [],
        isGeneric: false
    };
};
