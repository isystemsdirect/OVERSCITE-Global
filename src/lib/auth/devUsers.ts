/**
 * SCINGULAR Global — Predefined Development Users
 * 
 * Simulated identities for internal testing across all core roles.
 */
import { DevUser } from "@/types/devUser";

export const DEV_USERS: DevUser[] = [
    {
        id: "dev-001",
        systemRole: "system_director",
        role: "admin",
        name: "Director Teon G Anderson, MsD.",
        displayName: "System's Director",
        authorityLevel: "highest_immutable",
        email: "director@scingula.ai",
        professionalCredentialStatus: "not_required"
    },
    {
        id: "dev-002",
        systemRole: "field_inspector",
        role: "inspector",
        name: "Field Inspector 01",
        displayName: "Inspector Alpha",
        authorityLevel: "standard",
        email: "inspector.01@scingula.ai",
        professionalCredentialStatus: "unverified"
    },
    {
        id: "dev-003",
        systemRole: "global_contractor",
        role: "contractor",
        name: "Global Contractor",
        displayName: "Contractor 01",
        authorityLevel: "standard",
        email: "contractor.alpha@scingula.ai",
        professionalCredentialStatus: "unverified"
    }
];
