import { format } from "date-fns";

import FavoriteToggleButton from "@/components/card/FavoriteToggleButton";
import EventRating from "@/components/card/EventRating";
import BreadCrumbs from "@/components/events/BreadCrumbs";
import ImageContainer from "@/components/events/ImageContainer";
import LocationDetails from "@/components/events/LocationDetails";
import ShareButton from "@/components/events/ShareButton";
import UserInfo from "@/components/events/UserInfo";
import { Separator } from "@/components/ui/separator";
import { fetchLocationDetails, findExistingReview } from "@/utils/actions";
import Description from "@/components/events/Description";
import { redirect } from "next/navigation";
import Styles from "@/components/events/Styles";
import { Skeleton } from "@/components/ui/skeleton";
import dynamic from "next/dynamic";
import SubmitReview from "@/components/reviews/SubmitReview";
import EventReviews from "@/components/reviews/EventReviews";
import { auth } from "@clerk/nextjs/server";
import DeleteMyEvent from "@/components/events/DeleteMyEvent";
import EditMyEvent from "@/components/events/EditMyEvent";
import EventDateAndTime from "@/components/events/EventDateAndTime";
import { Calendar } from "@/components/ui/calendar";

import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Globe,
  Mail,
  Phone,
  DollarSign,
  Users,
  Share2,
  Heart,
  Music,
  AudioLines,
} from "lucide-react";
import { FaMusic, FaStar } from "react-icons/fa";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import CountryFlagAndName from "@/components/card/CountryFlagAndName";

const DynamicMap = dynamic(() => import("@/components/events/EventMap"), {
  ssr: false,
  loading: () => <Skeleton className="h-[400px] w-full" />,
});

interface StyleItem {
  name: string;
  selected: boolean;
}

