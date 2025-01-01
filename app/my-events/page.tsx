import { Suspense } from "react";
import { fetchMyEvents } from "@/utils/actions";
import EmptyList from "@/components/home/EmptyList";
import { LoadingTable } from "@/components/shared/LoadingSkeletons";
import HeaderSection from "@/components/shared/HeaderSection";
import { ClipboardList } from "lucide-react";
import MyEventsContainer from "@/components/events/MyEventsContainer";

function MyEventsPage() {
  return (
    <Suspense fallback={<LoadingTable />}>
      <EventsContent />
    </Suspense>
  );
}

async function EventsContent() {
  const myEvents = await fetchMyEvents();

  if (myEvents.length === 0) {
    return (
      <EmptyList
        heading="No events to display."
        message="Don't hesitate to create an event."
      />
    );
  }

  // Sort events into past and upcoming
  const now = new Date();
  const pastEvents = myEvents.filter(
    (event) => new Date(event.eventDateAndTime) < now,
  );
  const upcomingEvents = myEvents.filter(
    (event) => new Date(event.eventDateAndTime) >= now,
  );

  return (
    <section>
      <HeaderSection
        title="My Events"
        description="Find all your events you've created:"
        icon={ClipboardList}
        breadcrumb={{
          name: "My Events",
          parentPath: "/",
          parentName: "Home",
        }}
      />

      <MyEventsContainer
        allEvents={myEvents}
        upcomingEvents={upcomingEvents}
        pastEvents={pastEvents}
      />
    </section>
  );
}

export default MyEventsPage;
