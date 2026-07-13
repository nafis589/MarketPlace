interface NominatimAddress {
  neighbourhood?: string;
  suburb?: string;
  village?: string;
  town?: string;
  city_district?: string;
  county?: string;
  city?: string;
}

interface NominatimResponse {
  address?: NominatimAddress;
  display_name?: string;
}

/**
 * Reverse-geocodes coordinates into a human-readable place name via Nominatim.
 * Falls back to the raw coordinates on any failure.
 */
export async function reverseGeocode(lat: number, lng: number): Promise<string> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=fr`,
      { headers: { 'Accept': 'application/json' } },
    );
    const data = (await res.json()) as NominatimResponse;
    const a = data.address ?? {};

    const label =
      a.neighbourhood ||
      a.suburb ||
      a.village ||
      a.town ||
      a.city_district ||
      a.county ||
      a.city ||
      data.display_name?.split(',')[0] ||
      `${lat.toFixed(4)}, ${lng.toFixed(4)}`;

    const city = a.city || a.town || a.village || '';
    return city && label !== city ? `${label}, ${city}` : label;
  } catch {
    return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  }
}
