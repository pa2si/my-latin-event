'use client';

import { motion, AnimatePresence } from 'framer-motion';
import {
    format,
    startOfMonth,
    endOfMonth,
    eachDayOfInterval,
    startOfWeek,
    endOfWeek,
    parseISO,
} from 'date-fns';
import DayCard from './DayCard';
import { EventCardProps } from '@/utils/types';

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
    view: 'day' | 'week' | 'month';
    direction: number;
}

const Calendar = ({ events, likeIds, currentDate, view, direction }: CalendarProps) => {
    const days = eachDayOfInterval({
        start:
            view === 'day'
                ? currentDate
                : view === 'week'
                    ? startOfWeek(currentDate, { weekStartsOn: 1 })
                    : startOfMonth(currentDate),
        end:
            view === 'day'
                ? currentDate
                : view === 'week'
                    ? endOfWeek(currentDate, { weekStartsOn: 1 })
                    : endOfMonth(currentDate),
    });

    return (
        <AnimatePresence custom={direction} mode="wait">
            <motion.div
                key={`${currentDate.toString()}-${view}`}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                custom={direction}
                className="flex flex-wrap gap-4 justify-center"
            >
                {days.map((day) => {
                    const dayEvents = events.filter((event) => {
                        const eventDate = typeof event.eventDateAndTime === 'string'
                            ? parseISO(event.eventDateAndTime)
                            : event.eventDateAndTime;
                        return format(eventDate, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd');
                    });

                    return (
                        <DayCard
                            key={day.toString()}
                            day={day}
                            events={dayEvents}
                            likeIds={likeIds}
                            view={view}
                        />
                    );
                })}
            </motion.div>
        </AnimatePresence>
    );
};

export default Calendar;