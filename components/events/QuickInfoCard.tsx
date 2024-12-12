// components/events/cards/QuickInfoCard.tsx
import { Card, CardContent } from "@/components/ui/card";
import { CalendarIcon, Clock, EuroIcon, Music } from "lucide-react";

interface QuickInfoCardProps {
  date: string;
  time: string;
  endTime?: string;
  price: number;
  genres: string[];
}

export const QuickInfoCard = ({
  date,
  time,
  endTime,
  price,
  genres,
}: QuickInfoCardProps) => {
  return (
    <Card className="mt-6">
      <CardContent className="grid grid-cols-2 gap-4 p-6 md:grid-cols-4">
        {/* Date */}
        <div className="flex flex-col gap-2">
          <CalendarIcon className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">Date</h3>
          <p className="text-sm text-muted-foreground">{date}</p>
        </div>

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
          <p className="text-sm text-muted-foreground">{price}</p>
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
