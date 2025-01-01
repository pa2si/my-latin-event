import { Suspense } from "react";
import { LoadingCalendar } from "@/components/shared/LoadingSkeletons";
import EventsContainer from "@/components/events/EventsContainer";

const HomePage = async ({
  searchParams,
}: {
  searchParams: {
    search?: string;
  };
}) => {
  return (
    <>
      <div className="text-3xl">
        <section>
          <Suspense fallback={<LoadingCalendar />}>
            <EventsContainer searchParams={searchParams} />
          </Suspense>
        </section>
      </div>
    </>
  );
};

export default HomePage;
