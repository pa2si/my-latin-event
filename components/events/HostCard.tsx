import { Card, CardContent } from "@/components/ui/card";
import UserInfo from "@/components/events/UserInfo";
import FollowToggleButton from "@/components/card/FollowToggleButton";
import { checkFollowAccess } from "@/utils/actions";

interface HostCardProps {
  profileId: string;
  firstName: string;
  profileImage: string;
  slogan?: string;
}

const HostCard = async ({
  profileId, // Now we only need profileId
  firstName,
  profileImage,
  slogan,
}: HostCardProps) => {
  const { canFollow } = await checkFollowAccess(profileId);

  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="mb-4 text-lg font-semibold">Event Host</h3>
        <UserInfo
          profile={{
            firstName,
            profileImage,
            slogan,
          }}
        />
        <div className="mt-1 flex justify-center">
          {canFollow && <FollowToggleButton profileId={profileId} />}
        </div>
      </CardContent>
    </Card>
  );
};

export default HostCard;
