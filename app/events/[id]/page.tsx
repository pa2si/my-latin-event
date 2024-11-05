import { format } from "date-fns";
import LikeToggleButton from "@/components/card/LikeToggleButton";
import EventRating from "@/components/card/EventRating";
import BreadCrumbs from "@/components/events/BreadCrumbs";
import ImageContainer from "@/components/events/ImageContainer";
import ShareButton from "@/components/events/ShareButton";

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
import { auth } from "@clerk/nextjs/server";
import DeleteMyEvent from "@/components/events/DeleteMyEvent";
import EditMyEvent from "@/components/events/EditMyEvent";

import CalendarCard from "@/components/events/CalendarCard";
import HostCard from "@/components/events/HostCard";
import VenueFeaturesCard from "@/components/events/VenueFeaturesCard";
import LikesCard from "@/components/events/LikesCard";
import { QuickInfoCard } from "@/components/events/QuickInfoCard";
import EventDetailsCard from "@/components/events/EventDetailsCard";

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

  const { canEdit } = await checkEventAccess(event.profile.clerkId);

  const { floors, bars, outdoorAreas, eventDateAndTime, eventEndDateAndTime } =
    event;

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
      <div className="mb-4 sm:mb-8">
        <BreadCrumbs name={event.name} />
        <div className="mt-4 items-center justify-between sm:flex">
          <div>
            <h1 className="mb-1 text-4xl font-bold">{event.name}</h1>
            <p className="text-xl text-muted-foreground">{event.subtitle}</p>
          </div>
          <div className="mt-4 flex gap-4 sm:mt-0">
            <ShareButton name={event.name} eventId={event.id} />
            <LikeToggleButton eventId={event.id} />
            {canEdit && (
              <>
                <EditMyEvent eventId={event.id} />
                <DeleteMyEvent eventId={event.id} />
              </>
            )}
          </div>
        </div>
      </div>

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

          {/* Progressive Grid Layouts */}

          {/* Mobile Layout (below sm) - Single column */}
          <div className="mt-8 space-y-6 sm:hidden">
            <CalendarCard selectedDate={selectedDate} />
            <VenueFeaturesCard
              floors={floors}
              bars={bars}
              outdoorAreas={outdoorAreas}
            />
            <HostCard
              profileId={event.profile.id}
              firstName={event.profile.firstName}
              profileImage={event.profile.profileImage}
              slogan={event.profile.slogan || undefined}
            />
            <LikesCard likes={2} />
          </div>

          {/* Tablet Layout (sm to lg) - Two columns */}
          <div className="mt-8 hidden sm:block lg:hidden">
            <div className="grid grid-cols-2 gap-8">
              <div>
                <CalendarCard selectedDate={selectedDate} />
              </div>
              <div className="space-y-6">
                <HostCard
                  profileId={event.profile.id}
                  firstName={event.profile.firstName}
                  profileImage={event.profile.profileImage}
                  slogan={event.profile.slogan || undefined}
                />
                <VenueFeaturesCard
                  floors={floors}
                  bars={bars}
                  outdoorAreas={outdoorAreas}
                />
                <LikesCard likes={2} />
              </div>
            </div>
          </div>

          {/* Desktop Layout (lg to xl) - Three columns */}
          <div className="mt-8 hidden lg:block xl:hidden">
            <div className="grid grid-cols-3 gap-8">
              <div>
                <CalendarCard selectedDate={selectedDate} />
              </div>
              <div>
                <VenueFeaturesCard
                  floors={floors}
                  bars={bars}
                  outdoorAreas={outdoorAreas}
                />
              </div>
              <div className="space-y-6">
                <HostCard
                  profileId={event.profile.id}
                  firstName={event.profile.firstName}
                  profileImage={event.profile.profileImage}
                  slogan={event.profile.slogan || undefined}
                />
                <LikesCard likes={2} />
              </div>
            </div>
          </div>
        </div>

        {/* XL Sidebar */}
        <aside className="hidden xl:col-span-3 xl:block">
          <div className="sticky top-8 space-y-6">
            <CalendarCard selectedDate={selectedDate} />
            <HostCard
              profileId={event.profile.id}
              firstName={event.profile.firstName}
              profileImage={event.profile.profileImage}
              slogan={event.profile.slogan || undefined}
            />
            <VenueFeaturesCard
              floors={floors}
              bars={bars}
              outdoorAreas={outdoorAreas}
            />
            <LikesCard likes={2} />
          </div>
        </aside>
      </div>
    </div>
  );
};

export default EventDetailsPage;
