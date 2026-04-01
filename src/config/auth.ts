/**
 * OVERSCITE Global — Authentication Management Configuration
 * 
 * Defines the operational mode for the identity layer.
 * - GENERIC: Internal test mode using simulated DevUser identities via localStorage.
 * - ARC: Production-ready mode using Firebase/ARC identity orchestrators.
 */
export const AUTH_MODE = "GENERIC" as "GENERIC" | "ARC";
