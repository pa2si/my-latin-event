"use client";

import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <section>
      {/* Profile Image Skeleton */}
      <div className="w-fit">
        <div className="h-32 w-32 animate-pulse rounded-full bg-primary/30" />
      </div>

      {/* Form Container Skeleton */}
      <Skeleton className="mt-8 rounded-lg border p-6">
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {/* First Name, Last Name, Username Input Skeletons */}
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
              <div className="h-9 w-full animate-pulse rounded-md border bg-gray-100" />
            </div>
          ))}

          {/* Location Select Skeletons */}
          {[...Array(3)].map((_, i) => (
            <div key={i + 3} className="space-y-2">
              <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />
              <div className="h-9 w-full animate-pulse rounded-md border bg-gray-100" />
            </div>
          ))}
        </div>

        {/* Button Skeleton */}
        <div className="mt-8 h-10 w-32 animate-pulse rounded-md bg-primary/30" />
      </Skeleton>
    </section>
  );
};

export default Loading;
