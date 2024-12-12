import { fetchEvents, fetchLikeIds } from "@/utils/actions";
import EmptyList from "./EmptyList";
import { LoadingCalendar } from "@/components/card/LoadingCards";
import type { EventCardProps } from "@/utils/types";
import { currentUser } from "@clerk/nextjs/server";
import { cookies } from "next/headers";
import dynamic from 'next/dynamic';

// Dynamically import the CalendarContainer component
const CalendarContainer = dynamic(() => import('./CalendarContainer'), {
  loading: () => <LoadingCalendar />,
  ssr: false,
});

interface EventsContainerProps {
  searchParams: {
    search?: string;
  };
}

const EventsContainer = async ({ searchParams }: EventsContainerProps) => {
  const { search } = searchParams;

  const user = await currentUser();
  const cookieStore = cookies();
  const locationCookie = cookieStore.get("guestLocation")?.value;
  const genresCookie = cookieStore.get("selectedGenres")?.value; // Changed from selectedGenre

  // Show loading state if no user and no location data
  if (!user && !locationCookie) {
    return <LoadingCalendar />;
  }

  // Initialize location parameters
  let locationParams = {};
  if (!user && locationCookie) {
    try {
      const parsedLocation = JSON.parse(locationCookie);
      locationParams = {
        country: parsedLocation.country,
        state: parsedLocation.state,
        city: parsedLocation.city || undefined,
      };
    } catch (error) {
      console.error("Error parsing location cookie:", error);
    }
  }

  // Parse genres from cookie
  let selectedGenres: string[] | undefined;
  try {
    selectedGenres = genresCookie ? JSON.parse(genresCookie) : undefined;
  } catch (error) {
    console.error("Error parsing genres cookie:", error);
    selectedGenres = undefined;
  }

  const events = await fetchEvents({
    genres: selectedGenres,
    search,
    ...locationParams,
  });

  // Fetch all likes for these events at once
  const eventIds = events.map(event => event.id);
  const likeIds = user ? await fetchLikeIds({ eventIds }) : {};

  return <CalendarContainer events={events} likeIds={likeIds} />;
};

export default EventsContainer;