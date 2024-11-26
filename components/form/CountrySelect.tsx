"use client";

import React, { forwardRef, useState, useRef, useEffect, useMemo } from "react";
import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/react";
import { Country } from "country-state-city";
import { CheckIcon } from "lucide-react";
import { FixedSizeList as List } from "react-window";

interface LocationData {
  name: string;
  isoCode: string;
}

interface BaseSelectProps {
  name?: string;
  label: string;
  description?: string;
  className?: string;
  placeholder?: string;
}

interface CountrySelectProps extends BaseSelectProps {
  value: string;
  onSelect: (data: LocationData) => void;
}

const ITEM_HEIGHT = 36;
const MAX_ITEMS = 7;

const CountrySelect = forwardRef<HTMLInputElement, CountrySelectProps>(
  (
    { onSelect, value, name, label, description, className, placeholder },
    ref,
  ) => {
    const [query, setQuery] = useState("");
    const [showOptions, setShowOptions] = useState(false);
    const [isInputActive, setIsInputActive] = useState(false);
    const comboboxRef = useRef<HTMLDivElement>(null);

    const countries = useMemo(() => {
      return Country.getAllCountries().sort((a, b) =>
        a.name.localeCompare(b.name),
      );
    }, []);

    const selectedCountry = countries.find((country) => country.name === value);

    const filteredCountries = useMemo(() => {
      return query === ""
        ? countries
        : countries.filter((country) => {
            return country.name.toLowerCase().includes(query.toLowerCase());
          });
    }, [query, countries]);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          comboboxRef.current &&
          !comboboxRef.current.contains(event.target as Node)
        ) {
          setShowOptions(false);
          // Only clear if input is active and query is empty
          if (isInputActive && query === "") {
            onSelect({ name: "", isoCode: "" });
          }
          setIsInputActive(false); // Reset input active state
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [query, onSelect, isInputActive]);

    const getDisplayValue = (country: any) => {
      if (!country) return "";
      return `${country.flag} ${country.name}`;
    };

    const getStoredValue = (country: any) => {
      if (!country) return "";
      return country.name;
    };

    const Row = ({ index, style }: { index: number; style: any }) => {
      const country = filteredCountries[index];

      return (
        <div style={style}>
          <ComboboxOption
            value={country}
            className="relative cursor-pointer select-none py-2 pl-10 pr-4 text-sm hover:bg-blue-50"
          >
            {({ selected }) => (
              <>
                <span
                  className={`block truncate ${
                    selected ? "font-semibold" : "font-normal"
                  }`}
                >
                  {country.flag} {country.name}
                </span>
                {selected && (
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <CheckIcon className="h-5 w-5 text-blue-600" />
                  </span>
                )}
              </>
            )}
          </ComboboxOption>
        </div>
      );
    };

    return (
      <div className={className}>
        <div className="-mb-1 items-baseline justify-between md:mt-[4px]">
          <label className="-mb-[4px] block text-sm font-medium text-gray-900">
            {label}
          </label>
          {description && (
            <span className="text-sm text-gray-500">{description}</span>
          )}
        </div>
        <div className="mt-1">
          <Combobox
            value={selectedCountry}
            onChange={(country) => {
              if (country) {
                onSelect({ name: country.name, isoCode: country.isoCode });
                setQuery(country.name); // Update query with selected country name
              }
              setShowOptions(false);
            }}
            as="div"
            className="relative"
            ref={comboboxRef}
          >
            <div className="relative">
              <input
                type="hidden"
                name={name}
                value={getStoredValue(selectedCountry)}
              />

              <ComboboxInput
                placeholder={placeholder}
                displayValue={getDisplayValue}
                onChange={(e) => {
                  const newValue = e.target.value;
                  setQuery(newValue);
                  // If input is cleared, also clear the selection
                  if (newValue === "") {
                    onSelect({ name: "", isoCode: "" });
                  }
                  setShowOptions(true);
                }}
                onFocus={() => {
                  setShowOptions(true);
                  setIsInputActive(true); // Set input as active when focused
                }}
                className="flex h-9 w-full rounded-md border border-input bg-muted/20 px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                ref={ref}
              />

              {showOptions && filteredCountries.length > 0 && (
                <ComboboxOptions
                  static
                  className="absolute z-10 mt-1 w-full rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5"
                >
                  <List
                    height={Math.min(
                      filteredCountries.length * ITEM_HEIGHT,
                      MAX_ITEMS * ITEM_HEIGHT,
                    )}
                    itemCount={filteredCountries.length}
                    itemSize={ITEM_HEIGHT}
                    width="100%"
                    className="scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
                  >
                    {Row}
                  </List>
                </ComboboxOptions>
              )}
            </div>
          </Combobox>
        </div>
      </div>
    );
  },
);

CountrySelect.displayName = "CountrySelect";

export default CountrySelect;
