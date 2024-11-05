import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";

interface CalendarCardProps {
  selectedDate: Date;
}

const CalendarCard = ({ selectedDate }: CalendarCardProps) => {
  return (
    <Card>
      <CardContent className="p-4">
        <Calendar
          mode="single"
          selected={selectedDate}
          initialFocus
          disabled={true}
          classNames={{
            day_selected: "bg-primary text-primary-foreground",
          }}
        />
      </CardContent>
    </Card>
  );
};

export default CalendarCard;
