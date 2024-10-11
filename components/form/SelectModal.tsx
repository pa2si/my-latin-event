'use client';

import { useCallback, useEffect } from 'react';
import { IoMdClose } from 'react-icons/io';
import { motion, AnimatePresence } from 'framer-motion';

interface ModalProps {
  isVisible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string; // Allow additional props like title for h3
}

const SelectModal: React.FC<ModalProps> = ({
  isVisible,
  onClose,
  children,
  title,
}) => {
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
        <h3 className="text-center text-lg font-semibold text-muted-foreground mb-6 bg-white">
          {title}
        </h3>
        <AnimatePresence>
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={{
              open: {
                opacity: 1,
                height: 'auto',
                transition: { duration: 0.3 },
              },
              closed: { opacity: 0, height: 0, transition: { duration: 0.3 } },
            }}
            className="mb-4"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SelectModal;
