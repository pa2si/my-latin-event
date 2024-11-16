import { fetchEvents } from "@/utils/actions";
import EventsList from "./EventsList";
import EmptyList from "./EmptyList";
import type { EventCardProps } from "@/utils/types";

const EventsContainer = async ({
  genre,
  search,
}: {
  genre?: string;
  search?: string;
}) => {
  const events: EventCardProps[] = await fetchEvents({
    genre,
    search,
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
