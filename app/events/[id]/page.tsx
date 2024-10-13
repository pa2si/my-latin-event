import { format } from "date-fns";
import { Calendar as CalendarIcon, Clock } from "lucide-react";
import FavoriteToggleButton from "@/components/card/FavoriteToggleButton";
import EventRating from "@/components/card/EventRating";
import BreadCrumbs from "@/components/events/BreadCrumbs";
import ImageContainer from "@/components/events/ImageContainer";
import EventDetails from "@/components/events/EventDetails";
import ShareButton from "@/components/events/ShareButton";
import UserInfo from "@/components/events/UserInfo";
import { Separator } from "@/components/ui/separator";
import { fetchEventDetails, findExistingReview } from "@/utils/actions";
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

const DynamicMap = dynamic(() => import("@/components/events/EventMap"), {
  ssr: false,
  loading: () => <Skeleton className="h-[400px] w-full" />,
});

const DynamicBookingWrapper = dynamic(
  () => import("@/components/booking/BookingWrapper"),
  {
    ssr: false,
    loading: () => <Skeleton className="h-[200px] w-full" />,
  },
);

const EventDetailsPage = async ({ params }: { params: { id: string } }) => {
  const event = await fetchEventDetails(params.id);
  if (!event) redirect("/");
  const { floors, bars, outdoorAreas, eventDateAndTime, eventEndDateAndTime } =
    event;
  const details = { floors, bars, outdoorAreas };

  const formattedDate = format(new Date(eventDateAndTime), "dd.MM.yy");
  const formattedTime = format(new Date(eventDateAndTime), "HH:mm");
  const formattedEndDate = eventEndDateAndTime
    ? format(new Date(eventEndDateAndTime), "dd.MM.yy")
    : null;
  const formattedEndTime = eventEndDateAndTime
    ? format(new Date(eventEndDateAndTime), "HH:mm")
    : null;

  const firstName = event.profile.firstName;
  const profileImage = event.profile.profileImage;

  const { userId } = auth();
  const isNotOwner = event.profile.clerkId !== userId;
  const isOwner = event.profile.clerkId === userId;
  const isAdminUser = userId === process.env.ADMIN_USER_ID;
  const reviewDoesNotExist =
    userId && isNotOwner && !(await findExistingReview(userId, event.id));

  return (
    <section>
      <BreadCrumbs name={event.name} />
      <header className="mt-4 flex items-center justify-between">
        <h1 className="text-4xl font-bold">{event.name}</h1>
        <div className="flex items-center gap-x-4">
          <ShareButton name={event.name} eventId={event.id} />
          <FavoriteToggleButton eventId={event.id} />
          {(isAdminUser || isOwner) && <EditMyEvent eventId={event.id} />}
          {isAdminUser && <DeleteMyEvent eventId={event.id} />}
        </div>
      </header>
      <ImageContainer mainImage={event.image} name={event.name} />
      <section className="mt-12 gap-x-12 lg:grid lg:grid-cols-12">
        <div className="flex flex-col gap-1 lg:col-span-8">
          <div className="flex items-center gap-x-4">
            <h2 className="text-xl font-bold">{event.name}</h2>
            <EventRating inPage eventId={event.id} />
          </div>
          <h3 className="text-muted-foreground">{event.subtitle}</h3>

          <div className="flex items-center gap-x-2">
            <EventDateAndTime
              formattedDate={formattedDate || ""}
              formattedTime={formattedTime || ""}
              isStartDate={true}
            />

            <EventDateAndTime
              formattedDate={formattedEndDate || ""}
              formattedTime={formattedEndTime || ""}
              isStartDate={false}
            />
          </div>
          <p className="text-md text-muted-foreground">{event.genre} Event</p>
          <p className="text-md text-muted-foreground">
            Ticket Price {event.price} €
          </p>
          <EventDetails details={details} />
          <UserInfo profile={{ firstName, profileImage }} />
          <Separator className="mt-4" />
          <Description description={event.description} />
          <Styles styles={event.styles} />
          <DynamicMap countryCode={event.country} />
        </div>
        <div className="flex flex-col items-center lg:col-span-4">
          {/* calendar */}
          <DynamicBookingWrapper
            eventId={event.id}
            price={event.price}
            bookings={event.bookings}
          />
        </div>
      </section>
      {reviewDoesNotExist && <SubmitReview eventId={event.id} />}
      <EventReviews eventId={event.id} />
    </section>
  );
};

export default EventDetailsPage;
