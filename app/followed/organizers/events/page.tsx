import HeaderSection from "@/components/ui/HeaderSection";
import EventsList from "@/components/home/EventsList";
import EmptyList from "@/components/home/EmptyList";
import { fetchFollowedOrganizersEvents } from "@/utils/actions";
import CalendarToggleBtn from "@/components/events/CalendarToggleBtn";

const FollowedOrganizerEventsPage = async () => {
  const events = await fetchFollowedOrganizersEvents();

  if (events.length === 0) {
    return (
      <EmptyList
        heading="No Events From Followed Organizers"
        message="Follow some organizers to see their upcoming events here"
        btnText="find creators"
      />
    );
  }

  return (
    <div className="relative">
      <HeaderSection
        title="Upcoming Events From Organizers You Follow"
        description="Stay updated with events from your favorite organizers"
        breadcrumb={{
          name: "Organizers Events Feed",
          parentPath: "/",
          parentName: "Home",
        }}
      />
      <EventsList events={events} />
      <CalendarToggleBtn events={events} />
    </div>
  );
};

export default FollowedOrganizerEventsPage;
