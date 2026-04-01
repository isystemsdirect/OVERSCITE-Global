/**
 * OVERSCITE Global — Predefined Development Users
 * 
 * Simulated identities for internal testing across all core roles.
 */
import { DevUser } from "@/types/devUser";

export const DEV_USERS: DevUser[] = [
    {
        id: "dev-001",
        role: "admin",
        name: "Director Anderson",
        authorityLevel: "elevated",
        email: "director@scingula.ai"
    },
    {
        id: "dev-002",
        role: "inspector",
        name: "Field Inspector 01",
        authorityLevel: "standard",
        email: "inspector.01@scingula.ai"
    },
    {
        id: "dev-003",
        role: "contractor",
        name: "Global Contractor",
        authorityLevel: "standard",
        email: "contractor.alpha@scingula.ai"
    }
];
