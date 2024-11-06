"use client";

import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon } from "lucide-react";
import { useState } from "react";
import CalendarCard from "@/components/events/CalendarCard";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface CalendarToggleBtnProps {
  events: {
    eventDateAndTime: Date;
    name: string;
    id: string;
    image: string;
  }[];
}

const CalendarToggleBtn = ({ events }: CalendarToggleBtnProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-50 sm:bottom-8 sm:right-8">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="h-10 w-10 rounded-full bg-primary text-secondary shadow-lg transition-colors duration-200 hover:bg-primary/80 sm:h-12 sm:w-12"
          >
            <CalendarIcon className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-0"
          align="end"
          alignOffset={-40}
          sideOffset={16}
        >
          <div className="p-2">
            <CalendarCard
              mode="multiple"
              selectedDates={events.map(
                (event) => new Date(event.eventDateAndTime),
              )}
              events={events}
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default CalendarToggleBtn;
