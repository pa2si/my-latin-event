"use client";

import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EventsList from "@/components/events/EventsList";
import CalendarToggleBtn from "@/components/events/CalendarToggleBtn";
import { TabEvent, LikeIdsMap } from "@/utils/types";

interface FollowedOrganizersEventsContainerProps {
  events: TabEvent[];
  likeIds: LikeIdsMap;
}

const FollowedOrganizersEventsContainer = ({
  events,
  likeIds,
}: FollowedOrganizersEventsContainerProps) => {
  const [currentTab, setCurrentTab] = React.useState("upcoming");

  // Sort events into past and upcoming
  const now = new Date();
  const pastEvents = events.filter(
    (event) => new Date(event.eventDateAndTime) < now,
  );
  const upcomingEvents = events.filter(
    (event) => new Date(event.eventDateAndTime) >= now,
  );

  const getCurrentEvents = () => {
    switch (currentTab) {
      case "past":
        return pastEvents;
      case "upcoming":
        return upcomingEvents;
      default:
        return events;
    }
  };

  const getEventsLabel = () => {
    switch (currentTab) {
      case "past":
        return "All Past Events From Your Favorite Organizers";
      case "upcoming":
        return "All Upcoming Events From Your Favorite Organizers";
      default:
        return "All Events From Your Favorite Organizers";
    }
  };

  const currentEvents = getCurrentEvents();

  return (
    <div className="mt-8">
      <Tabs
        defaultValue="upcoming"
        className="w-full"
        onValueChange={(value) => {
          setCurrentTab(value);
          const searchParams = new URLSearchParams(window.location.search);
          searchParams.set("tab", value);
          window.history.pushState(null, "", `?${searchParams.toString()}`);
        }}
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upcoming">
            Upcoming ({upcomingEvents.length})
          </TabsTrigger>
          <TabsTrigger value="past">Past ({pastEvents.length})</TabsTrigger>
          <TabsTrigger value="all">All ({events.length})</TabsTrigger>
        </TabsList>

        <div className="mt-8">
          <div className="mb-4">
            <h4 className="capitalize">
              {getEventsLabel()}: {currentEvents.length}
            </h4>
          </div>
          <EventsList events={currentEvents} likeIds={likeIds} />
        </div>
      </Tabs>
      <CalendarToggleBtn events={currentEvents} />
    </div>
  );
};

export default FollowedOrganizersEventsContainer;
