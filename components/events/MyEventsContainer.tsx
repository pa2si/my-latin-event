"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MyEventsTable from "@/components/events/MyEventsTable";
import { TabEvent, TabContainerProps } from "@/utils/types";

interface MyEventsContainerProps extends TabContainerProps {
  upcomingEvents: TabEvent[];
  pastEvents: TabEvent[];
}

export default function MyEventsContainer({
  events: allEvents,
  upcomingEvents,
  pastEvents,
  likeIds,
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
            likeIds={likeIds}
          />
        </div>
      </Tabs>
    </div>
  );
}
