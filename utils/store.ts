import { create } from "zustand";
import { Booking, Style } from "./types";
import { DateRange } from "react-day-picker";

// Define the state's shape
type EventState = {
  eventId: string;
  price: number;
  bookings: Booking[];
  range: DateRange | undefined;
};

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

// Create the store
export const useEvent = create<EventState>(() => {
  return {
    eventId: "",
    price: 0,
    bookings: [],
    range: undefined,
  };
});

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
