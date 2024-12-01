import { fetchEvents } from "@/utils/actions";
import EventsList from "./EventsList";
import EmptyList from "./EmptyList";
import LoadingCards from "@/components/card/LoadingCards";
import type { EventCardProps } from "@/utils/types";
import { currentUser } from "@clerk/nextjs/server";
import { cookies } from "next/headers";

const EventsContainer = async ({
  genre,
  search,
}: {
  genre?: string;
  search?: string;
}) => {
  const user = await currentUser();
  const cookieStore = cookies();
  const locationCookie = cookieStore.get("guestLocation")?.value;

  // Show loading state if no user and no location data
  if (!user && !locationCookie) {
    return <LoadingCards />;
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

  const events: EventCardProps[] = await fetchEvents({
    genre,
    search,
    ...locationParams,
  });

  if (events.length === 0) {
    return (
      <EmptyList
        heading="No results."
        message="Try changing or removing some of your filters."
        btnText="Clear Filters"
      />
    );
  }

  return <EventsList events={events} />;
};

export default EventsContainer;
