import { create } from 'zustand';
import { Booking } from './types';
import { DateRange } from 'react-day-picker';
// Define the state's shape
type EventState = {
  eventId: string;
  price: number;
  bookings: Booking[];
  range: DateRange | undefined;
};

// Create the store
export const useEvent = create<EventState>(() => {
  return {
    eventId: '',
    price: 0,
    bookings: [],
    range: undefined,
  };
});
