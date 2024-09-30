'use client';

import { useEvent } from '@/utils/store';
import { Booking } from '@/utils/types';
import BookingCalendar from './BookingCalendar';
import BookingContainer from './BookingContainer';
import { useEffect } from 'react';

type BookingWrapperProps = {
  eventId: string;
  price: number;
  bookings: Booking[];
};
const BookingWrapper = ({ eventId, price, bookings }: BookingWrapperProps) => {
  useEffect(() => {
    useEvent.setState({
      eventId,
      price,
      bookings,
    });
  }, [eventId, price, bookings]);
  return (
    <>
      <BookingCalendar />
      <BookingContainer />
    </>
  );
};

export default BookingWrapper;
