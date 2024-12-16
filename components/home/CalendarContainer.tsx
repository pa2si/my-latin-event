"use client"

import React, { useState } from 'react';
import Calendar from './Calendar';
import CalendarNavigation from './CalendarNavigation';
import CalendarToggleBtn from '@/components/events/CalendarToggleBtn';
import { EventCardProps } from '@/utils/types';
import { motion, AnimatePresence } from 'framer-motion';

const CalendarContainer = ({
    events = [],
    likeIds = {}
}: {
    events: EventCardProps[],
    likeIds: Record<string, string | null>
}) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [view, setView] = useState<'day' | 'week' | 'month'>('month');
    const [direction, setDirection] = useState(0);
    const [showCalendar, setShowCalendar] = useState(true);

    const navigate = (dir: number) => {
        setDirection(dir);
        const newDate = new Date(currentDate);
        switch (view) {
            case 'day':
                newDate.setDate(currentDate.getDate() + dir);
                break;
            case 'week':
                newDate.setDate(currentDate.getDate() + (dir * 7));
                break;
            case 'month':
                newDate.setMonth(currentDate.getMonth() + dir);
                break;
        }
        setCurrentDate(newDate);
    };

    // Convert eventDateAndTime to Date if it is a string
    const processedEvents = events.map(event => ({
        ...event,
        eventDateAndTime: typeof event.eventDateAndTime === 'string' ? new Date(event.eventDateAndTime) : event.eventDateAndTime
    }));

    return (
        <AnimatePresence mode="wait">
            <div className="relative">
                {/* Calendar Toggle Button */}
                <div className="fixed bottom-4 right-4 z-50 sm:bottom-8 sm:right-8">
                    <CalendarToggleBtn events={processedEvents} />
                </div>

                {showCalendar && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="w-full px-4 md:py-8"
                    >
                        <CalendarNavigation
                            currentDate={currentDate}
                            view={view}
                            onNavigate={navigate}
                            onToday={() => setCurrentDate(new Date())}
                            onViewChange={setView}
                        />
                        <Calendar
                            events={processedEvents}
                            currentDate={currentDate}
                            view={view}
                            likeIds={likeIds}
                            direction={direction}
                        />
                    </motion.div>
                )}
            </div>
        </AnimatePresence>
    );
};

export default CalendarContainer;