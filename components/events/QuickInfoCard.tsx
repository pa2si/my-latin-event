import { Card, CardContent } from "@/components/ui/card";
import { CalendarIcon, Clock, Music, Ticket } from "lucide-react";
import { parseISO } from "date-fns";

interface QuickInfoCardProps {
  date: string;
  time: string;
  endTime?: string;
  price: string;
  currency: string;
  genres: string[];
  daysMessage: string;
}

export const QuickInfoCard = ({
  date,
  time,
  endTime,
  price,
  currency,
  genres,
  daysMessage,
}: QuickInfoCardProps) => {
  const today = new Date();
  const eventDate = parseISO(date);

  return (
    <Card className="mt-6 text-lg">
      <CardContent className="grid grid-cols-2 gap-4 p-6 md:grid-cols-4">
        <div className="flex flex-col gap-2">
          <CalendarIcon className="h-5 w-5 text-primary" />
          <h3 className="font-antonio text-[19px] font-bold tracking-wider">
            Date
          </h3>
          <div className="flex flex-col gap-1">
            <p className="text-[1.05rem] text-muted-foreground">{date}</p>
            <p className="text-xs font-medium text-primary">{daysMessage}</p>
          </div>
        </div>

        {/* Duration */}
        <div className="flex flex-col gap-2">
          <Clock className="h-5 w-5 text-primary" />
          <h3 className="font-antonio text-[19px] font-bold tracking-wider">
            {endTime ? "Duration" : "Start"}
          </h3>
          <p className="text-[1.05rem] text-muted-foreground">
            {time} {endTime && `- ${endTime}`}
          </p>
        </div>

        {/* Price */}
        <div className="flex flex-col gap-2">
          <Ticket className="h-5 w-5 text-primary" />
          <h3 className="font-antonio text-[19px] font-bold tracking-wider">
            Price
          </h3>
          <p className="text-[1.05rem] text-muted-foreground">
            {price === "Free" || price === "Donation"
              ? price
              : `${price} ${currency}`}
          </p>
        </div>

        {/* Genres */}
        <div className="flex flex-col gap-2">
          <Music className="h-5 w-5 text-primary" />
          <h3 className="font-antonio text-[19px] font-bold tracking-wider">
            Genres
          </h3>
          <p className="text-[1.05rem] text-muted-foreground">
            {genres.join(", ")}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
