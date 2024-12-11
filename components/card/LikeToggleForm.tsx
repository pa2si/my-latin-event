"use client";

import { usePathname } from "next/navigation";
import { toggleLikeAction } from "@/utils/actions";
import { CardSubmitButton } from "../form/Buttons";

type LikeToggleFormProps = {
  eventId: string;
  likeId: string | null;
};

function LikeToggleForm({ eventId, likeId }: LikeToggleFormProps) {
  const pathname = usePathname() || '/';

  return (
    <form
      action={async (formData: FormData) => {
        await toggleLikeAction({ eventId, likeId, pathname });
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <CardSubmitButton isLiked={!!likeId} />
    </form>
  );
}

export default LikeToggleForm;