/**
 * OVERSCITE Global — Development User Definition
 * 
 * Defines the identity structure for internal testing and role simulation.
 */
export interface DevUser {
    id: string;
    role: "admin" | "inspector" | "contractor";
    name: string;
    authorityLevel: "standard" | "elevated";
    email?: string;
}
