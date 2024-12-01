"use client";
222;
import { useState, useEffect } from "react";
import { Country, State } from "country-state-city";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import CountrySelect from "@/components/form/CountrySelect";
import StateSelect from "@/components/form/StateSelect";
import CitySelect from "@/components/form/CitySelect";
import { useCookies } from "next-client-cookies"; // Import useCookies

const LOCATION_COOKIE_KEY = "guestLocation";

interface LocationData {
  name: string;
  isoCode: string;
}

interface GuestLocationContainerProps {
  onClose: () => void;
}

const GuestLocationContainer = ({ onClose }: GuestLocationContainerProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const cookies = useCookies(); // Initialize cookies

  // Check if there's a stored location
  const storedLocation = cookies.get(LOCATION_COOKIE_KEY);
  const hasStoredLocation = !!storedLocation;

  const [formData, setFormData] = useState(() => {
    if (typeof window !== "undefined" && storedLocation) {
      try {
        const parsed = JSON.parse(storedLocation);
        return {
          countryCode: "",
          stateCode: "",
          countryName: parsed.country || "",
          stateName: parsed.state || "",
          cityName: parsed.city || "",
        };
      } catch (error) {
        console.error("Error parsing location cookie:", error);
      }
    }
    return {
      countryCode: "",
      stateCode: "",
      countryName: "",
      stateName: "",
      cityName: "",
    };
  });

  useEffect(() => {
    if (formData.countryName) {
      const country = Country.getAllCountries().find(
        (c) => c.name === formData.countryName,
      );
      if (country) {
        setFormData((prev) => ({ ...prev, countryCode: country.isoCode }));
      }
    }
  }, [formData.countryName]);

  useEffect(() => {
    if (formData.countryCode && formData.stateName) {
      const state = State.getStatesOfCountry(formData.countryCode).find(
        (s) => s.name === formData.stateName,
      );
      if (state) {
        setFormData((prev) => ({ ...prev, stateCode: state.isoCode }));
      }
    }
  }, [formData.countryCode, formData.stateName]);

  const getStateName = () => {
    if (!formData.countryCode || !formData.stateCode) return "";
    const states = State.getStatesOfCountry(formData.countryCode);
    const state = states.find((s) => s.isoCode === formData.stateCode);
    return state?.name || "";
  };

  const handleSaveLocation = () => {
    if (formData.countryName && formData.stateName) {
      // Save all location data in a single cookie as JSON
      cookies.set(
        "guestLocation",
        JSON.stringify({
          country: formData.countryName,
          state: formData.stateName,
          city: formData.cityName || "",
        }),
      );

      // Removed code that updates URL parameters
      // Navigate without changing the URL
      router.refresh();
      onClose();
    }
  };

  return (
    <div className="space-y-6">
      {!hasStoredLocation && (
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">Welcome to My Latin Event!</h2>
          <p className="text-sm text-muted-foreground">
            Please set your location to discover relevant events nearby. You can
            update your location at any time.
          </p>
          <div className="my-4 border-t" />
        </div>
      )}
      <div className="space-y-4">
        <CountrySelect
          value={formData.countryName}
          onSelect={(selectedCountry: LocationData) => {
            setFormData({
              countryName: selectedCountry.name,
              countryCode: selectedCountry.isoCode,
              stateName: "",
              stateCode: "",
              cityName: "",
            });
          }}
          label="Country"
          name="userCountry"
          description="Please select your country*"
          placeholder="Select country"
        />
        <StateSelect
          value={formData.stateName}
          onSelect={(selectedState: LocationData) => {
            setFormData((prev) => ({
              ...prev,
              stateName: selectedState.name,
              stateCode: selectedState.isoCode,
              cityName: "",
            }));
          }}
          countryCode={formData.countryCode}
          label="State"
          name="userState"
          description="First select your state*"
        />
        <CitySelect
          value={formData.cityName}
          onSelect={(name: string) =>
            setFormData((prev) => ({ ...prev, cityName: name }))
          }
          countryCode={formData.countryCode}
          stateCode={formData.stateCode}
          label="City"
          name="userCity"
          description={
            formData.stateCode
              ? `Optional - If no city is selected, ${getStateName()} will be used for event matching`
              : "Optional - First select your state"
          }
        />
        {formData.stateCode && !formData.cityName && (
          <div className="mt-2 text-sm italic text-gray-500">
            Note: Since no city is selected, you will see events from everywhere
            in {getStateName()}
          </div>
        )}
        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSaveLocation}
            disabled={!formData.countryName || !formData.stateName}
          >
            Set Location
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GuestLocationContainer;
