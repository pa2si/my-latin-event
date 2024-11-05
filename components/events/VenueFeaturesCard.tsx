import { Card, CardContent } from "@/components/ui/card";
import LocationDetails from "@/components/events/LocationDetails";

interface VenueFeaturesCardProps {
  floors: number;
  bars: number;
  outdoorAreas: number;
}

const VenueFeaturesCard = ({
  floors,
  bars,
  outdoorAreas,
}: VenueFeaturesCardProps) => {
  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="mb-4 text-lg font-semibold">Venue Features</h3>
        <LocationDetails
          details={{
            floors,
            bars,
            outdoorAreas,
          }}
        />
      </CardContent>
    </Card>
  );
};

export default VenueFeaturesCard;
