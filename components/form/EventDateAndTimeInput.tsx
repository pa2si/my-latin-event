import React from "react";
import { DatePicker } from "@/components/form/DatePicker";
import TimePicker from "./TimePicker";
import { Clock } from "lucide-react";
import TitleHThree from "../shared/TitleHThree";

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

      <div className="flex items-center mt-8 gap-2 mb-4">
        <Clock className="h-5 w-5" />
        <TitleHThree text={label} />
        {/* <h3 className="text-lg font-medium">{label}</h3> */}
      </div>
      <div>
        <div className="flex flex-col items-center gap-4 sm:flex-row">
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
