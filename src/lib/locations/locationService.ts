import { LocationEntity, LocationEntityType, LocationSearchResult } from './locationTypes';

// STUB: This service will eventually connect to Firestore locations_entities and geocoding services.
export class LocationService {
  /**
   * Fetches location entities bound by the given bounds, filtered by allowed types.
   */
  async getEntitiesInBounds(
    bounds: google.maps.LatLngBounds | google.maps.LatLngBoundsLiteral,
    types: LocationEntityType[]
  ): Promise<LocationEntity[]> {
    console.debug('[LocationService] getEntitiesInBounds called with types:', types);
    // TODO: implement real Firestore bounding box query (e.g., geohash ranges)
    return [];
  }

  /**
   * Search for an entity or place by string
   */
  async searchLocations(query: string): Promise<LocationSearchResult[]> {
    console.debug('[LocationService] searchLocations called with query:', query);
    // TODO: Implement Google Places Autocomplete + Firestore Entity Search
    return [];
  }

  /**
   * Gets the details for a specific LocationEntity
   */
  async getEntityDetails(id: string): Promise<LocationEntity | null> {
    console.debug('[LocationService] getEntityDetails called for id:', id);
    // TODO: Fetch from Firestore
    return null;
  }
}

export const locationService = new LocationService();
