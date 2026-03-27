import { LocationEntity, LocationVisibilityPolicy } from './locationTypes';

// STUB: This service handles evaluating BANE-style governance rules for location access
export class LocationPermissions {
  /**
   * Determine if the current authenticated user can view the specific LocationEntity
   */
  canViewLocation(
    currentUserId: string,
    currentUserRoles: string[],
    entity: LocationEntity
  ): boolean {
    console.debug('[LocationPermissions] Evaluating policy for:', entity.visibilityPolicy);
    
    // In the future, evaluate actual BANE policies
    // e.g. self_only -> currentUserId === entity.entityId (if user)
    // admin_governance_only -> currentUserRoles.includes('admin')
    
    return true; // Stub: Permit all temporarily
  }

  /**
   * Returns a list of permitted entity types for mapping queries.
   */
  getAllowedLayerTypes(currentUserRoles: string[]): string[] {
    console.debug('[LocationPermissions] Resolving layer visibility for roles:', currentUserRoles);
    return ['user', 'client', 'property', 'inspection', 'device'];
  }
}

export const locationPermissions = new LocationPermissions();