const EventDetailsPage = async ({ params }: { params: { id: string } }) => {
  const event = await fetchLocationDetails(params.id);
  if (!event) redirect("/");
  const { floors, bars, outdoorAreas, eventDateAndTime, eventEndDateAndTime } =
    event;

  // Parse the styles string and filter for selected ones only
  const styles: StyleItem[] = JSON.parse(event.styles);
  const selectedStyles = styles.filter((style) => style.selected);

  const selectedDate =
    eventDateAndTime instanceof Date
      ? eventDateAndTime
      : new Date(eventDateAndTime);

  const formattedDate = format(eventDateAndTime, "dd.MM.yy");
  const formattedTime = format(eventDateAndTime, "HH:mm");

  const hasEndDateTime = eventEndDateAndTime !== null;
  const formattedEndDate = hasEndDateTime
    ? format(eventEndDateAndTime, "dd.MM.yy")
    : "";
  const formattedEndTime = hasEndDateTime
    ? format(eventEndDateAndTime, "HH:mm")
    : "";

  const firstName = event.profile.firstName;
  const profileImage = event.profile.profileImage;

  const { userId } = auth();
  const isNotOwner = event.profile.clerkId !== userId;
  const isOwner = event.profile.clerkId === userId;
  const isAdminUser = userId === process.env.ADMIN_USER_ID;
  const reviewDoesNotExist =
    userId && isNotOwner && !(await findExistingReview(userId, event.id));

  const SidebarContent = () => (
    <>
      {/* Calendar */}
      <Card>
        <CardContent className="p-4">
          <Calendar
            mode="single"
            selected={selectedDate}
            initialFocus
            disabled={true}
            classNames={{
              day_selected: "bg-primary text-primary-foreground",
            }}
          />
        </CardContent>
      </Card>

      {/* Host Information */}
      <Card>
        <CardContent className="p-4">
          <h3 className="mb-4 text-lg font-semibold">Event Host</h3>
          <UserInfo
            profile={{
              firstName: event.profile.firstName,
              profileImage: event.profile.profileImage,
              slogan: event.profile.slogan,
            }}
          />
        </CardContent>
      </Card>

      {/* Venue Features */}
      <Card>
        <CardContent className="p-4">
          <h3 className="mb-4 text-lg font-semibold">Venue Features</h3>
          <LocationDetails
            details={{
              floors: floors,
              bars: bars,
              outdoorAreas: outdoorAreas,
            }}
          />
        </CardContent>
      </Card>

      {/* Likes Card */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Likes</h3>
            </div>
            <span className="text-2xl font-bold text-primary">2</span>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            People interested in this event
          </p>
        </CardContent>
      </Card>
    </>
  );

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
            <FavoriteToggleButton eventId={event.id} />
            {(isAdminUser || isOwner) && (
              <>
                <EditMyEvent eventId={event.id} />
                <DeleteMyEvent eventId={event.id} />
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-8 xl:grid-cols-12">
        {/* Left Column */}
        <div className="xl:col-span-9">
          {/* Image */}
          <ImageContainer mainImage={event.image} name={event.name} />

          {/* Event Quick Info */}
          <Card className="mt-6">
            <CardContent className="grid grid-cols-2 gap-4 p-6 md:grid-cols-4">
              {/* Date */}
              <div className="flex flex-col gap-2">
                <CalendarIcon className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Date</h3>
                <p className="text-sm text-muted-foreground">{formattedDate}</p>
              </div>

              {/* Duration */}
              <div className="flex flex-col gap-2">
                <Clock className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Duration</h3>
                <p className="text-sm text-muted-foreground">
                  {formattedTime} {hasEndDateTime && `- ${formattedEndTime}`}
                </p>
              </div>

              {/* Price */}
              <div className="flex flex-col gap-2">
                <DollarSign className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Price</h3>
                <p className="text-sm text-muted-foreground">{event.price}€</p>
              </div>

              {/* Genre */}
              <div className="flex flex-col gap-2">
                <Music className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Genre</h3>
                <p className="text-sm text-muted-foreground">{event.genre}</p>
              </div>
            </CardContent>
          </Card>

          {/* Event Details */}
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
                  <p>{event.location}</p>
                  <p>{event.street}</p>
                  <p>
                    {event.postalCode} {event.city}
                  </p>
                  <CountryFlagAndName country={event.country} />
                </div>
                {event.googleMapsLink && (
                  <Button variant="outline" className="mt-2" asChild>
                    <a
                      href={event.googleMapsLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View on Google Maps
                    </a>
                  </Button>
                )}
              </div>

              {/* Genre & Styles */}
              {selectedStyles.length > 0 && (
                <div className="space-y-4">
                  <h3 className="flex items-center gap-2 text-lg font-semibold">
                    <FaMusic className="h-5 w-5 text-primary" />
                    Music Styles
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

          {/* Medium and Large Screens Sidebar Content */}
          <div className="mt-8 hidden md:block xl:hidden">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Left Column - Calendar */}
              <div>
                <Card>
                  <CardContent className="p-4">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      initialFocus
                      disabled={true}
                      classNames={{
                        day_selected: "bg-primary text-primary-foreground",
                      }}
                    />
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Other Cards */}
              <div className="space-y-6">
                {/* Host Information */}
                <Card>
                  <CardContent className="p-4">
                    <h3 className="mb-4 text-lg font-semibold">Event Host</h3>
                    <UserInfo
                      profile={{
                        firstName: event.profile.firstName,
                        profileImage: event.profile.profileImage,
                        slogan: event.profile.slogan,
                      }}
                    />
                  </CardContent>
                </Card>

                {/* Venue Features */}
                <Card>
                  <CardContent className="p-4">
                    <h3 className="mb-4 text-lg font-semibold">
                      Venue Features
                    </h3>
                    <LocationDetails
                      details={{
                        floors: event.floors,
                        bars: event.bars,
                        outdoorAreas: event.outdoorAreas,
                      }}
                    />
                  </CardContent>
                </Card>

                {/* Likes Card */}
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Heart className="h-5 w-5 text-primary" />
                        <h3 className="text-lg font-semibold">Likes</h3>
                      </div>
                      <span className="text-2xl font-bold text-primary">2</span>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      People interested in this event
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - XL screens */}
        <div className="hidden xl:col-span-3 xl:block">
          <div className="sticky top-8 space-y-6">
            <SidebarContent />
          </div>
        </div>

        {/* Mobile Sidebar Content */}
        <div className="space-y-6 md:hidden">
          <SidebarContent />
        </div>
      </div>
    </div>
  );
};

export default EventDetailsPage;
