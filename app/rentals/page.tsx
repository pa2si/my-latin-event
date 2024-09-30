import EmptyList from '@/components/home/EmptyList';
import { fetchRentals, deleteRentalAction } from '@/utils/actions';
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

async function RentalsPage() {
  const rentals = await fetchRentals();

  if (rentals.length === 0) {
    return (
      <EmptyList
        heading="No rentals to display."
        message="Don't hesitate to create a rental."
      />
    );
  }

  return (
    <div className="mt-16">
      <h4 className="mb-4 capitalize">Active Events : {rentals.length}</h4>
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
          {rentals.map((rental) => {
            const { id: eventId, name, price } = rental;
            const { totalNightsSum, orderTotalSum } = rental;
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
                  <Link href={`/rentals/${eventId}/edit`}>
                    <IconButton actionType="edit"></IconButton>
                  </Link>
                  <DeleteRental eventId={eventId} />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

const DeleteRental = ({ eventId }: { eventId: string }) => {
  const deleteRental = deleteRentalAction.bind(null, { eventId });
  return (
    <FormContainer action={deleteRental}>
      <IconButton actionType="delete" />
    </FormContainer>
  );
};

export default RentalsPage;
