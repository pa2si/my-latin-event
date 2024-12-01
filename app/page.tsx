import LoadingCards from "@/components/card/LoadingCards";
import EventsContainer from "@/components/home/EventsContainer";
import GenresList from "@/components/home/GenresList";
import { Suspense } from "react";

const HomePage = async ({
  searchParams,
}: {
  searchParams: {
    genre?: string;
    search?: string;
  };
}) => {
  return (
    <>
      <div className="text-3xl">
        <section>
          <GenresList
            genre={searchParams?.genre}
            search={searchParams?.search}
          />
          <Suspense fallback={<LoadingCards />}>
            <EventsContainer
              genre={searchParams?.genre}
              search={searchParams?.search}
            />
          </Suspense>
        </section>
      </div>
    </>
  );
};

export default HomePage;
