import EmptyList from "@/components/home/EmptyList";
import { fetchMyEvents } from "@/utils/actions";
import { Suspense } from "react";
import { LoadingTable } from "@/components/shared/LoadingSkeletons";
import HeaderSection from "@/components/shared/HeaderSection";
import { ClipboardList } from "lucide-react";
import MultipleDeleteEvents from "@/components/events/MultipleDeleteEvents";

function MyEventsPage() {
  return (
    <Suspense fallback={<LoadingTable rows={5} />}>
      <EventsTable />
    </Suspense>
  );
}

async function EventsTable() {
  const myEvents = await fetchMyEvents();

  if (myEvents.length === 0) {
    return (
      <EmptyList
        heading="No events to display."
        message="Don't hesitate to create an event."
      />
    );
  }

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

      <div className="mt-16">
        <MultipleDeleteEvents events={myEvents} />
      </div>
    </section>
  );
}

export default MyEventsPage;
