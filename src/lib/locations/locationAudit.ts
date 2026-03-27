import { LocationAuditStamp, LocationEntity } from './locationTypes';

// STUB: This service logs all location reads, updates, tracking changes, and geofence events
export class LocationAudit {
  /**
   * Write an audit event for Location viewing or tracking
   */
  async logAccess(
    entityId: string,
    accessorId: string,
    action: 'view' | 'track_start' | 'track_stop'
  ): Promise<void> {
    const stamp: LocationAuditStamp = {
      eventId: crypto.randomUUID(),
      entityRef: entityId,
      eventType: `location_access_${action}`,
      coordinates: { lat: 0, lng: 0 }, // If relevant, capture accessor's location or entity's accessed location
      timestamp: new Date().toISOString(),
      actor: accessorId,
      source: 'LocationsOverSCITE_UI',
      notes: `User ${accessorId} performed ${action} on entity ${entityId}`,
    };

    console.debug('[LocationAudit] logAccess:', stamp);
    // TODO: Write to Firestore locations_events or BANE audit stream
  }

  /**
   * Log an operational event like route change, geofence trigger, or manual marker move
   */
  async logEvent(stamp: LocationAuditStamp): Promise<void> {
    console.debug('[LocationAudit] logEvent:', stamp);
    // TODO: Write to Firestore locations_events
  }
}

export const locationAudit = new LocationAudit();
