'use client';

import { useEffect, useState } from 'react';
import { DatePicker } from '@/components/form/DatePicker';
import TimePicker from './TimePicker';

const DateAndTimePickerContainer = ({
  defaultValue,
}: {
  defaultValue: Date | null;
}) => {
  const [date, setDate] = useState<Date | null>(defaultValue);
  const [hours, setHours] = useState<number>(
    defaultValue ? defaultValue.getHours() : 20
  );
  const [minutes, setMinutes] = useState<number>(
    defaultValue ? defaultValue.getMinutes() : 0
  );

  useEffect(() => {
    if (defaultValue) {
      setDate(defaultValue);
      setHours(defaultValue.getHours());
      setMinutes(defaultValue.getMinutes());
    }
  }, [defaultValue]);

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

  const combinedDateTime = combineDateAndTime(date, hours, minutes);

  return (
    <>
      <h3 className="text-lg mt-8 mb-4 font-medium">Date & Time</h3>
      <div className="flex flex-col items-center justify-center gap-4">
        <DatePicker setDate={setDate} initialDate={date} />
        <input
          type="hidden"
          name="eventDateAndTime"
          value={combinedDateTime ? combinedDateTime.toISOString() : ''}
        />
        <TimePicker
          initialHours={hours}
          initialMinutes={minutes}
          setTime={(newHours, newMinutes) => {
            setHours(newHours);
            setMinutes(newMinutes);
          }}
        />
      </div>
    </>
  );
};

export default DateAndTimePickerContainer;
