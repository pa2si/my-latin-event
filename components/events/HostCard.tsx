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
  profileId,
  firstName,
  profileImage,
  slogan,
}: HostCardProps) => {
  const { canFollow } = await checkFollowAccess(profileId);

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between">
          <h3 className={`text-lg font-semibold ${canFollow ? "mb-4" : ""}`}>
            Event Host
          </h3>
          <div className="-mt-2">
            {canFollow && <FollowToggleButton profileId={profileId} />}
          </div>
        </div>
        <UserInfo
          profile={{
            firstName,
            profileImage,
            slogan,
          }}
        />
      </CardContent>
    </Card>
  );
};

export default HostCard;
