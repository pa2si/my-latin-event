import LoadingCards from "@/components/card/LoadingCards";
import EventsContainer from "@/components/home/EventsContainer";
import { Suspense } from "react";

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
          <Suspense fallback={<LoadingCards />}>
            <EventsContainer search={searchParams?.search} />
          </Suspense>
        </section>
      </div>
    </>
  );
};

export default HomePage;
