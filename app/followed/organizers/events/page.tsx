import HeaderSection from "@/components/ui/HeaderSection";
import EventsList from "@/components/home/EventsList";
import EmptyList from "@/components/home/EmptyList";
import {
  fetchBreadcrumbInfo,
  fetchFollowedOrganizersEvents,
} from "@/utils/actions";
import CalendarToggleBtn from "@/components/events/CalendarToggleBtn";
import BreadCrumbs from "@/components/events/BreadCrumbs";

const FollowedOrganizerEventsPage = async () => {
  const events = await fetchFollowedOrganizersEvents();
  const breadcrumbInfo = await fetchBreadcrumbInfo();

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
        title="Events From Organizers You Follow"
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
