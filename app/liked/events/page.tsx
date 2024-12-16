import CalendarToggleBtn from "@/components/events/CalendarToggleBtn";
import EmptyList from "@/components/home/EmptyList";
import EventsList from "@/components/home/EventsList";
import HeaderSection from "@/components/ui/HeaderSection";
import { fetchLikes, fetchEventsWithLikes } from "@/utils/actions";

const LikedEventsPage = async () => {
  const { events: likedEvents, likeIds } = await fetchEventsWithLikes(fetchLikes);

  if (likedEvents.length === 0) {
    return (
      <EmptyList
        heading="No Liked Events Yet"
        message="Like some events to see them here"
        btnText="explore events"
      />
    );
  }

  return (
    <div className="relative">
      <div className="mb-6 flex items-center justify-between">
        <HeaderSection
          title="Liked Events"
          icon="❤️"
          description="See all Events you have liked"
          breadcrumb={{
            name: "Liked Events",
            parentPath: "/",
            parentName: "Home",
          }}
        />
        <CalendarToggleBtn events={likedEvents} />
      </div>

      <EventsList events={likedEvents} likeIds={likeIds} />
    </div>
  );
};

export default LikedEventsPage;
