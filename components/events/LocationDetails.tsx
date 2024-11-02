import { formatQuantity } from "@/utils/format";

type LocationDetailsProps = {
  details: {
    floors: number;
    bars: number;
    outdoorAreas: number;
  } | null;
};

function LocationDetails({ details }: LocationDetailsProps) {
  if (!details) return null;

  const { floors, bars, outdoorAreas } = details;

  const items = [
    floors > 0 && formatQuantity(floors, "floor"),
    bars > 0 && formatQuantity(bars, "bar"),
    outdoorAreas > 0 && formatQuantity(outdoorAreas, "outdoor area"),
  ].filter(Boolean);

  if (items.length === 0) return null;

  return (
    <p className="text-md mt-1 font-light">
      {items.map((item, index) => (
        <span key={index}>
          {item}
          {index < items.length - 1 && <span> &middot; </span>}
        </span>
      ))}
    </p>
  );
}

export default LocationDetails;
