"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Check, X } from "lucide-react"; // Add X import
import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/react";
import { getStylesForMultipleGenres } from "@/utils/getStyles";
import { useCookies } from "next-client-cookies";

interface Style {
  name: string;
}

export default function StylesSearch() {
  const { replace } = useRouter();
  const searchParams = useSearchParams();
  const cookies = useCookies();
  const [query, setQuery] = useState("");
  const [selectedStyle, setSelectedStyle] = useState<string>(
    searchParams?.get("style")?.toString() || "",
  );
  const [isOpen, setIsOpen] = useState(false);

  // Get selected genres from cookies
  const selectedGenres = JSON.parse(cookies.get("selectedGenres") || "[]");

  // Get all available styles for selected genres
  const availableStyles = getStylesForMultipleGenres(selectedGenres);

  // Filter styles based on search query
  const filteredStyles =
    query === ""
      ? availableStyles
      : availableStyles.filter((style) =>
          style.name.toLowerCase().includes(query.toLowerCase()),
        );

  const handleStyleSelect = (style: Style | null) => {
    if (style) {
      setSelectedStyle(style.name);
      const params = new URLSearchParams(searchParams?.toString() || "");
      params.set("style", style.name);
      replace(`/?${params.toString()}`);
    } else {
      setSelectedStyle("");
      const params = new URLSearchParams(searchParams?.toString() || "");
      params.delete("style");
      replace(`/?${params.toString()}`);
    }
    setIsOpen(false); // Close the options after selection
  };

  const handleClear = () => {
    setSelectedStyle("");
    setQuery("");
    const params = new URLSearchParams(searchParams?.toString() || "");
    params.delete("style");
    replace(`/?${params.toString()}`);
  };

  // Reset selected style when style param is removed from URL
  useEffect(() => {
    if (!searchParams?.get("style")) {
      setSelectedStyle("");
    }
  }, [searchParams]);

  return (
    <div className="relative w-[150px] sm:w-[200px]">
      <Combobox<Style | null>
        value={availableStyles.find((s) => s.name === selectedStyle) || null}
        onChange={handleStyleSelect}
      >
        <div
          className="relative"
          onBlur={(e) => {
            // Only close if the next focused element is not part of the combobox
            if (!e.currentTarget.contains(e.relatedTarget as Node)) {
              setIsOpen(false);
            }
          }}
        >
          <ComboboxInput
            className="flex h-9 w-full rounded-md border border-input bg-muted/20 px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 dark:bg-muted"
            placeholder="Search by style..."
            displayValue={(style: Style | null) => style?.name || ""}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            autoComplete="off"
          />
          {(selectedStyle || query) && (
            <button
              onClick={handleClear}
              className="absolute right-2 top-1/2 -translate-y-1/2 transform hover:opacity-75"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Clear search</span>
            </button>
          )}

          {isOpen && filteredStyles.length > 0 && (
            <ComboboxOptions
              className="absolute left-0 right-0 z-50 mt-1 max-h-48 overflow-auto rounded-md bg-popover py-1 shadow-md"
              static
            >
              {filteredStyles.map((style) => (
                <ComboboxOption
                  key={style.name}
                  value={style}
                  className={({ selected, focus }) =>
                    `relative cursor-pointer select-none px-3 py-2 text-sm ${
                      focus ? "bg-accent" : ""
                    }`
                  }
                >
                  {({ selected }) => (
                    <div className="flex items-center justify-between">
                      <span
                        className={selected ? "font-semibold" : "font-normal"}
                      >
                        {style.name}
                      </span>
                      {selected && <Check className="ml-2 h-4 w-4" />}
                    </div>
                  )}
                </ComboboxOption>
              ))}
            </ComboboxOptions>
          )}
        </div>
      </Combobox>
    </div>
  );
}
