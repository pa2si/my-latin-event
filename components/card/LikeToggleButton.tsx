import { auth } from "@clerk/nextjs/server";
import { CardSignInButton } from "../form/Buttons";
import { fetchLikeId } from "@/utils/actions";
import LikeToggleForm from "./LikeToggleForm";

async function LikeToggleButton({ eventId }: { eventId: string }) {
  const { userId } = auth();
  if (!userId) return <CardSignInButton />;
  const likeId = await fetchLikeId({ eventId });

  return <LikeToggleForm likeId={likeId} eventId={eventId} />;
}
export default LikeToggleButton;
