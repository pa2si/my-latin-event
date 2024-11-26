"use client";

import React, { useState } from "react";
import useGoogleAutocomplete from "@/utils/useGoogleAutocomplete";
import FormInput from "./FormInput";
import CountrySelect from "./CountrySelect";

interface AddressInputContainerProps {
  defaultValues?: {
    location: string;
    city: string;
    street: string;
    postalCode?: string;
    country: string;
    googleMapsLink?: string;
  };
}

const AddressInputContainer = ({
  defaultValues,
}: AddressInputContainerProps) => {
  const [formData, setFormData] = useState({
    location: defaultValues?.location ?? "",
    city: defaultValues?.city ?? "",
    street: defaultValues?.street ?? "",
    postalCode: defaultValues?.postalCode ?? "",
    country: defaultValues?.country ?? "",
    googleMapsLink: defaultValues?.googleMapsLink ?? "",
  });

  const { locationRef, cityRef, streetRef, postalCodeRef, countryRef } =
    useGoogleAutocomplete(setFormData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="mt-4 grid gap-8 sm:grid-cols-2">
      <FormInput
        label="Location Name"
        name="location"
        type="text"
        defaultValue={defaultValues?.location}
        ref={locationRef}
        value={formData.location}
        onChange={handleChange}
        placeholder="Enter & choose location to fill out automatically rest of the fields"
      />

      <FormInput
        label="City"
        name="city"
        type="text"
        ref={cityRef}
        value={formData.city}
        onChange={handleChange}
        placeholder="Enter city"
      />

      <FormInput
        label="Street & Number"
        name="street"
        type="text"
        ref={streetRef}
        value={formData.street}
        onChange={handleChange}
        placeholder="Enter street and number"
      />

      <FormInput
        label="Postal Code"
        name="postalCode"
        type="text"
        ref={postalCodeRef}
        value={formData.postalCode}
        onChange={handleChange}
        placeholder="Enter postal code"
      />
      <CountrySelect
        label="Country"
        name="country"
        ref={countryRef}
        value={formData.country}
        onSelect={(selectedCountry) => {
          setFormData((prev) => ({ ...prev, country: selectedCountry.name }));
        }}
        placeholder="Select country"
      />

      <FormInput
        label="Google Maps Link"
        name="googleMapsLink"
        type="text"
        value={formData.googleMapsLink}
        onChange={handleChange}
        placeholder="Auto generated or paste here"
      />
    </div>
  );
};

export default AddressInputContainer;
