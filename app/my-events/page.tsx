import EmptyList from '@/components/home/EmptyList';
import { fetchMyEvents, deleteMyEventAction } from '@/utils/actions';
import Link from 'next/link';

import { formatCurrency } from '@/utils/format';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import FormContainer from '@/components/form/FormContainer';
import { IconButton } from '@/components/form/Buttons';

async function MyEventsPage() {
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
    <div className="mt-16">
      <h4 className="mb-4 capitalize">Active Events : {myEvents.length}</h4>
      <Table>
        <TableCaption>A list of all your events.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Event Name</TableHead>
            <TableHead>Nightly Rate </TableHead>
            <TableHead>Nights Booked</TableHead>
            <TableHead>Total Income</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {myEvents.map((myEvent) => {
            const { id: eventId, name, price } = myEvent;
            const { totalNightsSum, orderTotalSum } = myEvent;
            return (
              <TableRow key={eventId}>
                <TableCell>
                  <Link
                    href={`/events/${eventId}`}
                    className="underline text-muted-foreground tracking-wide"
                  >
                    {name}
                  </Link>
                </TableCell>
                <TableCell>{formatCurrency(price)}</TableCell>
                <TableCell>{totalNightsSum || 0}</TableCell>
                <TableCell>{formatCurrency(orderTotalSum)}</TableCell>

                <TableCell className="flex items-center gap-x-2">
                  <Link href={`/my-events/${eventId}/edit`}>
                    <IconButton actionType="edit"></IconButton>
                  </Link>
                  <DeleteMyEvent eventId={eventId} />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

const DeleteMyEvent = ({ eventId }: { eventId: string }) => {
  const deleteMyEvent = deleteMyEventAction.bind(null, { eventId });
  return (
    <FormContainer action={deleteMyEvent}>
      <IconButton actionType="delete" />
    </FormContainer>
  );
};

export default MyEventsPage;
