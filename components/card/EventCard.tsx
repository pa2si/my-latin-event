import Image from "next/image";
import Link from "next/link";
import CountryFlagAndName from "./CountryFlagAndName";
import EventRating from "./EventRating";
import LikeToggleButton from "./LikeToggleButton";
import { EventCardProps } from "@/utils/types";
import { formatCurrency } from "@/utils/format";
import { findCountryByName } from "@/utils/countries";

const EventCard = ({ event }: { event: EventCardProps }) => {
  const { name, image, price, country, id: eventId, subtitle } = event;

  return (
    <article className="group relative">
      <Link href={`/events/${eventId}`}>
        <div className="relative mb-2 h-[300px] overflow-hidden rounded-md">
          <Image
            src={image}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw"
            alt={name}
            className="transform rounded-md object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>
        <div className="flex items-center justify-between">
          <h3 className="mt-1 text-sm font-semibold">
            {name.substring(0, 30)}
          </h3>
          {/* event rating */}
          <EventRating inPage={false} eventId={eventId} />
        </div>
        {subtitle && (
          <p className="mt-1 text-sm text-muted-foreground">
            {subtitle.substring(0, 40)}
          </p>
        )}
        <div className="mt-1 flex items-center justify-between">
          <p className="mt-1 text-sm">
            <span className="font-semibold">{formatCurrency(price)} </span>
            night
          </p>
          {/* country flag */}
          <CountryFlagAndName country={country} />
        </div>
      </Link>
      <div className="z-5 absolute right-5 top-5">
        {/* like toggle button*/}
        <LikeToggleButton eventId={eventId} />
      </div>
    </article>
  );
};
export default EventCard;
