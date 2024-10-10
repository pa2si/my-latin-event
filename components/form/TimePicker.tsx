import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoMdClose } from 'react-icons/io';

interface ModalProps {
  isVisible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isVisible, onClose, children }) => {
  const handleClickOutside = useCallback(
    (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('.modal-content')) return;
      onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (isVisible) {
      document.addEventListener('click', handleClickOutside);
    }
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isVisible, handleClickOutside]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="modal-content bg-white rounded-md p-4 w-80 relative">
        <button onClick={onClose} className="float-right text-red-500 text-2xl">
          <IoMdClose />
        </button>
        {children}
      </div>
    </div>
  );
};

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

  const hoursArray = Array.from({ length: 24 }, (_, i) => i);
  const minutesArray = Array.from({ length: 60 }, (_, i) => i);

  const activeOptionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (activePicker && activeOptionRef.current) {
      activeOptionRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [activePicker]);

  return (
    <>
      <div className="grid grid-flow-col text-center auto-cols-max border rounded-full p-4">
        {/* Hours */}
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
        {/* Minutes */}
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

      <Modal
        isVisible={activePicker !== null}
        onClose={() => setActivePicker(null)}
      >
        <AnimatePresence>
          {activePicker === 'hour' && (
            <motion.div
              className=" carousel carousel-vertical pt-10 rounded-box w-full bg-neutral-content overflow-y-auto"
              style={{ maxHeight: '240px' }}
              initial="closed"
              animate="open"
              exit="closed"
              variants={{
                open: {
                  opacity: 1,
                  height: 'auto',
                  transition: { duration: 0.3 },
                },
                closed: {
                  opacity: 0,
                  height: 0,
                  transition: { duration: 0.3 },
                },
              }}
            >
              <h3 className="bg-white absolute top-8 pb-2 left-0 right-0 text-muted-foreground mb-8 text-center text-lg font-semibold my-2">
                Choose an hour
              </h3>
              {hoursArray.map((h) => (
                <div
                  key={h}
                  ref={h === hours ? activeOptionRef : null}
                  className={`carousel-item h-10 flex justify-center items-center text-3xl cursor-pointer ${
                    h === hours ? 'text-primary' : 'hover:bg-gray-300'
                  }`}
                  onClick={() => {
                    setHours(h);
                    setTime(h, minutes); // Update the time when hours change
                    setActivePicker(null);
                  }}
                >
                  {h < 10 ? `0${h}` : h}
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {activePicker === 'minute' && (
            <motion.div
              className="carousel carousel-vertical rounded-box w-full bg-neutral-content overflow-y-auto"
              style={{ maxHeight: '240px' }}
              initial="closed"
              animate="open"
              exit="closed"
              variants={{
                open: {
                  opacity: 1,
                  height: 'auto',
                  transition: { duration: 0.3 },
                },
                closed: {
                  opacity: 0,
                  height: 0,
                  transition: { duration: 0.3 },
                },
              }}
            >
              <h3 className="bg-white absolute top-8 pb-2 left-0 right-0 text-muted-foreground mb-8 text-center text-lg font-semibold my-2">
                Choose a minute
              </h3>
              {minutesArray.map((m) => (
                <div
                  key={m}
                  ref={m === minutes ? activeOptionRef : null}
                  className={`carousel-item h-10 flex justify-center items-center text-3xl cursor-pointer ${
                    m === minutes ? 'text-primary' : 'hover:bg-gray-300'
                  }`}
                  onClick={() => {
                    setMinutes(m);
                    setTime(hours, m); // Update the time when minutes change
                    setActivePicker(null);
                  }}
                >
                  {m < 10 ? `0${m}` : m}
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </Modal>
    </>
  );
};

export default TimePicker;
