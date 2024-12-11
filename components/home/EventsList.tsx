import EventCard from '../card/EventCard';
import type { EventCardProps } from '@/utils/types';

interface EventsListProps {
  events: EventCardProps[];
  likeIds: Record<string, string | null>;
}

const EventsList = ({ events, likeIds }: EventsListProps) => {
  return (
    <section className="mt-4 gap-8 grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {events.map((event) => {
        return (
          <EventCard
            key={event.id}
            event={event}
            likeId={likeIds[event.id] ?? null}
          />
        );
      })}
    </section>
  );
};

export default EventsList;