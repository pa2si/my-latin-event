import { formatQuantity } from '@/utils/format';

type EventDetailsProps = {
  details: {
    floors: number;
    bars: number;
    outdoorAreas: number;
  };
};

function EventDetails({
  details: { floors, bars, outdoorAreas },
}: EventDetailsProps) {
  return (
    <p className="text-md font-light ">
      <span>{formatQuantity(floors, 'floor')} &middot; </span>
      <span>{formatQuantity(bars, 'bar')} &middot; </span>
      <span>{formatQuantity(outdoorAreas, 'outdoor area')} </span>
    </p>
  );
}
export default EventDetails;
