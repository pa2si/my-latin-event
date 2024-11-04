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
    { value: floors, label: "floor" },
    { value: bars, label: "bar" },
    { value: outdoorAreas, label: "outdoor area" },
  ].filter((item) => item.value > 0);

  if (items.length === 0) return null;

  return (
    <p className="text-sm text-muted-foreground">
      {items.map((item, index) => (
        <span key={index}>
          <span className="text-primary">{item.value}</span>
          {` ${item.value === 1 ? item.label : item.label + "s"}`}
          {index < items.length - 1 && <span> &middot; </span>}
        </span>
      ))}
    </p>
  );
}

export default LocationDetails;
