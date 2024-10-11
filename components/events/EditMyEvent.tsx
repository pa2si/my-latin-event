import Link from 'next/link';
import { IconButton } from '../form/Buttons';

const EditMyEvent = ({ eventId }: { eventId: string }) => {
  return (
    <Link href={`/my-events/${eventId}/edit`}>
      <IconButton actionType="edit" variant="outline" />
    </Link>
  );
};

export default EditMyEvent;
