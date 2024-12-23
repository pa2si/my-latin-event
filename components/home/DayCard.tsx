import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { format, isToday as isDateToday } from "date-fns";
import { Upload, ListFilter } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { EventCardProps } from "@/utils/types";
import EventCard from "../card/EventCard";

// Props for DayCard component
interface DayCardProps {
  day: Date;
  likeIds: Record<string, string | null>;
  events: EventCardProps[];
  view: "day" | "week" | "month";
  isPreviousMonth?: boolean;
}

const HoverOverlay = ({
  event,
  view,
}: {
  event: EventCardProps;
  view: "day" | "week" | "month";
}) => {
  const displayedGenres =
    view === "month" ? event.genres?.slice(0, 1) : event.genres;
  const remainingGenres =
    view === "month" ? (event.genres?.length || 0) - 1 : 0;

  return (
    <>
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="absolute inset-x-0 bottom-0 translate-y-2 p-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
        <h3
          className={`font-anton capitalize tracking-wide text-white ${
            view === "day"
              ? "mb-3 text-xl md:text-2xl"
              : view === "month"
                ? "mb-2 text-lg"
                : "mb-2 text-sm md:text-xl"
          }`}
        >
          {event.name}
        </h3>
        <div
          className={`block capitalize text-white/90 sm:hidden lg:block ${
            view === "day" ? "mb-3 text-base md:text-lg" : "mb-2 text-xs"
          }`}
        >
          @ {event.location}
        </div>
        {displayedGenres && displayedGenres.length > 0 && (
          <div className="flex flex-wrap gap-1 sm:hidden lg:flex">
            {displayedGenres.map((genre, index) => (
              <span
                key={index}
                className={`rounded-full bg-primary px-2 py-0.5 text-white backdrop-blur-sm ${
                  view === "day" ? "text-sm md:text-[0.9rem]" : "text-xs"
                }`}
              >
                {genre}
              </span>
            ))}
            {remainingGenres > 0 && (
              <span
                className={`rounded-full bg-primary/80 px-2 py-0.5 text-white backdrop-blur-sm ${
                  view === "day" ? "text-sm md:text-base" : "text-xs"
                }`}
              >
                +{remainingGenres}
              </span>
            )}
          </div>
        )}
      </div>
    </>
  );
};

const MultiEventOverlay = ({
  events,
  view,
}: {
  events: EventCardProps[];
  view: "week" | "month";
}) => (
  <>
    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    <div className="absolute inset-x-0 bottom-0 translate-y-2 p-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
      <div className="mb-2 flex items-center gap-2 text-sm text-white/90">
        <ListFilter className="h-4 w-4" />
        <span>{events.length} events</span>
      </div>
      <h3
        className={`hidden font-semibold text-white lg:block ${
          view === "month" ? "text-xs" : "text-sm md:text-base"
        }`}
      >
        Click to view all events
      </h3>
    </div>
  </>
);

