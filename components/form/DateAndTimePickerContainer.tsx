"use client";

import React, { useEffect, useState } from "react";
import FormCheckbox from "./FormCheckbox";
import EventDateAndTimeInput from "./EventDateAndTimeInput";
import { motion, AnimatePresence } from "framer-motion";

const DateAndTimePickerContainer = ({
  defaultValue,
  defaultEndValue,
}: {
  defaultValue: Date | null;
  defaultEndValue?: Date | string | null;
}) => {
  const [date, setDate] = useState<Date | null>(defaultValue);
  const [hours, setHours] = useState<number>(
    defaultValue ? defaultValue.getHours() : 20,
  );
  const [minutes, setMinutes] = useState<number>(
    defaultValue ? defaultValue.getMinutes() : 0,
  );

  const [endDate, setEndDate] = useState<Date | null>(
    defaultEndValue && typeof defaultEndValue !== "string"
      ? defaultEndValue
      : null,
  );
  const [endHours, setEndHours] = useState<number>(
    defaultEndValue && typeof defaultEndValue !== "string"
      ? defaultEndValue.getHours()
      : (hours + 2) % 24, // Initialize with +2 hours
  );
  const [endMinutes, setEndMinutes] = useState<number>(
    defaultEndValue && typeof defaultEndValue !== "string"
      ? defaultEndValue.getMinutes()
      : minutes,
  );

  const [showEndingInput, setShowEndingInput] = useState(
    !!defaultEndValue && defaultEndValue !== "",
  );

  useEffect(() => {
    if (defaultValue) {
      setDate(defaultValue);
      setHours(defaultValue.getHours());
      setMinutes(defaultValue.getMinutes());
    }
    if (defaultEndValue && typeof defaultEndValue !== "string") {
      setEndDate(defaultEndValue);
      setEndHours(defaultEndValue.getHours());
      setEndMinutes(defaultEndValue.getMinutes());
    }
  }, [defaultValue, defaultEndValue]);

  const handleCheckboxChange = (checked: boolean) => {
    setShowEndingInput(checked);
    if (checked && date) {
      // If checked, set endDate to the start date and update the time +2 hours
      const newEndDate = new Date(date);
      const newEndHours = (hours + 2) % 24; // Use modulo to handle overflow past midnight

      // If adding 2 hours goes to the next day, increment the date
      if (hours + 2 >= 24) {
        newEndDate.setDate(newEndDate.getDate() + 1);
      }

      setEndDate(newEndDate);
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
      const newEndDate = new Date(newDate);
      // If current end time is less than start time + 2 hours, adjust it
      const totalStartMinutes = hours * 60 + minutes;
      const totalEndMinutes = endHours * 60 + endMinutes;

      if (totalEndMinutes <= totalStartMinutes) {
        const newEndHours = (hours + 2) % 24;
        if (hours + 2 >= 24) {
          newEndDate.setDate(newEndDate.getDate() + 1);
        }
        setEndHours(newEndHours);
        setEndMinutes(minutes);
      }
      setEndDate(newEndDate);
    }
  };

  const handleStartTimeChange = (newHours: number, newMinutes: number) => {
    setHours(newHours);
    setMinutes(newMinutes);
    if (showEndingInput) {
      // Ensure end time is at least 2 hours after start time
      const totalStartMinutes = newHours * 60 + newMinutes;
      const totalEndMinutes = endHours * 60 + endMinutes;

      if (totalEndMinutes <= totalStartMinutes) {
        const newEndHours = (newHours + 2) % 24;
        if (newHours + 2 >= 24 && endDate) {
          const newEndDate = new Date(endDate);
          newEndDate.setDate(newEndDate.getDate() + 1);
          setEndDate(newEndDate);
        }
        setEndHours(newEndHours);
        setEndMinutes(newMinutes);
      }
    }
  };

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div>
        <div className="">
          <EventDateAndTimeInput
            date={date}
            setDate={handleStartDateChange}
            hours={hours}
            minutes={minutes}
            setTime={handleStartTimeChange}
            label="Event Start Date & Time*"
            name="eventDateAndTime"
          />
        </div>
        <div className="mt-4 flex items-center text-muted-foreground">
          <FormCheckbox
            id="set-ending"
            label="Set ending time"
            checked={showEndingInput}
            onCheckedChange={handleCheckboxChange}
          />
        </div>
      </div>

      <AnimatePresence>
        {showEndingInput && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className=""
          >
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DateAndTimePickerContainer;
