"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MyEventsTable from "@/components/events/MyEventsTable";

interface Event {
  id: string;
  name: string;
  location: string;
  price: string;
  eventDateAndTime: Date;
  organizer: {
    organizerName: string;
  };
  _count: {
    likes: number;
  };
}

interface MyEventsContainerProps {
  allEvents: Event[];
  upcomingEvents: Event[];
  pastEvents: Event[];
}

export default function MyEventsContainer({
  allEvents,
  upcomingEvents,
  pastEvents,
}: MyEventsContainerProps) {
  return (
    <div className="mt-8">
      <Tabs
        defaultValue="upcoming"
        className="w-full"
        onValueChange={(value) => {
          const searchParams = new URLSearchParams(window.location.search);
          searchParams.set("tab", value);
          window.history.pushState(null, "", `?${searchParams.toString()}`);
        }}
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upcoming">
            Upcoming ({upcomingEvents.length})
          </TabsTrigger>
          <TabsTrigger value="past">Past ({pastEvents.length})</TabsTrigger>
          <TabsTrigger value="all">All ({allEvents.length})</TabsTrigger>
        </TabsList>

        <div className="mt-8">
          <MyEventsTable
            events={allEvents}
            upcomingEvents={upcomingEvents}
            pastEvents={pastEvents}
          />
        </div>
      </Tabs>
    </div>
  );
}
