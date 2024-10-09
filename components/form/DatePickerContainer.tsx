'use client';

import { useState, useEffect } from 'react';
import { DatePicker } from '@/components/form/DatePicker';

const DatePickerContainer = ({ initialDate }: { initialDate: Date | null }) => {
  const [eventDate, setEventDate] = useState<Date | null>(initialDate);

  useEffect(() => {
    setEventDate(initialDate);
  }, [initialDate]);

  return (
    <>
      <DatePicker setDate={setEventDate} initialDate={eventDate} />
      <input
        type="hidden"
        name="eventDate"
        value={eventDate ? eventDate.toISOString() : ''}
      />
    </>
  );
};

export default DatePickerContainer;
