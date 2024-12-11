import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { getWeek, format } from 'date-fns';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface CalendarNavigationProps {
  currentDate: Date;
  view: 'day' | 'week' | 'month';
  onNavigate: (dir: number) => void;
  onToday: () => void;
  onViewChange: (view: 'day' | 'week' | 'month') => void;
}

const getNavigationDisplay = (date: Date, view: 'day' | 'week' | 'month') => {
  switch (view) {
    case 'day':
      return format(date, 'EEE, MMM dd, yyyy');
    case 'week':
      return `Week ${getWeek(date)}, ${format(date, 'yyyy')}`;
    case 'month':
      return format(date, 'MMMM yyyy');
    default:
      return format(date, 'MMMM yyyy');
  }
};

const getTooltipText = (view: 'day' | 'week' | 'month') => {
  switch (view) {
    case 'day':
      return 'Go to current day';
    case 'week':
      return 'Go to current week';
    case 'month':
      return 'Go to current month';
  }
};

const CalendarNavigation = ({
  currentDate,
  view,
  onNavigate,
  onToday,
  onViewChange,
}: CalendarNavigationProps) => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
    <div className="flex items-center gap-4">
      <Button variant="outline" size="icon" onClick={() => onNavigate(-1)}>
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={onToday}
            >
              <CalendarIcon className="h-4 w-4" />
              {getNavigationDisplay(currentDate, view)}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{getTooltipText(view)}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <Button variant="outline" size="icon" onClick={() => onNavigate(1)}>
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>

    <div className="flex gap-2">
      <Button
        variant={view === 'day' ? 'default' : 'outline'}
        onClick={() => onViewChange('day')}
        className="flex-1 sm:flex-none"
      >
        Day
      </Button>
      <Button
        variant={view === 'week' ? 'default' : 'outline'}
        onClick={() => onViewChange('week')}
        className="flex-1 sm:flex-none"
      >
        Week
      </Button>
      <Button
        variant={view === 'month' ? 'default' : 'outline'}
        onClick={() => onViewChange('month')}
        className="flex-1 sm:flex-none"
      >
        Month
      </Button>
    </div>
  </div>
);

export default CalendarNavigation;