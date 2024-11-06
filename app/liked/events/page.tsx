import CalendarToggleBtn from "@/components/events/CalendarToggleBtn";
import EmptyList from "@/components/home/EmptyList";
import EventsList from "@/components/home/EventsList";
import HeaderSection from "@/components/ui/HeaderSection";
import { fetchLikes } from "@/utils/actions";

const LikedEventsPage = async () => {
  const likes = await fetchLikes();

  if (likes.length === 0) {
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
          description="See all Events you have liked"
          breadcrumb={{
            name: "Liked Events",
            parentPath: "/",
            parentName: "Home",
          }}
        />
        <CalendarToggleBtn events={likes} />
      </div>

      <EventsList events={likes} />
    </div>
  );
};

export default LikedEventsPage;
