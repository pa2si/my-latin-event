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
  selectedStyles: string[]; // Add this to track selected style names
  setSelectedStyles: (styles: string[]) => void; // Add setter
  availableStyles: Style[]; // Track all available styles based on genres
  setAvailableStyles: (styles: Style[]) => void;
  reset: () => void; // Add reset function
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
  reset: () =>
    set({ selectedGenres: [], selectedStyles: [], availableStyles: [] }),
}));
