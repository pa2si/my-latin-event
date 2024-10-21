import { create } from "zustand";
import { Booking } from "./types";
import { DateRange } from "react-day-picker";
import { Style } from "./styles";

// Define the state's shape
type EventState = {
  eventId: string;
  price: number;
  bookings: Booking[];
  range: DateRange | undefined;
};

interface GenreStylesState {
  selectedGenre: string;
  setSelectedGenre: (genre: string) => void;
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
  selectedGenre: "",
  setSelectedGenre: (genre) => set({ selectedGenre: genre }),
  styles: [],
  setStyles: (styles) => set({ styles }),
}));
