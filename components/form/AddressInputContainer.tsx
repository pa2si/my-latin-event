"use client";

import React, { useState } from "react";
import useGoogleAutocomplete from "@/utils/useGoogleAutocomplete";
import FormInput from "./FormInput";
import CountryInput from "./CountryInput";

const AddressInputContainer = () => {
  const [formData, setFormData] = useState({
    location: "",
    city: "",
    street: "",
    postalCode: "",
    country: "",
    googleMapsLink: "",
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
      <CountryInput
        label="Country"
        name="country"
        ref={countryRef}
        value={formData.country}
        onChange={handleChange}
        placeholder="Enter country"
      />

      <FormInput
        label="Google Maps Link"
        name="googleMapsLink"
        type="text"
        value={formData.googleMapsLink}
        readOnly // Make it read-only as the value will come from Google Maps
      />
    </div>
  );
};

export default AddressInputContainer;
