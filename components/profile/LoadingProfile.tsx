import { Skeleton } from "@/components/ui/skeleton";

export function ProfileSkeleton() {
  return (
    <div className="flex flex-row items-center space-y-8 rounded-lg border p-4">
      {/* Profile image skeleton */}
      <Skeleton className="h-32 w-32 rounded-full" />

      {/* Text content skeletons */}
      <div className="flex-1 space-y-10">
        <Skeleton className="h-9" /> {/* Name */}
        <Skeleton className="h-9" /> {/* Description/details */}
      </div>

      {/* Action buttons skeleton */}
      <div className="flex space-x-2">
        <Skeleton className="h-9 w-9 rounded-md" /> {/* Edit button */}
        <Skeleton className="h-9 w-9 rounded-md" /> {/* Delete button */}
      </div>
    </div>
  );
}

export function OrganizerSkeletonList() {
  return (
    <div className="space-y-4">
      <ProfileSkeleton />
      <ProfileSkeleton />
      <ProfileSkeleton />
    </div>
  );
}
