"use client";

import { usePathname } from "next/navigation";
import FormContainer from "../form/FormContainer";
import { toggleFollowAction } from "@/utils/actions";
import { FollowSubmitButton } from "../form/Buttons";

function FollowToggleForm({
  profileId,
  followId,
}: {
  profileId: string;
  followId: string | null;
}) {
  const pathname = usePathname();
  const toggleAction = toggleFollowAction.bind(null, {
    profileId,
    followId,
    pathname,
  });

  return (
    <FormContainer action={toggleAction}>
      <FollowSubmitButton isFollowing={followId ? true : false} />
    </FormContainer>
  );
}

export default FollowToggleForm;
