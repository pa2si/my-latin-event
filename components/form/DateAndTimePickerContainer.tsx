"use client";

import { useEffect, useState } from "react";
import FormCheckbox from "./FormCheckbox";
import EventDateAndTimeInput from "./EventDateAndTimeInput";

const DateAndTimePickerContainer = ({
  defaultValue,
  defaultEndValue,
}: {
  defaultValue: Date | null;
  defaultEndValue?: Date | null;
}) => {
  const [date, setDate] = useState<Date | null>(defaultValue);
  const [hours, setHours] = useState<number>(
    defaultValue ? defaultValue.getHours() : 20,
  );
  const [minutes, setMinutes] = useState<number>(
    defaultValue ? defaultValue.getMinutes() : 0,
  );

  const [endDate, setEndDate] = useState<Date | null>(defaultEndValue || null);
  const [endHours, setEndHours] = useState<number>(
    defaultEndValue ? defaultEndValue.getHours() : 22,
  );
  const [endMinutes, setEndMinutes] = useState<number>(
    defaultEndValue ? defaultEndValue.getMinutes() : 0,
  );

  const [showEndingInput, setShowEndingInput] = useState(!!defaultEndValue);

  useEffect(() => {
    if (defaultValue) {
      setDate(defaultValue);
      setHours(defaultValue.getHours());
      setMinutes(defaultValue.getMinutes());
    }
    if (defaultEndValue) {
      setEndDate(defaultEndValue);
      setEndHours(defaultEndValue.getHours());
      setEndMinutes(defaultEndValue.getMinutes());
    }
  }, [defaultValue, defaultEndValue]);

  const handleCheckboxChange = (checked: boolean) => {
    setShowEndingInput(checked);
    if (checked && date) {
      // If checked, set endDate to the start date and update the time
      setEndDate(new Date(date));
      const newEndHours = (hours + 2) % 24;
      setEndHours(newEndHours);
      setEndMinutes(minutes);
    } else {
      // If unchecked, clear the end date
      setEndDate(null);
    }
  };

  const handleStartDateChange: React.Dispatch<
    React.SetStateAction<Date | null>
  > = (newDate) => {
    setDate(newDate);
    if (showEndingInput && newDate instanceof Date) {
      setEndDate(new Date(newDate));
    }
  };

  const handleStartTimeChange = (newHours: number, newMinutes: number) => {
    setHours(newHours);
    setMinutes(newMinutes);
    if (showEndingInput) {
      const newEndHours = (newHours + 2) % 24;
      setEndHours(newEndHours);
      setEndMinutes(newMinutes);
    }
  };

  return (
    <>
      <EventDateAndTimeInput
        date={date}
        setDate={handleStartDateChange}
        hours={hours}
        minutes={minutes}
        setTime={handleStartTimeChange}
        label="Event Start Date & Time"
        name="eventDateAndTime"
      />
      <div className="mt-4 flex items-center">
        <FormCheckbox
          id="set-ending"
          label="Set ending time"
          checked={showEndingInput}
          onCheckedChange={handleCheckboxChange}
        />
      </div>
      {showEndingInput && (
        <EventDateAndTimeInput
          date={endDate}
          setDate={setEndDate}
          hours={endHours}
          minutes={endMinutes}
          setTime={(newHours, newMinutes) => {
            setEndHours(newHours);
            setEndMinutes(newMinutes);
          }}
          label="Event End Date & Time"
          name="eventEndDateAndTime"
        />
      )}
    </>
  );
};

export default DateAndTimePickerContainer;
