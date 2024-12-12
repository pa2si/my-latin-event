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
  selectedGenres: string[]; // Changed from selectedGenre: string
  setSelectedGenres: (genres: string[]) => void; // Changed from setSelectedGenre
  styles: Style[];
  setStyles: (styles: Style[]) => void;
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
  selectedGenres: [], // Changed from selectedGenre: ""
  setSelectedGenres: (genres) => set({ selectedGenres: genres }), // Changed from setSelectedGenre
  styles: [],
  setStyles: (styles) => set({ styles }),
}));
