import { useCallback, useEffect, useRef } from "react";
import { useGenreStylesStore } from "@/utils/store";
import { getCurrencyFromCountry } from "@/utils/currencyUtils";

declare global {
  interface Window {
    google: typeof google;
    initAutocomplete?: () => void;
  }
}

const useGoogleAutocomplete = (
  setFormData: React.Dispatch<React.SetStateAction<any>>,
) => {
  const setSelectedCurrency = useGenreStylesStore(
    (state) => state.setSelectedCurrency,
  );
  const locationRef = useRef<HTMLInputElement | null>(null);
  const cityRef = useRef<HTMLInputElement | null>(null);
  const streetRef = useRef<HTMLInputElement | null>(null);
  const postalCodeRef = useRef<HTMLInputElement | null>(null);
  const countryRef = useRef<HTMLInputElement | null>(null);

  const initializeAutocomplete = useCallback(() => {
    const preventEnterKeySubmission = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
      }
    };

    const initAutocomplete = (
      ref: React.RefObject<HTMLInputElement>,
      types: string[],
    ) => {
      const input = ref.current;
      if (!input) return;

      input.addEventListener("keydown", preventEnterKeySubmission);

      try {
        const autocomplete = new google.maps.places.Autocomplete(input, {
          types,
        });

        autocomplete.addListener("place_changed", () => {
          const place = autocomplete.getPlace();
          const addressComponents = place.address_components;

          if (addressComponents) {
            let formData: Record<string, string> = {};
            let streetName = "";
            let streetNumber = "";
            let countryName = "";

            addressComponents.forEach((component) => {
              const types = component.types;
              if (types.includes("locality")) {
                formData.city = component.long_name;
              }
              if (types.includes("country")) {
                countryName = component.long_name;
                formData.country = component.long_name;
              }
              if (types.includes("street_number")) {
                streetNumber = component.long_name;
              }
              if (types.includes("route")) {
                streetName = component.long_name;
              }
              if (types.includes("postal_code")) {
                formData.postalCode = component.long_name;
              }
            });

            if (streetName || streetNumber) {
              formData.street = `${streetName} ${streetNumber}`.trim();
            }

            // Update currency based on country
            if (countryName) {
              const currency = getCurrencyFromCountry(countryName);
              setSelectedCurrency(currency);
            }

            setFormData((prevData: any) => ({
              ...prevData,
              ...formData,
              location: place.name || "",
              googleMapsLink: place.url || "",
            }));
          }
        });
      } catch (error) {
        console.error("Error initializing autocomplete:", error);
      }
    };

    initAutocomplete(locationRef, ["establishment"]);
    initAutocomplete(cityRef, ["(cities)"]);
    initAutocomplete(streetRef, ["address"]);
    initAutocomplete(postalCodeRef, ["postal_code"]);
    initAutocomplete(countryRef, ["(regions)"]);
  }, [setFormData, setSelectedCurrency]);

  useEffect(() => {
    let isSubscribed = true;

    const loadGoogleMapsScript = () => {
      // If Google Maps is already loaded
      if (window.google && window.google.maps && window.google.maps.places) {
        initializeAutocomplete();
        return;
      }

      // Store initialization function globally
      window.initAutocomplete = () => {
        if (isSubscribed) {
          initializeAutocomplete();
        }
      };

      // Check for existing script
      const existingScript = document.querySelector(
        'script[src*="maps.googleapis.com"]',
      );
      if (existingScript) {
        return;
      }

      // Create and append script
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places&callback=initAutocomplete&loading=async`;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    };

    loadGoogleMapsScript();

    return () => {
      isSubscribed = false;
      // Cleanup global callback
      if (window.initAutocomplete) {
        delete window.initAutocomplete;
      }
    };
  }, [initializeAutocomplete]);

  return {
    locationRef,
    cityRef,
    streetRef,
    postalCodeRef,
    countryRef,
  };
};

export default useGoogleAutocomplete;
