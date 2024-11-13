import { auth } from "@clerk/nextjs/server";
import { FollowButton } from "../form/Buttons";
import { fetchFollowId } from "@/utils/actions";
import FollowToggleForm from "./FollowToggleForm";

async function FollowToggleButton({ organizerId }: { organizerId: string }) {
  const { userId } = auth();
  if (!userId) return <FollowButton />;

  const followId = await fetchFollowId({ organizerId });

  return <FollowToggleForm followId={followId} organizerId={organizerId} />;
}

export default FollowToggleButton;
