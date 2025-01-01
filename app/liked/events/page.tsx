import { Suspense } from "react";
import EmptyList from "@/components/shared/EmptyList";
import HeaderSection from "@/components/shared/HeaderSection";
import { LoadingCards } from "@/components/shared/LoadingSkeletons";
import { TabEvent, LikeIdsMap } from "@/utils/types";
import { fetchEventsWithLikes, fetchLikes } from "@/utils/actions";
import LikedEventsContainer from "@/components/events/LikedEventsContainer";

function LikedEventsPage() {
  return (
    <Suspense fallback={<LoadingCards />}>
      <EventsContent />
    </Suspense>
  );
}

async function EventsContent() {
  const { events: likedEvents, likeIds } =
    await fetchEventsWithLikes(fetchLikes);

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

      <LikedEventsContainer events={likedEvents} likeIds={likeIds} />
    </div>
  );
}

export default LikedEventsPage;
