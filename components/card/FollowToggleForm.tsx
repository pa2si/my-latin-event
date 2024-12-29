"use client";

import { usePathname } from "next/navigation";
import FormContainer from "../form/FormContainer";
import { toggleFollowAction } from "@/utils/actions";
import { FollowSubmitButton } from "../form/Buttons";

function FollowToggleForm({
  organizerId,
  followId,
}: {
  organizerId: string;
  followId: string | null;
}) {
  const pathname = usePathname() ?? "/"; // Provide a default value of '/' if pathname is null

  const toggleAction = toggleFollowAction.bind(null, {
    organizerId,
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
