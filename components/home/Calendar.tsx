"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  startOfWeek,
  endOfWeek,
  parseISO,
  getDay,
  subMonths,
  lastDayOfMonth,
} from "date-fns";
import DayCard from "./DayCard";
import { EventCardProps } from "@/utils/types";

const containerVariants = {
  hidden: (direction: number) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0,
  }),
  visible: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.3 },
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -1000 : 1000,
    opacity: 0,
    transition: { duration: 0.3 },
  }),
};

interface CalendarProps {
  events: EventCardProps[];
  likeIds: Record<string, string | null>;
  currentDate: Date;
  view: "day" | "week" | "month";
  direction: number;
}

interface CalendarDay {
  date: Date;
  isPreviousMonth: boolean;
}

// Update screen size hook name and comment
const useScreenSize = () => {
  const [isSmOrAbove, setIsSmOrAbove] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmOrAbove(window.innerWidth >= 640); // sm breakpoint is 640px
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  return isSmOrAbove;
};

const Calendar = ({
  events,
  likeIds,
  currentDate,
  view,
  direction,
}: CalendarProps) => {
  const isSmOrAbove = useScreenSize();
  const days = eachDayOfInterval({
    start:
      view === "day"
        ? currentDate
        : view === "week"
          ? startOfWeek(currentDate, { weekStartsOn: 1 })
          : startOfMonth(currentDate),
    end:
      view === "day"
        ? currentDate
        : view === "week"
          ? endOfWeek(currentDate, { weekStartsOn: 1 })
          : endOfMonth(currentDate),
  }).map((date) => ({ date, isPreviousMonth: false }));

  const renderMonthGrid = (): CalendarDay[] => {
    if (view !== "month") return days;

    // Only add previous month days for sm screens and above
    if (!isSmOrAbove) return days;

    const firstDayOfMonth = startOfMonth(currentDate);
    let dayOfWeek = getDay(firstDayOfMonth);
    dayOfWeek = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

    // Get the days from previous month that should appear
    const previousMonth = subMonths(currentDate, 1);
    const lastDayPrevMonth = lastDayOfMonth(previousMonth);
    const previousMonthDays: CalendarDay[] = Array.from(
      { length: dayOfWeek },
      (_, i) => {
        const day = new Date(lastDayPrevMonth);
        day.setDate(lastDayPrevMonth.getDate() - (dayOfWeek - 1 - i));
        return { date: day, isPreviousMonth: true };
      },
    );

    return [...previousMonthDays, ...days];
  };

  return (
    <AnimatePresence custom={direction} mode="wait">
      <motion.div
        key={`${currentDate.toString()}-${view}`}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        custom={direction}
        className={`flex flex-wrap justify-center gap-3 xl:mx-auto ${
          view === "month" ? "xl:grid xl:grid-cols-7 xl:gap-3" : ""
        }`}
      >
        {renderMonthGrid().map((day, index) => {
          const dayEvents = events.filter((event) => {
            const eventDate =
              typeof event.eventDateAndTime === "string"
                ? parseISO(event.eventDateAndTime)
                : event.eventDateAndTime;
            return (
              format(eventDate, "yyyy-MM-dd") === format(day.date, "yyyy-MM-dd")
            );
          });

          return (
            <DayCard
              key={day.date.toString()}
              day={day.date}
              events={dayEvents}
              likeIds={likeIds}
              view={view}
              isPreviousMonth={day.isPreviousMonth}
            />
          );
        })}
      </motion.div>
    </AnimatePresence>
  );
};

export default Calendar;
