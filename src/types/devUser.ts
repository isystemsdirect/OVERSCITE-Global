/**
 * SCINGULAR Global — Development User Definition
 * 
 * Defines the identity structure for internal testing and role simulation.
 */
export interface DevUser {
    id: string;
    systemRole: string;
    role: "admin" | "inspector" | "contractor";
    name: string;
    displayName: string;
    authorityLevel: "standard" | "elevated" | "elevated_immutable" | "highest_immutable";
    email?: string;
    professionalCredentialStatus: "verified" | "unverified" | "not_required";
    professionalCredentials?: string[];
}
