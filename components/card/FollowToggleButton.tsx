import { auth } from "@clerk/nextjs/server";
import { FollowButton } from "../form/Buttons";
import { fetchFollowId } from "@/utils/actions";
import FollowToggleForm from "./FollowToggleForm";

async function FollowToggleButton({ profileId }: { profileId: string }) {
  const { userId } = auth();
  if (!userId) return <FollowButton />;
  const followId = await fetchFollowId({ profileId });

  return <FollowToggleForm followId={followId} profileId={profileId} />;
}

export default FollowToggleButton;
