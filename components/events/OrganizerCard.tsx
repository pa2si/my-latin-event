import { Card, CardContent } from "@/components/ui/card";
import UserInfo from "@/components/events/UserInfo";
import FollowToggleButton from "@/components/card/FollowToggleButton";
import { checkFollowAccess } from "@/utils/actions";
import { Calendar } from "lucide-react";
import { Organizer } from "@/utils/types";

const OrganizerCard = async ({
  id,
  organizerName,
  organizerImage,
  slogan,
  _count
}: Organizer) => {
  const { canFollow } = await checkFollowAccess(id);

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between">
          <h3 className={`text-lg font-semibold font-mono ${canFollow ? "mb-4" : ""}`}>
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
        <div className="mt-4 flex items-center gap-2 text-muted-foreground font-mono">
          <Calendar className="h-4 w-4" />
          <span className="text-sm">{_count?.events || 0} events created</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrganizerCard;