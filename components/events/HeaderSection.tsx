import React from "react";
import BreadCrumbs from "./BreadCrumbs";
import ShareButton from "./ShareButton";
import LikeToggleButton from "../card/LikeToggleButton";
import EditMyEvent from "./EditMyEvent";
import DeleteEvent from "./DeleteEvent";
import { fetchLikeId } from "@/utils/actions";

interface HeaderSectionsProps {
  eventId: string;
  eventName: string;
  eventSubtitle?: string | null;
  canEdit: boolean;
}

const HeaderSections = async ({
  eventId,
  eventName,
  eventSubtitle,
  canEdit,
}: HeaderSectionsProps) => {

  const likeId = await fetchLikeId({ eventId });

  return (
    <div className="mb-4 ">
      <BreadCrumbs name={eventName} />
      <div className="mt-8">

        <div className="mt-4 items-center justify-between sm:flex">
          <div>
            <h1 className="mb-1 font-anton text-4xl font-bold">{eventName}</h1>
            {eventSubtitle && (
              <p className="text-xl text-muted-foreground">{eventSubtitle}</p>
            )}
          </div>
          <div className="mt-4 flex gap-4 sm:mt-0">
            <ShareButton name={eventName} eventId={eventId} />
            <LikeToggleButton eventId={eventId} likeId={likeId} />
            {canEdit && (
              <>
                <EditMyEvent eventId={eventId} />
                <DeleteEvent eventId={eventId} />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderSections;
