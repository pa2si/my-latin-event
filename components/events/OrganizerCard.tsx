import { Card, CardContent } from "@/components/ui/card";
import UserInfo from "@/components/events/UserInfo";
import FollowToggleButton from "@/components/card/FollowToggleButton";
import { checkFollowAccess } from "@/utils/actions";

interface OrganizerCardProps {
  profileId: string;
  username: string;
  profileImage: string;
  slogan?: string;
}

const OrganizerCard = async ({
  profileId,
  username,
  profileImage,
  slogan,
}: OrganizerCardProps) => {
  const { canFollow } = await checkFollowAccess(profileId);

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between">
          <h3 className={`text-lg font-semibold ${canFollow ? "mb-4" : ""}`}>
            Event Organizer
          </h3>
          <div className="-mt-2">
            {canFollow && <FollowToggleButton profileId={profileId} />}
          </div>
        </div>
        <UserInfo
          profile={{
            username,
            profileImage,
            slogan,
          }}
        />
      </CardContent>
    </Card>
  );
};

export default OrganizerCard;
