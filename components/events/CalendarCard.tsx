"use client"

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import ModalCarousel from "./ModalCarousel";

interface CalendarCardProps {
  selectedDate?: Date;
  selectedDates?: Date[];
  mode?: "single" | "multiple";
  events?: {
    eventDateAndTime: Date | string;
    name: string;
    id: string;
    image: string;
  }[];
}

const CalendarCard = ({
  selectedDate,
  selectedDates,
  mode = "single",
  events,
}: CalendarCardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dayEvents, setDayEvents] = useState<
    Array<{
      name: string;
      id: string;
      image: string;
    }>
  >([]);

  const handleSelect = (day: Date) => {
    const eventsForDay = events?.filter(
      (event) =>
        new Date(event.eventDateAndTime).toDateString() === day.toDateString(),
    );

    if (eventsForDay && eventsForDay.length > 0) {
      setDayEvents(eventsForDay);
      setIsModalOpen(true);
    }
  };

  const modalImages = dayEvents.map(event => ({
    url: event.image,
    name: event.name,
    id: event.id
  }));

  return (
    <>
      <Card className="w-[17.5rem]">
        <CardContent className="p-4">
          {mode === "single" ? (
            <Calendar
              mode="single"
              selected={selectedDate}
              initialFocus
              classNames={{
                day_selected: "bg-primary text-primary-foreground",
              }}
            />
          ) : (
            <Calendar
              mode="multiple"
              selected={selectedDates}
              initialFocus
              classNames={{
                day_selected: "bg-primary text-primary-foreground",
              }}
              onDayClick={handleSelect}
            />
          )}
        </CardContent>
      </Card>

      <ModalCarousel
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        images={modalImages}
      />
    </>
  );
};

export default CalendarCard;