"use client";

import * as React from "react";
import { format, isBefore, startOfToday } from "date-fns"; // import isBefore and startOfToday
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerProps {
  setDate: React.Dispatch<React.SetStateAction<Date | null>>;
  initialDate?: Date | null;
}

export function DatePicker({ setDate, initialDate }: DatePickerProps) {
  const [date, setLocalDate] = React.useState<Date | undefined>(
    initialDate || undefined,
  );
  const [open, setOpen] = React.useState(false);

  const handleDateChange = (selectedDate: Date | undefined) => {
    setLocalDate(selectedDate);
    setDate(selectedDate || null);
    setOpen(false);
  };

  // Disable past dates
  const today = startOfToday();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-60 justify-start text-left font-normal",
            !date && "text-muted-foreground",
          )}
          onClick={() => setOpen(true)}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleDateChange}
          disabled={(date) => isBefore(date, today)}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
