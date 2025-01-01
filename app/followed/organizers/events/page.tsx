import HeaderSection from "@/components/shared/HeaderSection";
import EmptyList from "@/components/shared/EmptyList";
import {
  fetchFollowedOrganizersEvents,
  fetchEventsWithLikes,
} from "@/utils/actions";
import FollowedOrganizersEventsContainer from "@/components/events/FollowedOrganizersEventsContainer";

const FollowedOrganizerEventsPage = async () => {
  const { events, likeIds } = await fetchEventsWithLikes(
    fetchFollowedOrganizersEvents,
  );

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
      <FollowedOrganizersEventsContainer events={events} likeIds={likeIds} />
    </div>
  );
};

export default FollowedOrganizerEventsPage;
