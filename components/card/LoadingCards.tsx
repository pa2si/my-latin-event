import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';

export const LoadingCalendar = () => {
  return (
    <div className="w-full px-4 py-8">
      {/* Navigation Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" disabled>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Skeleton className="h-10 w-40" />
          <Button variant="outline" size="icon" disabled>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex gap-2">
          <Skeleton className="h-10 w-20 flex-1 sm:flex-none" />
          <Skeleton className="h-10 w-20 flex-1 sm:flex-none" />
          <Skeleton className="h-10 w-20 flex-1 sm:flex-none" />
        </div>
      </div>

      {/* Month View Day Cards */}
      <div className="flex flex-wrap gap-4 justify-center">
        {[...Array(35)].map((_, index) => (
          <Skeleton
            key={index}
            className="
              flex-1 
              min-w-[140px] max-w-[100px] md:min-w-[170px] md:max-w-[170px] 
              h-[230px]
              rounded-lg
            "
          />
        ))}
      </div>
    </div>
  );
};

export function LoadingCards() {
  return (
    <div className="mt-4">
      {/* Page Header Skeleton */}
      <div className="mb-8">
        <Skeleton className="h-8 w-48 mb-2" /> {/* Title */}
        <Skeleton className="h-6 w-96" /> {/* Subtitle */}
      </div>

      {/* Cards Grid */}
      <section className="mt-4 gap-8 grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {[...Array(8)].map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </section>
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div>
      {/* Image container with 3:4 aspect ratio */}
      <div className="relative pt-[133.33%]">
        <Skeleton className="absolute inset-0 rounded-md" />
      </div>
      {/* Event details */}
      <Skeleton className="h-4 mt-2 w-3/4" />
      <Skeleton className="h-4 mt-2 w-1/2" />
    </div>
  );
}
