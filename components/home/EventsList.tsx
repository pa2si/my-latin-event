import EventCard from '../card/EventCard';
import type { EventCardProps } from '@/utils/types';

const EventsList = ({ events }: { events: EventCardProps[] }) => {
  return (
    <section className="mt-4 gap-8 grid sm:grid-cols-2  lg:grid-cols-3  xl:grid-cols-4">
      {events.map((event) => {
        return <EventCard key={event.id} event={event} />;
      })}
    </section>
  );
};
export default EventsList;
