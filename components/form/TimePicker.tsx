import React, { useState, useRef, useEffect } from 'react';
import SelectModal from './SelectModal';

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
  const [activePicker, setActivePicker] = useState<'hour' | 'minute' | null>(
    null
  );

  const showModalContent = () => {
    if (activePicker === 'hour') {
      return (
        <div className=" overflow-y-auto" style={{ maxHeight: '240px' }}>
          {Array.from({ length: 24 }).map((_, h) => (
            <div
              key={h}
              className={`carousel-item h-10 flex justify-center items-center text-3xl cursor-pointer ${
                h === hours ? 'text-primary' : 'hover:bg-gray-300'
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
    if (activePicker === 'minute') {
      return (
        <div
          className="carousel carousel-vertical overflow-y-auto"
          style={{ maxHeight: '240px' }}
        >
          {Array.from({ length: 60 }).map((_, m) => (
            <div
              key={m}
              className={`carousel-item h-10 flex justify-center items-center text-3xl cursor-pointer ${
                m === minutes ? 'text-primary' : 'hover:bg-gray-300'
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
      <div className="grid grid-flow-col text-center auto-cols-max border rounded-full p-4">
        <div
          className="flex flex-col p-2 bg-neutral rounded-box text-neutral-content cursor-pointer"
          onClick={() => setActivePicker('hour')}
          style={{ cursor: 'pointer' }}
        >
          <span className="countdown font-mono text-2xl">
            {hours < 10 ? `0${hours}` : hours}
          </span>
          <p className="text-muted-foreground">HH</p>
        </div>
        <div
          className="flex flex-col p-2 bg-neutral rounded-box text-neutral-content cursor-pointer"
          onClick={() => setActivePicker('minute')}
          style={{ cursor: 'pointer' }}
        >
          <span className="countdown font-mono text-2xl">
            {minutes < 10 ? `0${minutes}` : minutes}
          </span>
          <p className="text-muted-foreground">MM</p>
        </div>
      </div>

      <SelectModal
        isVisible={activePicker !== null}
        onClose={() => setActivePicker(null)}
        title={`Choose a ${activePicker === 'hour' ? 'hour' : 'minute'}`}
      >
        {showModalContent()}
      </SelectModal>
    </>
  );
};

export default TimePicker;
