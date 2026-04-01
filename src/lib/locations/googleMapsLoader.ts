import { Loader } from '@googlemaps/js-api-loader';

let loaderInstance: Loader | null = null;

export const getGoogleMapsLoader = (): Loader => {
  if (!loaderInstance) {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    
    if (!apiKey) {
      throw new Error('NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is not configured in the environment.');
    }

    loaderInstance = new Loader({
      apiKey,
      version: 'weekly',
      libraries: ['places', 'geometry', 'maps', 'marker'] as any, // Add more libraries as needed (e.g., 'drawing', 'visualization')
    });
  }

  return loaderInstance;
};

export const loadGoogleMaps = async (): Promise<typeof google> => {
  const loader = getGoogleMapsLoader();
  await (loader as any).importLibrary('maps');
  await (loader as any).importLibrary('marker'); 
  return window.google;
};
