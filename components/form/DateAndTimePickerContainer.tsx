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
      : hours,
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
      // If checked, set endDate to the start date and update the time
      setEndDate(new Date(date));
      setEndHours(hours);
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
      setEndHours(newHours);
      setEndMinutes(newMinutes);
    }
  };

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div>
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
      </div>

      {/* End Date and Time Input conditionally rendered */}
      <AnimatePresence>
        {showEndingInput && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
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
