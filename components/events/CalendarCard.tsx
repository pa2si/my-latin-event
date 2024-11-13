"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";

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
  const [dayEvents, setDayEvents] = useState<
    Array<{
      name: string;
      id: string;
      image: string;
    }>
  >([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-h-[90vh] max-w-[90vw] border-none bg-transparent p-0">
          <Carousel className="w-full max-w-[90vw]">
            <CarouselContent>
              {dayEvents.map((event) => (
                <CarouselItem key={event.id}>
                  <div className="relative h-[80vh] w-full">
                    <Image
                      src={event.image}
                      fill
                      sizes="90vw"
                      alt={event.name}
                      className="rounded-md object-contain"
                      priority
                      unoptimized
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            {dayEvents.length > 1 && (
              <>
                <CarouselPrevious className="left-4" />
                <CarouselNext className="right-4" />
              </>
            )}
          </Carousel>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CalendarCard;
