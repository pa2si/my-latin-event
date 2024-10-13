import { CalendarIcon, Clock } from "lucide-react";
import React from "react";

interface EventDateAndTimeProps {
  formattedDate: string | null;
  formattedTime: string | null;
  isStartDate: boolean;
}

const EventDateAndTime = ({
  formattedDate,
  formattedTime,
  isStartDate,
}: EventDateAndTimeProps) => {
  return (
    <div>
      <p className="flex items-center text-sm text-gray-500">
        {/* Show CalendarIcon only if it's the start date */}
        {isStartDate && formattedDate && (
          <CalendarIcon className="mr-1" size={16} />
        )}
        {/* Conditionally render "until" for end date */}
        {!isStartDate && formattedDate && <p className="mr-2">- </p>}
        {formattedDate}
      </p>

      <p className="flex items-center text-sm text-gray-500">
        {/* Show Clock icon only for start time */}
        {isStartDate && formattedTime && <Clock className="mr-1" size={16} />}
        {/* Conditionally render "until" for end date */}
        {!isStartDate && formattedTime && <p className="mr-2">- </p>}
        {formattedTime}
      </p>
    </div>
  );
};

export default EventDateAndTime;