const DayCard = ({
  day,
  events,
  view,
  likeIds,
  isPreviousMonth = false,
}: DayCardProps) => {
  const router = useRouter();
  const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const hasEvents = events.length > 0;
  const isToday = isDateToday(day);

  const handleDayClick = () => {
    if (hasEvents) {
      if (events.length === 1) {
        router.push(`/events/${events[0].id}`);
      }
    } else {
      // Format the date in ISO format and encode for URL
      const formattedDate = format(day, "yyyy-MM-dd");
      router.push(`/my-events/create?date=${formattedDate}`);
    }
  };

  useEffect(() => {
    if (!carouselApi) return;

    setCurrentSlide(carouselApi.selectedScrollSnap());

    carouselApi.on("select", () => {
      setCurrentSlide(carouselApi.selectedScrollSnap());
    });
  }, [carouselApi]);

  // Define CSS classes based on the view
  const baseClasses = "relative bg-neutral-50";
  const weekViewClass =
    view === "week"
      ? "flex-1 min-w-[160px] max-w-[] h-[270px] md:min-w-[160px] md:max-w-[180px] md:max-h-[320px] lg:min-w-[170px] md:h-[350px] lg:max-w-[200px] xl:min-w-[200px] xl:max-w-[230px]"
      : "";
  const monthViewClass =
    view === "month"
      ? "month-view xl-view-reset flex-1 min-w-[140px] min-h-[300px] min-w-custom-640 min-w-custom-700 min-w-custom-740 min-w-custom-770 min-w-custom-780  md:min-w-[80px] md:max-w-[90px] md:min-h-[150px] max-h-[140px] min-w-custom-820  min-w-custom-848 min-w-custom-900 min-w-custom-928 min-w-custom-1008 min-w-custom-1024 min-w-custom-1132 md:max-w-[150px] lg:min-w-[119px] "
      : "";
  const dayViewClass =
    view === "day"
      ? `max-w-[600px] cursor-pointer w-[500px] ${events.length > 1 ? "h-[6000px]" : "h-[540px]"} md:w-[400px] ${events.length > 1 ? "md:h-[640px]" : "md:h-[600px]"} group`
      : "";

  // Render content based on the view and events
  const renderEventContent = () => {
    if (view === "day" && hasEvents) {
      return (
        <div className="group relative h-full w-full overflow-visible rounded-lg">
          {events.length === 1 ? (
            <div
              className="group relative h-full w-full cursor-pointer"
              onClick={() => router.push(`/events/${events[0].id}`)}
            >
              <div className="relative h-full overflow-hidden rounded-md">
                <div className="absolute inset-0">
                  <img
                    src={events[0].image}
                    alt={events[0].name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    style={{
                      objectPosition: "50% 0%",
                    }}
                  />
                  <HoverOverlay event={events[0]} view={view} />
                </div>
              </div>
            </div>
          ) : (
            <div className="group relative h-full overflow-visible">
              <Carousel
                setApi={setCarouselApi}
                className="h-[540px] w-full"
                opts={{
                  align: "start",
                  loop: true,
                }}
              >
                <CarouselContent>
                  {events.map((event, index) => (
                    <CarouselItem key={event.id}>
                      <div
                        className="group relative h-[510px] w-full cursor-pointer md:h-[560px]"
                        onClick={() => router.push(`/events/${event.id}`)}
                      >
                        <img
                          src={event.image}
                          alt={event.name}
                          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                          style={{
                            objectPosition: "50% 0%", // Align to top center
                          }}
                        />
                        <HoverOverlay event={event} view={view} />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                {events.length > 1 && (
                  <>
                    <CarouselPrevious className="absolute left-2 top-1/2 z-10 -translate-y-1/2" />
                    <CarouselNext className="absolute right-2 top-1/2 z-10 -translate-y-1/2" />
                  </>
                )}
              </Carousel>
              <div className="absolute bottom-0 left-0 right-0 bg-white py-2 text-center text-base text-muted-foreground">
                Event {currentSlide + 1} of {events.length}
              </div>
            </div>
          )}
        </div>
      );
    } else if (hasEvents) {
      return (
        <Sheet>
          <SheetTrigger asChild>
            <div
              className={`relative ${
                events.length === 1
                  ? "group h-full w-full cursor-pointer"
                  : `group grid h-full w-full cursor-pointer gap-0.5 ${events.length === 2 ? "grid-rows-2" : ""} ${events.length === 3 ? "grid-cols-2 grid-rows-2" : ""} ${events.length >= 4 ? "grid-cols-2 grid-rows-2" : ""} `
              } `}
            >
              {events.length === 1 ? (
                <>
                  <img
                    src={events[0].image}
                    alt={events[0].name}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <HoverOverlay event={events[0]} view={view} />
                </>
              ) : (
                <>
                  {events.slice(0, 4).map((event, index) => (
                    <div
                      key={event.id}
                      className={`relative h-full ${events.length === 3 && index === 2 ? "col-span-2 row-span-1" : ""}`}
                    >
                      <img
                        src={event.image}
                        alt={event.name}
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                      {view === "day" && (
                        <HoverOverlay event={event} view={view} />
                      )}
                    </div>
                  ))}
                  {events.length > 4 && (
                    <div className="absolute right-1 top-1 z-10 rounded-full bg-primary px-2 py-1 text-xs text-primary-foreground">
                      +{events.length - 4}
                    </div>
                  )}
                  {view !== "day" && (
                    <MultiEventOverlay events={events} view={view} />
                  )}
                </>
              )}
            </div>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="flex w-full flex-col p-0 sm:max-w-md"
          >
            <div className="absolute left-0 right-0 top-0 z-10 border-b bg-background p-6">
              <SheetHeader>
                <SheetTitle className="font-anton text-xl">
                  Events on {format(day, "EEEE, MMMM d, yyyy")}
                </SheetTitle>
              </SheetHeader>
            </div>
            <div className="flex-1 overflow-y-auto pt-[85px]">
              <div className="grid gap-6 p-6 pt-0">
                {events.map((event) => (
                  <div
                    key={event.id}
                    onClick={() => router.push(`/events/${event.id}`)}
                    className="cursor-pointer"
                  >
                    <EventCard
                      event={event}
                      inSheet={true}
                      likeId={likeIds[event.id] ?? null}
                    />
                  </div>
                ))}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      );
    } else {
      return (
        <div
          onClick={handleDayClick}
          className="flex h-full w-full flex-col items-center justify-center text-muted-foreground hover:cursor-pointer hover:text-foreground"
        >
          <Upload
            className={`${view === "day" ? "mb-2 h-8 w-8" : "mb-2 h-8 w-8 sm:mb-0 sm:h-10 sm:w-5 md:mb-2 md:h-6 md:w-6 lg:h-7 lg:w-7"}`}
          />
          <span
            className={`${view === "day" ? "text-[1.5rem]" : "text-center text-[1rem] leading-tight sm:text-[0.8rem] md:text-[0.9rem] md:leading-normal lg:text-[1rem] xl:text-[1.1rem]"} font-semibold`}
          >
            Create Event
          </span>
        </div>
      );
    }
  };

  return (
    <div
      className={` ${baseClasses} ${weekViewClass} ${monthViewClass} ${dayViewClass} overflow-hidden rounded-lg shadow-md ${view !== "day" ? "duration-250 transform transition-transform hover:scale-105 hover:shadow-xl" : ""} relative flex flex-col ${isPreviousMonth ? "opacity-40" : ""}`}
    >
      {/* Header displaying the day and date */}
      <div
        className={`flex flex-row items-center justify-between p-2 sm:p-1 lg:p-2 ${view === "day" ? "p-2 md:p-3" : ""} ${view === "week" ? "p-3 sm:p-2 md:p-2" : ""} ${view === "month" ? "p-3 sm:p-1 md:p-1" : ""} rounded-0 ${isToday ? "bg-primary text-primary-foreground" : "bg-secondary"} `}
      >
        {/* Day of the week */}
        <span
          className={`month-header-text-768 month-header-text-830 text-xs md:text-sm ${view === "day" ? "text-base md:text-lg" : ""} font-medium`}
        >
          {format(day, "EEE")}
        </span>
        {/* Date */}
        <div
          className={`month-header-text-768 month-header-text-830 text-xs md:text-sm ${view === "day" ? "text-base md:text-lg" : ""}`}
        >
          <span>{format(day, "dd")}</span>
          <span className="hidden text-muted-foreground md:inline-block">
            {format(day, " MMM")}
          </span>
        </div>
      </div>

      {/* Event content section */}
      <div className="relative flex-1 overflow-visible bg-secondary/5 p-0">
        {renderEventContent()}
      </div>
    </div>
  );
};

export default DayCard;
