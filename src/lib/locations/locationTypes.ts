export type LocationEntityType = 'user' | 'client' | 'property' | 'inspection' | 'device';

export type LocationVisibilityPolicy = 
  | 'self_only'
  | 'assigned_team'
  | 'client_scoped'
  | 'org_scoped'
  | 'admin_governance_only';

export interface LocationEntity {
  id: string;
  entityType: LocationEntityType;
  entityId: string;
  lat: number;
  lng: number;
  altitude?: number;
  accuracy?: number;
  source: string;
  timestamp: string;
  status: string;
  visibilityPolicy: LocationVisibilityPolicy;
  geoHash?: string;
  addressNormalized?: string;
  placeId?: string;
  weatherBindingId?: string;
}

export interface LocationSearchResult {
  id: string;
  title: string;
  description: string;
  lat: number;
  lng: number;
  type: LocationEntityType | 'place';
}

export interface MapLayerState {
  users: boolean;
  clients: boolean;
  inspections: boolean;
  devices: boolean;
  teams: boolean;
  weather: boolean;
  hazards: boolean;
}

export interface LocationAuditStamp {
  eventId: string;
  entityRef: string;
  eventType: string;
  coordinates: { lat: number; lng: number };
  timestamp: string;
  actor: string;
  source: string;
  notes?: string;
}
