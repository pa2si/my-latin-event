"use client";

import React, { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchOrganizers } from "@/utils/actions";

interface Organizer {
  id: string;
  organizerName: string;
  organizerImage: string;
  slogan: string | null;
  profileId: string;
  createdAt: Date;
  updatedAt: Date;
}

// Component for the selected value display in the trigger
const OrganizerTriggerContent = ({ organizer }: { organizer: Organizer }) => (
  <div className="flex w-full items-center space-x-4">
    <img
      src={organizer.organizerImage}
      alt={organizer.organizerName}
      className="h-8 w-8 flex-shrink-0 rounded-full object-cover"
    />
    <div className="flex min-w-0 flex-col">
      <p className="truncate text-sm font-medium">{organizer.organizerName}</p>
      {organizer.slogan && (
        <p className="truncate pl-2 text-xs text-muted-foreground">
          {organizer.slogan}
        </p>
      )}
    </div>
  </div>
);

// Component for items in the dropdown
const OrganizerItemContent = ({ organizer }: { organizer: Organizer }) => (
  <div className="flex items-center space-x-4">
    <img
      src={organizer.organizerImage}
      alt={organizer.organizerName}
      className="h-8 w-8 flex-shrink-0 rounded-full object-cover"
    />
    <div className="grid gap-0.5">
      <p className="text-sm font-medium">{organizer.organizerName}</p>
      {organizer.slogan && (
        <p className="text-xs text-muted-foreground">{organizer.slogan}</p>
      )}
    </div>
  </div>
);

const OrganizerSelect = ({ defaultValue = "" }) => {
  const [organizers, setOrganizers] = useState<Organizer[]>([]);
  const [selectedId, setSelectedId] = useState(defaultValue);
  const [isLoading, setIsLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const loadOrganizers = async () => {
      try {
        const fetchedOrganizers = await fetchOrganizers();
        setOrganizers(fetchedOrganizers);

        if (fetchedOrganizers.length === 0) {
          setShowDialog(true);
        } else {
          setSelectedId(defaultValue || fetchedOrganizers[0].id);
        }
      } catch (error) {
        console.error("Error loading organizers:", error);
        setShowDialog(true);
      } finally {
        setIsLoading(false);
      }
    };

    loadOrganizers();
  }, [defaultValue]);

  if (isLoading) {
    return (
      <div className="mb-4">
        <Skeleton className="mb-2 h-4 w-24" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  const selectedOrganizer = organizers.find((o) => o.id === selectedId);

  return (
    <>
      <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>No Organizer Profile Found</AlertDialogTitle>
            <AlertDialogDescription>
              You need to create an organizer profile before creating an event.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => router.push("/")}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => router.push("/profile?tab=organizers")}
            >
              Create Organizer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="mb-4">
        <label className="mb-2 block text-sm font-medium">
          Select Organizer
        </label>
        <Select
          name="organizerId"
          value={selectedId}
          onValueChange={setSelectedId}
          required
        >
          <SelectTrigger className="w-full p-6">
            <SelectValue>
              {selectedOrganizer ? (
                <OrganizerTriggerContent organizer={selectedOrganizer} />
              ) : (
                "Select an organizer"
              )}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {organizers.map((organizer) => (
              <SelectItem key={organizer.id} value={organizer.id}>
                <OrganizerItemContent organizer={organizer} />
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </>
  );
};

export default OrganizerSelect;
