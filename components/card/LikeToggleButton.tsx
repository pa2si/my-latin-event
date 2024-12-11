"use client";

import { useAuth } from "@clerk/nextjs";
import { CardSignInButton } from "../form/Buttons";
import LikeToggleForm from "./LikeToggleForm";

type LikeToggleButtonProps = {
  eventId: string;
  likeId: string | null;
};

function LikeToggleButton({ eventId, likeId }: LikeToggleButtonProps) {
  const { isSignedIn } = useAuth();

  if (!isSignedIn) {
    return (
      <div onClick={(e) => e.stopPropagation()}>
        <CardSignInButton />
      </div>
    );
  }

  return <LikeToggleForm likeId={likeId} eventId={eventId} />;
}

export default LikeToggleButton;