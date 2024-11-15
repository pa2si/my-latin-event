import { format } from "date-fns";
import LikeToggleButton from "@/components/card/LikeToggleButton";
import EventRating from "@/components/card/EventRating";
import BreadCrumbs from "@/components/events/BreadCrumbs";
import ImageContainer from "@/components/events/ImageContainer";
import ShareButton from "@/components/events/ShareButton";
222;
import {
  checkEventAccess,
  fetchEventDetails,
  findExistingReview,
} from "@/utils/actions";
import Description from "@/components/events/Description";
import { redirect } from "next/navigation";

import { Skeleton } from "@/components/ui/skeleton";
import dynamic from "next/dynamic";
import SubmitReview from "@/components/reviews/SubmitReview";
import EventReviews from "@/components/reviews/EventReviews";

import DeleteEvent from "@/components/events/DeleteEvent";
import EditMyEvent from "@/components/events/EditMyEvent";

import CalendarCard from "@/components/events/CalendarCard";
import OrganizerCard from "@/components/events/OrganizerCard";
import VenueFeaturesCard from "@/components/events/VenueFeaturesCard";
import LikesCard from "@/components/events/LikesCard";
import { QuickInfoCard } from "@/components/events/QuickInfoCard";
import EventDetailsCard from "@/components/events/EventDetailsCard";
import HeaderSection from "@/components/events/HeaderSection";

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

  // Styles parsing
  const styles: StyleItem[] = JSON.parse(event.styles);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Header Section */}
      <HeaderSection
        eventId={event.id}
        eventName={event.name}
        eventSubtitle={event.subtitle}
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
            genre={event.genre}
          />
          <p className="mt-2 text-sm text-muted-foreground">
            Created {format(event.createdAt, "dd.MM.yyyy")}
            {event.updatedAt &&
              event.updatedAt !== event.createdAt &&
              ` • Modified ${format(event.updatedAt, "dd.MM.yyyy HH:mm")}`}
          </p>

          {/* Event Details */}
          <EventDetailsCard
            location={event.location}
            street={event.street}
            postalCode={event.postalCode || undefined}
            city={event.city}
            country={event.country}
            googleMapsLink={event.googleMapsLink || undefined}
            styles={event.styles}
          />

          {/* Description */}
          {event.description && <Description description={event.description} />}

          {/* Map */}
          <div className="mt-8">
            <h2 className="mb-4 text-2xl font-bold">{`locate ${event.location}`}</h2>
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
                organizerId={event.organizer.id}
                organizerName={event.organizer.organizerName}
                organizerImage={event.organizer.organizerImage}
                slogan={event.organizer.slogan || undefined}
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
              organizerId={event.organizer.id}
              organizerName={event.organizer.organizerName}
              organizerImage={event.organizer.organizerImage}
              slogan={event.organizer.slogan || undefined}
            />
            {hasVenueFeatures && (
              <VenueFeaturesCard
                floors={floors}
                bars={bars}
                outdoorAreas={outdoorAreas}
              />
            )}
            <LikesCard likes={event._count.likes} />
          </div>
        </aside>
      </div>
    </div>
  );
};

export default EventDetailsPage;
