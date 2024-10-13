import React, { useState, useRef, useEffect } from "react";
import SelectModal from "./SelectModal";

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

  const showModalContent = () => {
    if (activePicker === "hour") {
      return (
        <div className="overflow-y-auto" style={{ maxHeight: "240px" }}>
          {Array.from({ length: 24 }).map((_, h) => (
            <div
              key={h}
              className={`flex h-10 cursor-pointer items-center justify-center text-3xl ${
                h === hours ? "text-primary" : "hover:bg-gray-300"
              }`}
              onClick={() => {
                setHours(h);
                setTime(h, minutes);
                setActivePicker(null);
              }}
            >
              {h < 10 ? `0${h}` : h}
            </div>
          ))}
        </div>
      );
    }
    if (activePicker === "minute") {
      return (
        <div className="overflow-y-auto" style={{ maxHeight: "240px" }}>
          {Array.from({ length: 60 }).map((_, m) => (
            <div
              key={m}
              className={`flex h-10 cursor-pointer items-center justify-center text-3xl ${
                m === minutes ? "text-primary" : "hover:bg-gray-300"
              }`}
              onClick={() => {
                setMinutes(m);
                setTime(hours, m);
                setActivePicker(null);
              }}
            >
              {m < 10 ? `0${m}` : m}
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <>
      <div className="flex items-center justify-center rounded-xl bg-foreground px-4 py-2 drop-shadow-lg">
        <div
          className="flex cursor-pointer flex-col items-center justify-center px-3 py-2"
          onClick={() => setActivePicker("hour")}
        >
          <span className="font-mono text-2xl font-bold text-background">
            {hours < 10 ? `0${hours}` : hours}
          </span>
          <p className="mt-1 text-xs text-gray-400">HH</p>
        </div>
        <div className="mx-1 pb-5 text-2xl font-bold text-background">:</div>
        <div
          className="flex cursor-pointer flex-col items-center justify-center px-3 py-2"
          onClick={() => setActivePicker("minute")}
        >
          <span className="font-mono text-2xl font-bold text-background">
            {minutes < 10 ? `0${minutes}` : minutes}
          </span>
          <p className="mt-1 text-xs text-gray-400">MM</p>
        </div>
      </div>

      {/* second ui option */}

      {/* <div className="grid auto-cols-max grid-flow-col gap-1 rounded-full p-4 text-center">
        <div
          className="bg-neutral rounded-box flex cursor-pointer flex-col rounded-xl bg-foreground/90 p-2 text-muted"
          onClick={() => setActivePicker("hour")}
          style={{ cursor: "pointer" }}
        >
          <span className="font-mono text-xl">
            {hours < 10 ? `0${hours}` : hours}
          </span>
          <p className="text-muted-foreground">HH</p>
        </div>
        <div
          className="bg-neutral rounded-box flex cursor-pointer flex-col rounded-xl bg-foreground/90 p-2 text-muted"
          onClick={() => setActivePicker("minute")}
          style={{ cursor: "pointer" }}
        >
          <span className="font-mono text-xl">
            {minutes < 10 ? `0${minutes}` : minutes}
          </span>
          <p className="text-muted-foreground">MM</p>
        </div>
      </div> */}

      <SelectModal
        isVisible={activePicker !== null}
        onClose={() => setActivePicker(null)}
        title={`Choose a ${activePicker === "hour" ? "hour" : "minute"}`}
      >
        {showModalContent()}
      </SelectModal>
    </>
  );
};

export default TimePicker;
