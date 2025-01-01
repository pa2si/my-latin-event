"use client";

import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EventsList from "@/components/events/EventsList";
import CalendarToggleBtn from "@/components/events/CalendarToggleBtn";
import { TabEvent, LikeIdsMap } from "@/utils/types";

interface LikedEventsContainerProps {
  events: TabEvent[];
  likeIds: LikeIdsMap;
}

const LikedEventsContainer = ({
  events,
  likeIds,
}: LikedEventsContainerProps) => {
  // Sort events into past and upcoming
  const now = new Date();
  const pastEvents = events.filter(
    (event) => new Date(event.eventDateAndTime) < now,
  );
  const upcomingEvents = events.filter(
    (event) => new Date(event.eventDateAndTime) >= now,
  );

  const [currentTab, setCurrentTab] = React.useState("upcoming");

  // Get the correct set of events based on the current tab
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

  const getLikedEventsLabel = () => {
    switch (currentTab) {
      case "past":
        return "All Past Liked Events";
      case "upcoming":
        return "All Upcoming Liked Events";
      default:
        return "All Liked Events";
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
              {getLikedEventsLabel()}: {currentEvents.length}
            </h4>
          </div>
          <EventsList events={currentEvents} likeIds={likeIds} />
        </div>
      </Tabs>
      <CalendarToggleBtn events={currentEvents} />
    </div>
  );
};

export default LikedEventsContainer;
