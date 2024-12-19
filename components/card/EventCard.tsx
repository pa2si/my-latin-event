import { format } from 'date-fns';
import { EventCardProps } from "@/utils/types";
import LikeToggleButton from "./LikeToggleButton";

const EventCard = ({
  event,
  inSheet = false,
  likeId = null
}: {
  event: EventCardProps;
  inSheet?: boolean;
  likeId?: string | null;
}) => {
  const { name, image, id: eventId, subtitle, eventDateAndTime, genres } = event;

  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return format(d, 'dd.MM.yyyy');
  };

  const CardContent = () => (
    <div className="group relative w-full">
      {/* Image Container with fixed aspect ratio */}
      <div className="relative rounded-md overflow-hidden">
        {/* Create 3:4 aspect ratio container */}
        <div className="relative pt-[133.33%]">
          <div className="absolute inset-0">
            <img
              src={image}
              alt={name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              style={{
                objectPosition: '50% 0%' // Align to top center
              }}
            />
          </div>

          {/* Like Button */}
          <div className="absolute right-2 top-2 z-10">
            <LikeToggleButton eventId={eventId} likeId={likeId} />
          </div>

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Content Overlay */}
          <div className="absolute inset-x-0 bottom-0 p-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
            {/* Date */}
            <div className="text-white/90 text-sm mb-2">
              {formatDate(eventDateAndTime)}
            </div>

            {/* Title and Subtitle */}
            <h3 className="text-white font-semibold text-lg leading-tight mb-2 capitalize font-anton tracking-wide">
              {name}
            </h3>
            {subtitle && (
              <p className="text-white/90 text-sm mb-2 line-clamp-2 ">
                {subtitle}
              </p>
            )}

            {/* Location */}
            <div className="text-white/90 text-sm mb-2 capitalize">
              @ {event.location}
            </div>

            {/* Genres */}
            {genres && genres.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-auto">
                {genres.map((genre, index) => (
                  <span
                    key={index}
                    className="text-xs text-white bg-primary px-2 py-0.5 rounded-full backdrop-blur-sm"
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