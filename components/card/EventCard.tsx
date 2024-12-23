import { format } from "date-fns";
import { EventCardProps } from "@/utils/types";
import LikeToggleButton from "./LikeToggleButton";

const EventCard = ({
  event,
  inSheet = false,
  likeId = null,
}: {
  event: EventCardProps;
  inSheet?: boolean;
  likeId?: string | null;
}) => {
  const {
    name,
    image,
    id: eventId,
    subtitle,
    eventDateAndTime,
    genres,
  } = event;

  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return format(d, "dd.MM.yyyy");
  };

  const CardContent = () => (
    <div className="group relative w-full">
      {/* Image Container with fixed aspect ratio */}
      <div className="relative overflow-hidden rounded-md">
        {/* Create 3:4 aspect ratio container */}
        <div className="relative pt-[133.33%]">
          <div className="absolute inset-0">
            <img
              src={image}
              alt={name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              style={{
                objectPosition: "50% 0%", // Align to top center
              }}
            />
          </div>

          {/* Like Button */}
          <div className="absolute right-2 top-2 z-10">
            <LikeToggleButton eventId={eventId} likeId={likeId} />
          </div>

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          {/* Content Overlay */}
          <div className="absolute inset-x-0 bottom-0 translate-y-2 p-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            {/* Date */}
            <div className="mb-2 text-sm text-white/90">
              {formatDate(eventDateAndTime)}
            </div>

            {/* Title and Subtitle */}
            <h3 className="mb-2 font-anton text-lg font-semibold capitalize leading-tight tracking-wide text-white">
              {name}
            </h3>
            {subtitle && (
              <p className="mb-2 line-clamp-2 text-sm text-white/90">
                {subtitle}
              </p>
            )}

            {/* Location */}
            <div className="mb-2 text-sm capitalize text-white/90">
              @ {event.location}
            </div>

            {/* Genres */}
            {genres && genres.length > 0 && (
              <div className="mt-auto flex flex-wrap gap-1">
                {genres.map((genre, index) => (
                  <span
                    key={index}
                    className="rounded-full bg-primary px-2 py-0.5 text-xs text-white backdrop-blur-sm"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  if (inSheet) {
    return <CardContent />;
  }

  return (
    <a href={`/events/${eventId}`} className="block">
      <CardContent />
    </a>
  );
};

export default EventCard;
