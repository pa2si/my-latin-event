import React from "react";
import BreadCrumbs from "./BreadCrumbs";
import ShareButton from "./ShareButton";
import LikeToggleButton from "../card/LikeToggleButton";
import EditMyEvent from "./EditMyEvent";
import DeleteEvent from "./DeleteEvent";
import { fetchLikeId } from "@/utils/actions";
import { Button } from "../ui/button";
import { Ticket } from "lucide-react";
import { TooltipProvider } from "../ui/tooltip";
import TooltipWrapper from "@/components/shared/TooltipWrapper"; // Add this import

interface HeaderSectionsProps {
  eventId: string;
  eventName: string;
  eventSubtitle?: string | null;
  ticketLink?: string | null; // Add this
  canEdit: boolean;
}

const HeaderSections = async ({
  eventId,
  eventName,
  eventSubtitle,
  ticketLink,
  canEdit,
}: HeaderSectionsProps) => {

  const likeId = await fetchLikeId({ eventId });

  return (
    <div className="mb-4 ">
      <BreadCrumbs name={eventName} />
      <div className="mt-8">

        <div className="mt-4 items-center justify-between sm:flex">
          <div>
            <h1 className="text-3xl font-anton tracking-wide capitalize">{eventName}</h1>
            {eventSubtitle && (
              <p className="text-xl font-anton text-muted-foreground">{eventSubtitle}</p>
            )}
          </div>
          <div className="mt-4 flex gap-4 sm:mt-0">
            <TooltipProvider>
              {ticketLink && (
                <TooltipWrapper tooltipText="Buy Ticket">
                  <Button asChild variant="outline" size="icon" className="cursor-pointer p-2">
                    <a href={ticketLink} target="_blank" rel="noopener noreferrer">
                      <Ticket className="h-4 w-4" />
                    </a>
                  </Button>
                </TooltipWrapper>
              )}
              <TooltipWrapper tooltipText="Share Event">
                <div>
                  <ShareButton name={eventName} eventId={eventId} />
                </div>
              </TooltipWrapper>
              <TooltipWrapper tooltipText="Like Event">
                <div>
                  <LikeToggleButton eventId={eventId} likeId={likeId} />
                </div>
              </TooltipWrapper>
              {canEdit && (
                <>
                  <TooltipWrapper tooltipText="Edit Event">
                    <div>
                      <EditMyEvent eventId={eventId} />
                    </div>
                  </TooltipWrapper>
                  <TooltipWrapper tooltipText="Delete Event">
                    <div>
                      <DeleteEvent eventId={eventId} />
                    </div>
                  </TooltipWrapper>
                </>
              )}
            </TooltipProvider>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderSections;
