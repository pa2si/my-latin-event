"use client";

import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon } from "lucide-react";
import { useState } from "react";
import CalendarCard from "@/components/events/CalendarCard";
import { usePathname } from 'next/navigation';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
  const pathname = usePathname();

  const getTooltipText = () => {
    switch (pathname) {
      case '/liked/events':
        return 'See dates with liked events';
      case '/followed/organizers/events':
        return 'See dates with events from your followed organizers';
      default:
        return 'See all event dates';
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 sm:bottom-8 sm:right-8">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 rounded-full bg-primary text-secondary shadow-lg transition-colors duration-200 hover:bg-primary/80 sm:h-12 sm:w-12"
                >
                  <CalendarIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </PopoverTrigger>
            </TooltipTrigger>
            <TooltipContent>
              <p>{getTooltipText()}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <PopoverContent
          className="w-auto p-0 border-0 shadow-none"
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