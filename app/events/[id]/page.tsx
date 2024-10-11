import { format } from 'date-fns';
import { Calendar as CalendarIcon, Clock } from 'lucide-react';
import FavoriteToggleButton from '@/components/card/FavoriteToggleButton';
import EventRating from '@/components/card/EventRating';
import BreadCrumbs from '@/components/events/BreadCrumbs';
import ImageContainer from '@/components/events/ImageContainer';
import EventDetails from '@/components/events/EventDetails';
import ShareButton from '@/components/events/ShareButton';
import UserInfo from '@/components/events/UserInfo';
import { Separator } from '@/components/ui/separator';
import {
  fetchEventDetails,
  findExistingReview,
  deleteMyEventAction,
} from '@/utils/actions';
import Description from '@/components/events/Description';
import { redirect } from 'next/navigation';
import Styles from '@/components/events/Styles';
import { Skeleton } from '@/components/ui/skeleton';
import dynamic from 'next/dynamic';
import SubmitReview from '@/components/reviews/SubmitReview';
import EventReviews from '@/components/reviews/EventReviews';
import { auth } from '@clerk/nextjs/server';
import FormContainer from '@/components/form/FormContainer';
import { IconButton } from '@/components/form/Buttons';
import Link from 'next/link';

const DynamicMap = dynamic(() => import('@/components/events/EventMap'), {
  ssr: false,
  loading: () => <Skeleton className="h-[400px] w-full" />,
});

const DynamicBookingWrapper = dynamic(
  () => import('@/components/booking/BookingWrapper'),
  {
    ssr: false,
    loading: () => <Skeleton className="h-[200px] w-full" />,
  }
);

const EventDetailsPage = async ({ params }: { params: { id: string } }) => {
  const event = await fetchEventDetails(params.id);
  if (!event) redirect('/');
  const { floors, bars, outdoorAreas, eventDateAndTime } = event;
  const details = { floors, bars, outdoorAreas };

  const formattedDate = format(new Date(eventDateAndTime), 'dd.MM.yy');
  const formattedTime = format(new Date(eventDateAndTime), 'HH:mm');

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
      <header className="flex justify-between items-center mt-4">
        <h1 className="text-4xl font-bold ">{event.name}</h1>
        <div className="flex items-center gap-x-4">
          <ShareButton name={event.name} eventId={event.id} />
          <FavoriteToggleButton eventId={event.id} />
          {isAdminUser && <DeleteMyEvent eventId={event.id} />}
          {(isAdminUser || isOwner) && <EditMyEvent eventId={event.id} />}
        </div>
      </header>
      <ImageContainer mainImage={event.image} name={event.name} />
      <section className="lg:grid lg:grid-cols-12 gap-x-12 mt-12">
        <div className="lg:col-span-8">
          <div className="flex gap-x-4 items-center">
            <h1 className="text-xl font-bold">{event.name}</h1>
            <EventRating inPage eventId={event.id} />
          </div>
          <p className="text-sm mt-2 text-gray-500 flex items-center">
            <CalendarIcon className="mr-1" size={16} />
            {formattedDate} {/* Display formatted date */}
          </p>
          <p className="text-sm mt-2 text-gray-500 flex items-center">
            <Clock className="mr-1" size={16} />
            {formattedTime} {/* Display formatted time */}
          </p>
          <EventDetails details={details} />
          <UserInfo profile={{ firstName, profileImage }} />
          <Separator className="mt-4" />
          <Description description={event.description} />
          <Styles styles={event.styles} />
          <DynamicMap countryCode={event.country} />
        </div>
        <div className="lg:col-span-4 flex flex-col items-center">
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

const DeleteMyEvent = ({ eventId }: { eventId: string }) => {
  const deleteMyEvent = deleteMyEventAction.bind(null, { eventId });
  return (
    <FormContainer action={deleteMyEvent}>
      <IconButton actionType="delete" variant="outline" />
    </FormContainer>
  );
};

const EditMyEvent = ({ eventId }: { eventId: string }) => {
  return (
    <Link href={`/my-events/${eventId}/edit`}>
      <IconButton actionType="edit" variant="outline" />
    </Link>
  );
};

export default EventDetailsPage;
