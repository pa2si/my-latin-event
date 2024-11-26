"use client";

import { useState, useEffect } from "react";
import { Country, State } from "country-state-city";
import CountrySelect from "@/components/form/CountrySelect";
import StateSelect from "@/components/form/StateSelect";
import CitySelect from "@/components/form/CitySelect";

interface LocationSelectContainerProps {
  initialData?: {
    userCountry?: string;
    userState?: string;
    userCity?: string;
  };
}

interface LocationData {
  name: string;
  isoCode: string;
}

const LocationSelectContainer: React.FC<LocationSelectContainerProps> = ({
  initialData,
}) => {
  // Replace individual states with formData
  const [formData, setFormData] = useState({
    countryCode: "",
    stateCode: "",
    countryName: initialData?.userCountry || "",
    stateName: initialData?.userState || "",
    cityName: initialData?.userCity || "",
  });

  // Initialize codes from initial data
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

  // Get current state name for descriptions
  const getStateName = () => {
    if (!formData.countryCode || !formData.stateCode) return "";
    const states = State.getStatesOfCountry(formData.countryCode);
    const state = states.find((s) => s.isoCode === formData.stateCode);
    return state?.name || "";
  };

  return (
    <>
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
    </>
  );
};

export default LocationSelectContainer;
