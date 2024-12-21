import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
} from "lucide-react";
import { Card, CardContent } from "../ui/card";

export const LoadingCalendar = () => {
  return (
    <div className="w-full px-4 py-8">
      {/* Navigation Header */}
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
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
      <div className="flex flex-wrap justify-center gap-4 xl:grid xl:grid-cols-7 xl:gap-3">
        {[...Array(42)].map((_, index) => (
          <Skeleton
            key={index}
            className="min-h-[300px] min-w-[140px] flex-1 rounded-lg md:min-h-[230px] md:min-w-[170px] md:max-w-[170px] xl:w-full xl:min-w-0 xl:max-w-none"
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
      {/* Header Section Skeleton */}
      <div className="mb-8">
        {/* Breadcrumb skeleton */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-20" />
        </div>
        {/* Title and description skeleton */}
        <div className="mt-8">
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-48" />
          </div>
          <Skeleton className="mt-1 h-5 w-96" />
        </div>
      </div>

      {/* Table Section */}
      <div className="mt-16">
        <Skeleton className="mb-4 h-8 w-48" /> {/* Header skeleton */}
        <div className="rounded-md border">
          {/* Table header skeleton */}
          <div className="border-b p-4">
            <div className="flex justify-between">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-5 w-20" />
              ))}
            </div>
          </div>
          {/* Table rows */}
          <div className="space-y-4 p-4">
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
      {/* Header Section Skeleton */}
      <div className="mb-8">
        {/* Breadcrumb skeleton */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-20" />
        </div>
        {/* Title and description skeleton */}
        <div className="mt-8">
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-48" />
          </div>
          <Skeleton className="mt-1 h-5 w-96" />
        </div>
      </div>

      {/* Form Card Section */}
      <div className="-mx-4 rounded-md border p-8 sm:mx-0">
        {/* Section Title */}
        <div className="mb-4 flex items-center gap-1">
          <Skeleton className="h-5 w-5" /> {/* Icon */}
          <Skeleton className="h-6 w-32" /> {/* Title */}
        </div>

        {/* Image Input Skeleton */}
        <Skeleton className="mb-8 h-[300px] w-full rounded-lg" />

        {/* Form Inputs */}
        <div className="space-y-6">
          {/* Single column inputs */}
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i}>
                <Skeleton className="mb-2 h-4 w-24" /> {/* Label */}
                <Skeleton className="h-10 w-full" /> {/* Input */}
              </div>
            ))}
          </div>

          {/* Two column grid inputs */}
          <div className="grid gap-8 md:grid-cols-2">
            {[...Array(6)].map((_, i) => (
              <div key={i}>
                <Skeleton className="mb-2 h-4 w-24" /> {/* Label */}
                <Skeleton className="h-10 w-full" /> {/* Input */}
              </div>
            ))}
          </div>

          {/* Submit Button */}
          <Skeleton className="mt-12 h-10 w-full max-w-[200px]" />
        </div>
      </div>
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
