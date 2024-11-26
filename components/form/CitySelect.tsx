"use client";

import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/react";
import { City } from "country-state-city";
import { useState, useRef, useEffect, useMemo } from "react";
import { FixedSizeList as List } from "react-window";
import { CheckIcon } from "lucide-react";

interface BaseSelectProps {
  name?: string;
  label: string;
  description?: string;
  className?: string;
  placeholder?: string;
}

interface CitySelectProps extends BaseSelectProps {
  value: string;
  countryCode: string;
  stateCode: string;
  onSelect: (name: string) => void;
}

const ITEM_HEIGHT = 36;
const MAX_ITEMS = 7;

export const CitySelect: React.FC<CitySelectProps> = ({
  onSelect,
  value,
  name,
  label,
  description,
  countryCode,
  stateCode,
  className,
  placeholder,
}) => {
  const [query, setQuery] = useState("");
  const [isInputActive, setIsInputActive] = useState(false); // New state to track input interaction
  const [showOptions, setShowOptions] = useState(false);
  const comboboxRef = useRef<HTMLDivElement>(null);

  // Memoize cities list
  const cities = useMemo(() => {
    return City.getCitiesOfState(countryCode, stateCode).sort((a, b) =>
      a.name.localeCompare(b.name),
    );
  }, [countryCode, stateCode]);

  const selectedCity = cities.find((city) => city.name === value);

  const filteredCities = useMemo(() => {
    return query === ""
      ? cities
      : cities.filter((city) => {
          return city.name.toLowerCase().includes(query.toLowerCase());
        });
  }, [query, cities]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        comboboxRef.current &&
        !comboboxRef.current.contains(event.target as Node)
      ) {
        setShowOptions(false);
        // Only clear if input is active and query is empty
        if (isInputActive && query === "") {
          onSelect("");
        }
        setIsInputActive(false); // Reset input active state
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [query, onSelect, isInputActive]);

  const Row = ({ index, style }: { index: number; style: any }) => {
    const city = filteredCities[index];

    return (
      <div style={style}>
        <ComboboxOption
          value={city}
          className="relative cursor-pointer select-none py-2 pl-10 pr-4 text-sm hover:bg-blue-50"
        >
          {({ selected }) => (
            <>
              <span
                className={`block truncate ${
                  selected ? "font-semibold" : "font-normal"
                }`}
              >
                {city.name}
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
          value={selectedCity}
          onChange={(city) => {
            if (city) {
              onSelect(city.name);
              setQuery(city.name);
            }
            setShowOptions(false);
          }}
          disabled={!countryCode || !stateCode}
          as="div"
          className="relative"
          ref={comboboxRef}
        >
          <div className="relative">
            <input type="hidden" name={name} value={selectedCity?.name || ""} />

            <ComboboxInput
              placeholder={placeholder}
              displayValue={(city: any) => city?.name || ""}
              onChange={(e) => {
                const newValue = e.target.value;
                setQuery(newValue);
                if (newValue === "") {
                  onSelect("");
                }
                setShowOptions(true);
              }}
              onFocus={() => {
                setShowOptions(true);
                setIsInputActive(true); // Set input as active when focused
              }}
              className="flex h-9 w-full rounded-md border border-input bg-muted/20 px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            />

            {showOptions && filteredCities.length > 0 && (
              <ComboboxOptions
                static
                className="absolute z-10 mt-1 w-full rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5"
              >
                <List
                  height={Math.min(
                    filteredCities.length * ITEM_HEIGHT,
                    MAX_ITEMS * ITEM_HEIGHT,
                  )}
                  itemCount={filteredCities.length}
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
};

export default CitySelect;
