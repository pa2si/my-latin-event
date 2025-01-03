import React from "react";
import { DatePicker } from "@/components/form/DatePicker";
import TimePicker from "./TimePicker";

interface EventDateAndTimeProps {
  date: Date | null;
  setDate: React.Dispatch<React.SetStateAction<Date | null>>;
  hours: number;
  minutes: number;
  setTime: (hours: number, minutes: number) => void;
  label: string;
  name: string;
}

const EventDateAndTimeInput: React.FC<EventDateAndTimeProps> = ({
  date,
  setDate,
  hours,
  minutes,
  setTime,
  label,
  name,
}) => {
  const combineDateAndTime = (
    date: Date | null,
    hour: number,
    minute: number,
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
    <div className="-2 flex flex-col gap-4">
      <div>
        <h3 className="mb-4 mt-8 text-lg font-medium">{label}</h3>
      </div>
      <div>
        <div className="flex flex-row items-center justify-center gap-4">
          <DatePicker setDate={setDate} initialDate={date} />
          <input
            type="hidden"
            name={name}
            value={combinedDateTime ? combinedDateTime.toISOString() : ""}
          />
          <TimePicker
            initialHours={hours}
            initialMinutes={minutes}
            setTime={setTime}
          />
        </div>
      </div>
    </div>
  );
};

export default EventDateAndTimeInput;
