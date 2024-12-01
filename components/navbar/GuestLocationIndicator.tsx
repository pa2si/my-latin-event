"use client";

import { Badge } from "@/components/ui/badge";
import { Loader2, MapPin } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import GuestLocationContainer from "@/components/form/GuestLocationContainer";
import { useCookies } from "next-client-cookies";
import { cn } from "@/lib/utils";

interface LocationState {
  country: string;
  state: string;
  city?: string;
}

const GuestLocationIndicator = () => {
  const [open, setOpen] = useState(false);
  const [location, setLocation] = useState<LocationState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const cookies = useCookies();

  const getLocationFromCookie = useCallback(async () => {
    setIsLoading(true);
    const locationCookie = cookies.get("guestLocation");
    if (locationCookie) {
      try {
        const parsedLocation = JSON.parse(locationCookie);
        setLocation(parsedLocation);
      } catch (error) {
        console.error("Error parsing location cookie:", error);
        setLocation(null);
        setOpen(true);
      }
    } else {
      setLocation(null);
      setOpen(true);
    }
    setIsLoading(false);
  }, [cookies]);

  // Initial location check
  useEffect(() => {
    getLocationFromCookie();
  }, [getLocationFromCookie]);

  // Check for location updates when dialog closes
  useEffect(() => {
    if (!open) {
      getLocationFromCookie();
    }
  }, [open, getLocationFromCookie]);

  const displayLocation = location?.city || location?.state;

  return (
    <>
      <Badge
        variant="secondary"
        className={cn(
          "text-md cursor-pointer gap-1 text-primary transition-colors hover:bg-accent",
          isLoading && "animate-pulse",
        )}
        onClick={() => setOpen(true)}
      >
        <MapPin className="h-5 w-5" />
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          displayLocation
        )}
      </Badge>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            {location && (
              <DialogHeader>
                <DialogTitle>Location Settings</DialogTitle>
              </DialogHeader>
            )}
          </DialogHeader>
          <GuestLocationContainer onClose={() => setOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default GuestLocationIndicator;
