// components/events/cards/EventDetailsCard.tsx
import { MapPin } from "lucide-react";
import { FaMusic } from "react-icons/fa";
import { AudioLines } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import CountryFlagAndName from "@/components/card/CountryFlagAndName";

interface StyleItem {
  name: string;
  selected: boolean;
}

interface EventDetailsCardProps {
  location: string;
  street: string;
  postalCode?: string;
  city: string;
  country: string;
  googleMapsLink?: string;
  styles: StyleItem[]; // Updated to accept StyleItem[] directly
}

const EventDetailsCard = ({
  location,
  street,
  postalCode,
  city,
  country,
  googleMapsLink,
  styles,
}: EventDetailsCardProps) => {
  // Filter for selected styles
  const selectedStyles = styles.filter((style) => style.selected);

  return (
    <div className="mt-8">
      <h2 className="mb-4 text-2xl font-bold">Event Details</h2>
      <div className="grid gap-8 md:grid-cols-2">
        {/* Location Info */}
        <div className="space-y-4">
          <h3 className="flex items-center gap-2 text-lg font-semibold">
            <MapPin className="h-5 w-5 text-primary" />
            Location Details
          </h3>
          <div className="space-y-2 text-muted-foreground">
            <p>{location}</p>
            <p>{street}</p>
            <p>
              {postalCode} {city}
            </p>
            <CountryFlagAndName country={country} />
          </div>
          {googleMapsLink && (
            <Button variant="outline" className="mt-2" asChild>
              <a
                href={googleMapsLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                View on Google Maps
              </a>
            </Button>
          )}
        </div>

        {/* Styles */}
        {selectedStyles.length > 0 && (
          <div className="space-y-4">
            <h3 className="flex items-center gap-2 text-lg font-semibold">
              <FaMusic className="h-5 w-5 text-primary" />
              You will listen to:
            </h3>
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2">
                {selectedStyles.map((style) => (
                  <Badge
                    key={style.name}
                    variant="default"
                    className="flex gap-2 bg-primary/90 text-primary-foreground"
                  >
                    <AudioLines className="w-5" />
                    <p className="text-xs">{style.name}</p>
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventDetailsCard;