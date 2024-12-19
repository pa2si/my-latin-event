import { differenceInDays, format } from "date-fns";
import ImageContainer from "@/components/events/ImageContainer";
import {
  checkEventAccess,
  fetchEventDetails,
} from "@/utils/actions";
import Description from "@/components/events/Description";
import { redirect } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import dynamic from "next/dynamic";
import CalendarCard from "@/components/events/CalendarCard";
import OrganizerCard from "@/components/events/OrganizerCard";
import VenueFeaturesCard from "@/components/events/VenueFeaturesCard";
import LikesCard from "@/components/events/LikesCard";
import { QuickInfoCard } from "@/components/events/QuickInfoCard";
import EventDetailsCard from "@/components/events/EventDetailsCard";
import HeaderSection from "@/components/events/HeaderSection";
import TitleHTwo from "@/components/shared/TitleHTtwo";


const DynamicMap = dynamic(() => import("@/components/events/EventMap"), {
  ssr: false,
  loading: () => <Skeleton className="h-[400px] w-full" />,
});

interface StyleItem {
  name: string;
  selected: boolean;
}

const EventDetailsPage = async ({ params }: { params: { id: string } }) => {
  const event = await fetchEventDetails(params.id);
  if (!event) redirect("/");

  const { canEdit } = await checkEventAccess(event.organizer.profile.clerkId);

  const { floors, bars, outdoorAreas, eventDateAndTime, eventEndDateAndTime } =
    event;

  const hasVenueFeatures = floors > 0 || bars > 0 || outdoorAreas > 0;

  // Date formatting
  const selectedDate = new Date(eventDateAndTime);
  const formattedDate = format(eventDateAndTime, "dd.MM.yy");
  const formattedTime = format(eventDateAndTime, "HH:mm");
  const hasEndDateTime = eventEndDateAndTime !== null;
  const formattedEndTime = hasEndDateTime
    ? format(eventEndDateAndTime, "HH:mm")
    : "";

  // Calculate days to go
  const daysToGo = differenceInDays(selectedDate, new Date());
  const daysMessage = daysToGo < 0
    ? "Event has passed"
    : daysToGo === 0
      ? "Today!"
      : daysToGo === 1
        ? "Tomorrow!"
        : `${daysToGo} days to go`;

  // Convert styles array to StyleItem array
  const selectedStyles: StyleItem[] = event.styles.map(style => ({
    name: style,
    selected: true
  }));

  return (
    <div className="mx-auto max-w-7xl ">
      {/* Header Section */}
      <HeaderSection
        eventId={event.id}
        eventName={event.name}
        eventSubtitle={event.subtitle}
        ticketLink={event.ticketLink}
        canEdit={canEdit}
      />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-8 xl:grid-cols-12">
        {/* Main Content */}
        <div className="xl:col-span-9">
          {/* Image */}
          <ImageContainer mainImage={event.image} name={event.name} />

          {/* Quick Info */}
          <QuickInfoCard
            date={formattedDate}
            time={formattedTime}
            endTime={formattedEndTime}
            price={event.price}
            currency={event.currency}
            genres={event.genres}
            daysMessage={daysMessage}
          />

          {/* Event Details */}
          <EventDetailsCard
            location={event.location}
            street={event.street}
            postalCode={event.postalCode || undefined}
            city={event.city}
            country={event.country}
            googleMapsLink={event.googleMapsLink || undefined}
            styles={selectedStyles}
          />

          {/* Description */}
          {event.description && <Description description={event.description} />}

          {/* Map */}
          <div className="mt-8">
            <TitleHTwo text={`Locate ${event.location}`} />
            <DynamicMap
              name={event.location}
              country={event.country}
              city={event.city}
              street={event.street}
              postalCode={event.postalCode}
            />
          </div>

          {/* Responsive Components Grid */}
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:hidden">
            {/* First Column */}
            <div className="order-1 mx-auto sm:mx-0">
              <CalendarCard selectedDate={selectedDate} />
            </div>

            {/* Second Column */}
            <div className="order-2 space-y-6">
              {hasVenueFeatures && (
                <VenueFeaturesCard
                  floors={floors}
                  bars={bars}
                  outdoorAreas={outdoorAreas}
                />
              )}
              <OrganizerCard
                id={event.organizer.id}
                organizerName={event.organizer.organizerName}
                organizerImage={event.organizer.organizerImage}
                slogan={event.organizer.slogan || undefined}
                _count={event.organizer._count}
              />
              <LikesCard likes={event._count.likes} />
            </div>
          </div>
        </div>

        {/* XL Sidebar */}
        <aside className="hidden xl:col-span-3 xl:block">
          <div className="sticky top-8 space-y-6">
            <CalendarCard selectedDate={selectedDate} />
            <OrganizerCard
              id={event.organizer.id}
              organizerName={event.organizer.organizerName}
              organizerImage={event.organizer.organizerImage}
              slogan={event.organizer.slogan || undefined}
              _count={event.organizer._count}
            />
            {hasVenueFeatures && (
              <VenueFeaturesCard
                floors={floors}
                bars={bars}
                outdoorAreas={outdoorAreas}
              />
            )}
            <LikesCard likes={event._count.likes} />

            <p className="mt-2 text-xs text-muted-foreground tracking-wide font-antonio">
              Created {format(event.createdAt, "dd.MM.yyyy")}
              {event.updatedAt &&
                event.updatedAt !== event.createdAt &&
                ` • Modified ${format(event.updatedAt, "dd.MM.yyyy HH:mm")}`}
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default EventDetailsPage;