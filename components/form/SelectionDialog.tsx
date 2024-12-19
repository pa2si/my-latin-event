import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";

interface SelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: React.ReactNode;
  width?: string;
  height?: string;
}

const SelectionDialog: React.FC<SelectionDialogProps> = ({
  open,
  onOpenChange,
  title,
  children,
  width = "w-80",
  height = "h-96",
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`top-[50%] ${width} ${height} p-0`}>
        <DialogHeader className="p-4 pb-0">
          <DialogTitle className="text-center text-lg text-muted-foreground font-antonio tracking-wide ">
            {title}
          </DialogTitle>
        </DialogHeader>
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="flex w-full flex-col items-center overflow-y-auto scroll-smooth p-4"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};

export default SelectionDialog;
