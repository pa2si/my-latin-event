import { create } from "zustand";
import { Style } from "./types";

interface GenreStylesState {
  selectedGenres: string[];
  setSelectedGenres: (genres: string[]) => void;
  selectedStyles: string[];
  setSelectedStyles: (styles: string[]) => void;
  availableStyles: Style[];
  setAvailableStyles: (styles: Style[]) => void;
  // Add these new properties for currency
  selectedCurrency: string;
  setSelectedCurrency: (currency: string) => void;
  reset: () => void;
}

// Create the genreStyle store
export const useGenreStylesStore = create<GenreStylesState>((set) => ({
  selectedGenres: [],
  setSelectedGenres: (genres) => set({ selectedGenres: genres }),
  selectedStyles: [],
  setSelectedStyles: (styles) => set({ selectedStyles: styles }),
  availableStyles: [],
  setAvailableStyles: (styles) => set({ availableStyles: styles }),
  // Add these new implementations for currency
  selectedCurrency: "€",
  setSelectedCurrency: (currency) => set({ selectedCurrency: currency }),
  reset: () =>
    set({
      selectedGenres: [],
      selectedStyles: [],
      availableStyles: [],
      selectedCurrency: "€",
    }),
}));
