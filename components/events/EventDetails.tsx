import { formatQuantity } from '@/utils/format';

type EventDetailsProps = {
  details: {
    bedrooms: number;
    baths: number;
    guests: number;
    beds: number;
  };
};

function EventDetails({
  details: { bedrooms, baths, guests, beds },
}: EventDetailsProps) {
  return (
    <p className="text-md font-light ">
      <span>{formatQuantity(bedrooms, 'bedroom')} &middot; </span>
      <span>{formatQuantity(baths, 'bath')} &middot; </span>
      <span>{formatQuantity(guests, 'guest')} &middot; </span>
      <span>{formatQuantity(beds, 'bed')}</span>
    </p>
  );
}
export default EventDetails;
