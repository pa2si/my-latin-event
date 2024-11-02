import React, { forwardRef, useEffect, useState, useRef } from "react";
import FormInput from "./FormInput";
import { formattedCountries } from "@/utils/countries";
import { cn } from "@/lib/utils";

interface CountryInputProps {
  label?: string;
  name: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
  defaultValue?: string;
}

const CountryInput = forwardRef<HTMLInputElement, CountryInputProps>(
  ({ className, defaultValue, ...props }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [selectedCountry, setSelectedCountry] = useState<{
      name: string;
      flag: string;
    } | null>(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const [filteredCountries, setFilteredCountries] =
      useState(formattedCountries);

    // close country dropdown when clicked outside
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          containerRef.current &&
          !containerRef.current.contains(event.target as Node)
        ) {
          setShowDropdown(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);

    useEffect(() => {
      if (props.value) {
        const found = formattedCountries.find(
          (country) =>
            country.name.toLowerCase() === props.value?.toLowerCase(),
        );
        if (found) {
          setSelectedCountry(found);
        }
      }
    }, [props.value]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;
      props.onChange?.(e);

      const filtered = formattedCountries.filter((country) =>
        country.name.toLowerCase().includes(inputValue.toLowerCase()),
      );
      setFilteredCountries(filtered);
      setShowDropdown(true);
      setSelectedCountry(null);
    };

    const handleCountrySelect = (country: (typeof formattedCountries)[0]) => {
      setSelectedCountry(country);
      setShowDropdown(false);

      const syntheticEvent = {
        target: {
          name: props.name,
          value: country.name,
        },
      } as React.ChangeEvent<HTMLInputElement>;

      props.onChange?.(syntheticEvent);
    };

    return (
      <div ref={containerRef} className="relative">
        <div className="relative">
          {selectedCountry && (
            <div className="absolute left-3 top-[29px] z-10 text-xl">
              {selectedCountry.flag}
            </div>
          )}
          <FormInput
            {...props}
            type="text"
            ref={ref}
            defaultValue={defaultValue}
            onChange={handleInputChange}
            onFocus={() => props.value && setShowDropdown(true)}
            className={cn(className, selectedCountry && "pl-10")}
          />
        </div>

        {showDropdown && (
          <div className="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-white shadow-lg">
            {filteredCountries.map((country) => (
              <div
                key={country.code}
                className="flex cursor-pointer items-center px-4 py-2 hover:bg-gray-100"
                onClick={() => handleCountrySelect(country)}
              >
                <span className="mr-2 text-xl">{country.flag}</span>
                <span>{country.name}</span>
              </div>
            ))}
            {filteredCountries.length === 0 && (
              <div className="px-4 py-2 text-gray-500">No countries found</div>
            )}
          </div>
        )}
      </div>
    );
  },
);

CountryInput.displayName = "CountryInput";

export default CountryInput;
