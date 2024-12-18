import { Card, CardContent } from "@/components/ui/card";
import { CalendarIcon, Clock, EuroIcon, Music } from "lucide-react";
import { differenceInDays, parseISO } from "date-fns";

interface QuickInfoCardProps {
  date: string;
  time: string;
  endTime?: string;
  price: string; // Changed from number to string
  genres: string[];
  daysMessage: string;
}

export const QuickInfoCard = ({
  date,
  time,
  endTime,
  price,
  genres,
  daysMessage,
}: QuickInfoCardProps) => {
  const today = new Date();
  const eventDate = parseISO(date);

  return (
    <Card className="mt-6">
      <CardContent className="grid grid-cols-2 gap-4 p-6 md:grid-cols-4">
        <div className="flex flex-col gap-2">
          <CalendarIcon className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">Date</h3>
          <div className="flex flex-col gap-1">
            <p className="text-sm text-muted-foreground">{date}</p>
            <p className="text-xs text-primary font-medium">{daysMessage}</p>
          </div>
        </div>

        {/* Rest of the component remains the same */}
        {/* Duration */}
        <div className="flex flex-col gap-2">
          <Clock className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">{endTime ? "Duration" : "Start"}</h3>
          <p className="text-sm text-muted-foreground">
            {time} {endTime && `- ${endTime}`}
          </p>
        </div>

        {/* Price */}
        <div className="flex flex-col gap-2">
          <EuroIcon className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">Price</h3>
          <p className="text-sm text-muted-foreground">
            {price === "Free" || price === "Donation" ? price : `${price}€`}
          </p>
        </div>

        {/* Genres */}
        <div className="flex flex-col gap-2">
          <Music className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">Genres</h3>
          <p className="text-sm text-muted-foreground">{genres.join(", ")}</p>
        </div>
      </CardContent>
    </Card>
  );
};