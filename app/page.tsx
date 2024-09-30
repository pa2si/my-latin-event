import LoadingCards from '@/components/card/LoadingCards';
import GenresList from '@/components/home/GenresList';
import EventsContainer from '@/components/home/EventsContainer';
import { Suspense } from 'react';

const HomePage = ({
  searchParams,
}: {
  searchParams: { genre?: string; search?: string };
}) => {
  return (
    <div className="text-3xl">
      <section>
        <GenresList genre={searchParams?.genre} search={searchParams?.search} />
        <Suspense fallback={<LoadingCards />}>
          <EventsContainer
            genre={searchParams?.genre}
            search={searchParams?.search}
          />
        </Suspense>
      </section>
    </div>
  );
};
export default HomePage;
