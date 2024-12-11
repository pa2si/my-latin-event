"use client"

import React, { useState } from 'react';
import Calendar from './Calendar';
import CalendarNavigation from './CalendarNavigation';
import { EventCardProps } from '@/utils/types';

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

    return (
        <div className="w-full px-4 md:py-8">
            <CalendarNavigation
                currentDate={currentDate}
                view={view}
                onNavigate={navigate}
                onToday={() => setCurrentDate(new Date())}
                onViewChange={setView}
            />
            <Calendar
                events={events}
                currentDate={currentDate}
                view={view}
                likeIds={likeIds}
                direction={direction}
            />
        </div>
    );
};

export default CalendarContainer;