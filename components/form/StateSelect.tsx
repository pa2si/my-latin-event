"use client";

import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/react";
import { State } from "country-state-city";
import { useState, useRef, useEffect, useMemo } from "react";
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

interface StateSelectProps extends BaseSelectProps {
  value: string;
  countryCode: string;
  onSelect: (data: LocationData) => void;
}

const ITEM_HEIGHT = 36;
const MAX_ITEMS = 7;

export const StateSelect: React.FC<StateSelectProps> = ({
  onSelect,
  value,
  name,
  label,
  description,
  countryCode,
  className,
  placeholder,
}) => {
  const [query, setQuery] = useState("");
  const [isInputActive, setIsInputActive] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const comboboxRef = useRef<HTMLDivElement>(null);

  // Memoize states list
  const states = useMemo(() => {
    return State.getStatesOfCountry(countryCode).sort((a, b) =>
      a.name.localeCompare(b.name),
    );
  }, [countryCode]);

  const selectedState = states.find((state) => state.name === value);

  const filteredStates = useMemo(() => {
    return query === ""
      ? states
      : states.filter((state) => {
          return state.name.toLowerCase().includes(query.toLowerCase());
        });
  }, [query, states]);

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

  const Row = ({ index, style }: { index: number; style: any }) => {
    const state = filteredStates[index];

    return (
      <div style={style}>
        <ComboboxOption
          value={state}
          className="relative cursor-pointer select-none py-2 pl-10 pr-4 text-sm hover:bg-blue-50"
        >
          {({ selected }) => (
            <>
              <span
                className={`block truncate ${
                  selected ? "font-semibold" : "font-normal"
                }`}
              >
                {state.name}
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
          value={selectedState}
          onChange={(state) => {
            if (state) {
              onSelect({ name: state.name, isoCode: state.isoCode });
              setQuery(state.name);
            }
            setShowOptions(false);
          }}
          disabled={!countryCode}
          as="div"
          className="relative"
          ref={comboboxRef}
        >
          <div className="relative">
            <input
              type="hidden"
              name={name}
              value={selectedState?.name || ""}
            />

            <ComboboxInput
              placeholder={placeholder}
              displayValue={(state: any) => state?.name || ""}
              onChange={(e) => {
                const newValue = e.target.value;
                setQuery(newValue);
                if (newValue === "") {
                  onSelect({ name: "", isoCode: "" });
                }
                setShowOptions(true);
              }}
              onFocus={() => {
                setShowOptions(true);
                setIsInputActive(true); // Set input as active when focused
              }}
              autoComplete="off"
              className="flex h-9 w-full rounded-md border border-input bg-muted/20 px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            />

            {showOptions && filteredStates.length > 0 && (
              <ComboboxOptions
                static
                className="absolute z-10 mt-1 w-full rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5"
              >
                <List
                  height={Math.min(
                    filteredStates.length * ITEM_HEIGHT,
                    MAX_ITEMS * ITEM_HEIGHT,
                  )}
                  itemCount={filteredStates.length}
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

export default StateSelect;
