import Image from "next/image";
import Link from "next/link";
import LikeToggleButton from "./LikeToggleButton";
import { EventCardProps } from "@/utils/types";

const EventCard = ({
  event,
  inSheet = false,
  likeId = null
}: {
  event: EventCardProps;
  inSheet?: boolean;
  likeId?: string | null;
}) => {
  const { name, image, id: eventId, subtitle, eventDateAndTime } = event;

  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}.${month}.${year}`;
  };

  const CardContent = () => (
    <div className="group relative">
      <div className="relative mb-2 h-[300px] overflow-hidden rounded-md">
        <Image
          src={image}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw"
          alt={name}
          className="transform rounded-md object-cover transition-transform duration-500 group-hover:scale-110"
          unoptimized
        />
      </div>
      <div className="flex items-center justify-between">
        <h3 className="mt-1 text-sm font-semibold flex-1">
          {name.length > 27 ? name.substring(0, 27) + '...' : name}
        </h3>
        <span className="ml-2 mt-1 text-sm text-muted-foreground whitespace-nowrap">
          {formatDate(eventDateAndTime)}
        </span>
      </div>
      {subtitle && (
        <p className="mt-1 text-sm text-muted-foreground">
          {subtitle.length > 40 ? subtitle.substring(0, 40) + '...' : subtitle}
        </p>
      )}
      <div className="mt-1 flex items-center justify-between">
      </div>
      <div className="z-5 absolute right-5 top-5">
        <LikeToggleButton eventId={eventId} likeId={likeId} />
      </div>
    </div>
  );

  if (inSheet) {
    return <CardContent />;
  }

  return (
    <Link href={`/events/${eventId}`}>
      <CardContent />
    </Link>
  );
};

export default EventCard;
