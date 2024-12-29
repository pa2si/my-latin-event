import { Skeleton } from "@/components/ui/skeleton";

export const LoadingCalendar = () => {
  return (
    <div className="relative">
      <div className="w-full px-4">
        {/* Navigation Header */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <Skeleton className="h-9 w-9 rounded-lg" />
            <Skeleton className="h-9 w-32 rounded-lg" />
            <Skeleton className="h-9 w-9 rounded-lg" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-9 w-16 rounded-lg" />
            <Skeleton className="h-9 w-16 rounded-lg" />
            <Skeleton className="h-9 w-16 rounded-lg" />
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="flex flex-wrap justify-center gap-3 xl:grid xl:grid-cols-7">
          {[...Array(35)].map((_, index) => (
            <Skeleton
              key={index}
              className="month-view xl-view-reset min-w-custom-640 min-w-custom-700 min-w-custom-740 min-w-custom-770 min-w-custom-780 min-w-custom-820 min-w-custom-848 min-w-custom-900 min-w-custom-928 min-w-custom-1008 min-w-custom-1024 min-w-custom-1132 max-h-[140px] min-h-[300px] min-w-[140px] flex-1 rounded-lg md:min-h-[150px] md:min-w-[80px] md:max-w-[90px] lg:min-w-[119px]"
            />
          ))}
        </div>

        {/* Fixed Calendar Toggle Button */}
        <div className="fixed bottom-4 right-4 z-50 sm:bottom-8 sm:right-8">
          <Skeleton className="h-10 w-10 rounded-full sm:h-12 sm:w-12" />
        </div>
      </div>
    </div>
  );
};

export function LoadingCards() {
  return (
    <div className="mt-4">
      {/* Page Header Skeleton */}
      <div className="mb-8">
        <Skeleton className="mb-2 h-8 w-48" /> {/* Title */}
        <Skeleton className="h-6 w-96" /> {/* Subtitle */}
      </div>

      {/* Cards Grid */}
      <section className="mt-4 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
      <Skeleton className="mt-2 h-4 w-3/4" />
      <Skeleton className="mt-2 h-4 w-1/2" />
    </div>
  );
}

export function LoadingTable({ rows }: { rows?: number }) {
  return (
    <section>
      <div className="mt-4">
        {/* Header Section */}
        <div className="mb-8">
          <Skeleton className="mb-2 h-10 w-48" /> {/* Title */}
          <Skeleton className="h-6 w-72" /> {/* Subtitle */}
        </div>
      </div>

      {/* Table Section */}
      <div className="mt-16">
        <Skeleton className="mb-4 h-8 w-48" /> {/* Header skeleton */}
        <div className="rounded-md">
          {/* Table header skeleton */}
          <div className="">
            <div className="flex justify-between">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-5 w-20" />
              ))}
            </div>
          </div>
          {/* Table rows */}
          <div className="space-y-4">
            {[...Array(rows || 5)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function LoadingEventForm() {
  return (
    <section>
      <div className="mb-8">
        {/* Breadcrumb skeleton */}
        <div className="flex items-center gap-3">
          <Skeleton className="h-6 w-12" />
          <Skeleton className="h-6 w-24" />
        </div>
        {/* Title and description skeleton */}
        <div className="mt-8">
          <div className="flex items-center gap-4">
            <Skeleton className="h-12 w-48" />
          </div>
          <Skeleton className="mt-3 h-6 w-72" />
        </div>
      </div>

      {/* Form Card Section */}
      <Skeleton className="-mx-4 h-dvh w-full rounded-md p-8 sm:mx-0" />
    </section>
  );
}

export function LoadingEventDetails() {
  return (
    <div className="mx-auto max-w-7xl px-4">
      {/* Header Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex gap-3">
            <Skeleton className="h-6 w-16" /> {/* Home */}
            <Skeleton className="h-6 w-24" /> {/* Test */}
          </div>
        </div>
      </div>

      {/* Title and header elements - Now outside the grid */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-96 rounded-md" />
          <div className="flex gap-3">
            <Skeleton className="h-10 w-10" />
            <Skeleton className="h-10 w-10" />
            <Skeleton className="h-10 w-10" />
            <Skeleton className="h-10 w-10" />
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-8 xl:grid-cols-12">
        {/* Main Content */}
        <div className="xl:col-span-9">
          {/* Image */}
          <Skeleton className="h-[300px] w-full rounded-md md:h-[500px]" />

          {/* Quick Info Card */}
          <Skeleton className="mt-6 h-[180px] w-full rounded-lg" />

          {/* Responsive Components Grid */}
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:hidden">
            <div className="order-1 mx-auto sm:mx-0">
              <Skeleton className="h-[350px] w-[300px] rounded-lg" />
            </div>
            <div className="order-2 space-y-6">
              <Skeleton className="h-[200px] rounded-lg" />
              <Skeleton className="h-[200px] rounded-lg" />
              <Skeleton className="h-[100px] rounded-lg" />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="hidden xl:col-span-3 xl:block">
          <div className="sticky top-8 space-y-6">
            <Skeleton className="h-[300px] rounded-lg" />
            <Skeleton className="h-[150px] rounded-lg" />
            <Skeleton className="h-[150px] rounded-lg" />
          </div>
        </aside>
      </div>
    </div>
  );
}
