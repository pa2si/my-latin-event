import { Card, CardContent } from "@/components/ui/card";
import UserInfo from "@/components/events/UserInfo";
import FollowToggleButton from "@/components/card/FollowToggleButton";
import { checkFollowAccess } from "@/utils/actions";

interface OrganizerCardProps {
  organizerId: string;
  organizerName: string;
  organizerImage: string;
  slogan?: string;
}

const OrganizerCard = async ({
  organizerId,
  organizerName,
  organizerImage,
  slogan,
}: OrganizerCardProps) => {
  const { canFollow } = await checkFollowAccess(organizerId);

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between">
          <h3 className={`text-lg font-semibold ${canFollow ? "mb-4" : ""}`}>
            Event Organizer
          </h3>
          <div className="-mt-2">
            {canFollow && <FollowToggleButton organizerId={organizerId} />}
          </div>
        </div>
        <UserInfo
          organizer={{
            organizerName,
            organizerImage,
            slogan,
          }}
        />
      </CardContent>
    </Card>
  );
};

export default OrganizerCard;
