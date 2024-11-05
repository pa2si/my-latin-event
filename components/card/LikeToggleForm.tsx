"use client";

import { usePathname } from "next/navigation";
import FormContainer from "../form/FormContainer";
import { toggleLikeAction } from "@/utils/actions";
import { CardSubmitButton } from "../form/Buttons";

type LikeToggleFormProps = {
  eventId: string;
  likeId: string | null;
};

function LikeToggleForm({ eventId, likeId }: LikeToggleFormProps) {
  const pathname = usePathname();
  const toggleAction = toggleLikeAction.bind(null, {
    eventId,
    likeId,
    pathname,
  });
  return (
    <FormContainer action={toggleAction}>
      <CardSubmitButton isLiked={likeId ? true : false} />
    </FormContainer>
  );
}
export default LikeToggleForm;
