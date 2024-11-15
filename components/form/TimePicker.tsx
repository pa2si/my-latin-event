"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import SelectionDialog from "@/components/form/SelectionDialog";

interface TimePickerProps {
  initialHours: number;
  initialMinutes: number;
  setTime: (hours: number, minutes: number) => void;
}

const TimePicker: React.FC<TimePickerProps> = ({
  initialHours,
  initialMinutes,
  setTime,
}) => {
  const [hours, setHours] = useState<number>(initialHours);
  const [minutes, setMinutes] = useState<number>(initialMinutes);
  const [activePicker, setActivePicker] = useState<"hour" | "minute" | null>(
    null,
  );

  const handleTimeSelection = (value: number) => {
    if (activePicker === "hour") {
      setHours(value);
      setTime(value, minutes);
    } else {
      setMinutes(value);
      setTime(hours, value);
    }
    setActivePicker(null);
  };

  const renderContent = () => {
    const length = activePicker === "hour" ? 24 : 60;
    const currentValue = activePicker === "hour" ? hours : minutes;

    return Array.from({ length }).map((_, index) => (
      <div
        key={index}
        className={cn(
          "flex h-10 w-full cursor-pointer items-center justify-center rounded text-2xl hover:bg-gray-100",
          index === currentValue && "text-primary",
        )}
        onClick={() => handleTimeSelection(index)}
      >
        {index < 10 ? `0${index}` : index}
      </div>
    ));
  };

  return (
    <>
      <div className="flex items-center justify-center rounded-xl bg-foreground px-2 py-1 drop-shadow-lg">
        <div
          className="flex cursor-pointer flex-col items-center justify-center px-1 py-2"
          onClick={() => setActivePicker("hour")}
        >
          <span className="font-mono text-xl font-bold text-background">
            {hours < 10 ? `0${hours}` : hours}
          </span>
          <p className="mt-1 text-xs text-gray-400">HH</p>
        </div>
        <div className="text mx-1 pb-5 font-bold text-background">:</div>
        <div
          className="flex cursor-pointer flex-col items-center justify-center px-1 py-2"
          onClick={() => setActivePicker("minute")}
        >
          <span className="font-mono text-xl font-bold text-background">
            {minutes < 10 ? `0${minutes}` : minutes}
          </span>
          <p className="mt-1 text-xs text-gray-400">MM</p>
        </div>
      </div>

      <SelectionDialog
        open={activePicker !== null}
        onOpenChange={(open) => !open && setActivePicker(null)}
        title={`Choose a ${activePicker === "hour" ? "hour" : "minute"}`}
      >
        {renderContent()}
      </SelectionDialog>
    </>
  );
};

export default TimePicker;
