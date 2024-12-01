export const LOCATION_STORAGE_KEY = "userLocation";

export const getLocationFromStorage = () => {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem(LOCATION_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  }
  return null;
};
