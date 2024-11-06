import HeaderSection from "@/components/ui/HeaderSection";
import EventsList from "@/components/home/EventsList";
import EmptyList from "@/components/home/EmptyList";
import { fetchFollowedCreatorsEvents } from "@/utils/actions";
import CalendarToggleBtn from "@/components/events/CalendarToggleBtn";

const FollowedCreatorsEventsPage = async () => {
  const events = await fetchFollowedCreatorsEvents();

  if (events.length === 0) {
    return (
      <EmptyList
        heading="No Events From Followed Creators"
        message="Follow some creators to see their upcoming events here"
        btnText="find creators"
      />
    );
  }

  return (
    <div className="relative">
      <HeaderSection
        title="Events From Creators You Follow"
        description="Stay updated with events from your favorite creators"
      />
      <EventsList events={events} />
      <CalendarToggleBtn events={events} />
    </div>
  );
};

export default FollowedCreatorsEventsPage;
