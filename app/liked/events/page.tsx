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
    <div>
      <HeaderSection
        title="Your Liked Events"
        description="Events you've marked as favorites"
      />
      <EventsList events={likes} />
    </div>
  );
};

export default LikedEventsPage;
