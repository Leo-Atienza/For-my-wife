// Haversine formula — calculate distance between two points on Earth

const EARTH_RADIUS_KM = 6371;
const KM_TO_MILES = 0.621371;

const toRadians = (degrees: number): number => {
  return degrees * (Math.PI / 180);
};

export const calculateDistanceKm = (
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number => {
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS_KM * c;
};

export const calculateDistanceMiles = (
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number => {
  return calculateDistanceKm(lat1, lng1, lat2, lng2) * KM_TO_MILES;
};

export const formatDistance = (km: number): string => {
  if (km < 1) return 'You\u2019re together!';
  if (km < 100) return `${Math.round(km)} km apart`;
  return `${Math.round(km).toLocaleString()} km apart`;
};
