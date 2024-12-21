import EmptyList from "@/components/home/EmptyList";
import { fetchMyEvents } from "@/utils/actions";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { IconButton } from "@/components/form/Buttons";
import DeleteEvent from "@/components/events/DeleteEvent";
import { format } from "date-fns";
import { Suspense } from "react";
import { LoadingTable } from "@/components/shared/LoadingSkeletons";
import HeaderSection from "@/components/shared/HeaderSection";
import { ClipboardList } from "lucide-react";

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
        <h4 className="mb-4 capitalize">Active Events : {myEvents.length}</h4>
        <Table>
          <TableCaption>A list of all your events.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Event Name</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Likes</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {myEvents.map((event) => {
              const formattedDate = format(
                new Date(event.eventDateAndTime),
                "dd.MM.yy",
              );
              return (
                <TableRow key={event.id}>
                  <TableCell>
                    <Link
                      href={`/events/${event.id}`}
                      className="tracking-wide text-muted-foreground underline"
                    >
                      {event.name}
                    </Link>
                  </TableCell>
                  <TableCell>{formattedDate}</TableCell>
                  <TableCell>{event.location}</TableCell>
                  <TableCell>{event.price}</TableCell>
                  <TableCell>{event._count.likes}</TableCell>
                  <TableCell className="flex items-center gap-x-2">
                    <Link href={`/my-events/${event.id}/edit`}>
                      <IconButton actionType="edit" />
                    </Link>
                    <DeleteEvent eventId={event.id} />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}

export default MyEventsPage;
