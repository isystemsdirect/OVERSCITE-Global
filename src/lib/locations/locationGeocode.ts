// STUB: This service handles geocoding logic (Google Maps + Firestore cached lookups)
export class LocationGeocode {
  /**
   * Translates a human-readable address into lat/lng.
   */
  async geocodeAddress(address: string): Promise<{ lat: number; lng: number } | null> {
    console.debug('[LocationGeocode] geocodeAddress:', address);
    // TODO: implement with Google Maps Geocoder Service
    return null;
  }

  /**
   * Translates lat/lng into a human-readable address or Place ID.
   */
  async reverseGeocode(lat: number, lng: number): Promise<string | null> {
    console.debug(`[LocationGeocode] reverseGeocode: ${lat}, ${lng}`);
    // TODO: implement with Google Maps Geocoder Service
    return null;
  }
}

export const locationGeocode = new LocationGeocode();
