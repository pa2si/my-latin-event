'use client';

import { useState } from 'react';
import { DatePicker } from '@/components/form/DatePicker';
import TimePicker from './TimePicker';

const DatePickerContainer = ({ initialDate }: { initialDate: Date | null }) => {
  const [eventDate, setEventDate] = useState<Date | null>(initialDate);
  const [hours, setHours] = useState<number>(20);
  const [minutes, setMinutes] = useState<number>(0);

  const combineDateAndTime = (
    date: Date | null,
    hour: number,
    minute: number
  ): Date | null => {
    if (!date) return null;
    const combined = new Date(date);
    combined.setHours(hour);
    combined.setMinutes(minute);
    combined.setSeconds(0);
    return combined;
  };

  const combinedDateTime = combineDateAndTime(eventDate, hours, minutes);

  return (
    <>
      <h3 className="text-lg mt-8 mb-4 font-medium">Date & Time</h3>
      <div className="flex flex-col items-center justify-center gap-4">
        <DatePicker setDate={setEventDate} initialDate={eventDate} />
        <input
          type="hidden"
          name="eventDate"
          value={combinedDateTime ? combinedDateTime.toISOString() : ''}
        />
        <TimePicker
          initialHours={20}
          initialMinutes={0}
          setTime={(newHours, newMinutes) => {
            setHours(newHours);
            setMinutes(newMinutes);
          }}
        />
      </div>
    </>
  );
};

export default DatePickerContainer;
