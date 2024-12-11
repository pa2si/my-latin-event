import { Card, CardContent } from "@/components/ui/card";
import UserInfo from "@/components/events/UserInfo";
import FollowToggleButton from "@/components/card/FollowToggleButton";
import { checkFollowAccess } from "@/utils/actions";
import { Organizer } from "@/utils/types";

// Pick only the fields we need from Organizer type for UserInfo
type UserInfoOrganizerProps = Pick<Organizer, 'organizerName' | 'organizerImage' | 'slogan'>;

const OrganizerCard = async ({
  id,
  organizerName,
  organizerImage,
  slogan,
}: Organizer) => {
  const { canFollow } = await checkFollowAccess(id);

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between">
          <h3 className={`text-lg font-semibold ${canFollow ? "mb-4" : ""}`}>
            Event Organizer
          </h3>
          <div className="-mt-2">
            {canFollow && <FollowToggleButton organizerId={id} />}
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