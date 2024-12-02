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
import { Button } from "../ui/button";

interface LocationState {
  country: string;
  state: string;
  city?: string;
}

const GuestLocationIndicator = () => {
  const [open, setOpen] = useState(false);
  const [showMobilePopup, setShowMobilePopup] = useState(false);
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

  useEffect(() => {
    getLocationFromCookie();
  }, [getLocationFromCookie]);

  useEffect(() => {
    if (!open) {
      getLocationFromCookie();
    }
  }, [open, getLocationFromCookie]);

  const displayLocation = location?.city || location?.state;

  // Close mobile popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (
        !target.closest(".mobile-popup") &&
        !target.closest(".location-badge")
      ) {
        setShowMobilePopup(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const LocationInfo = () => (
    <div className="grid gap-4">
      <div className="flex items-center gap-2">
        <MapPin className="h-4 w-4 text-muted-foreground" />
        <div className="font-medium">Location Filter Active</div>
      </div>
      <div className="text-sm text-muted-foreground">
        Currently showing events in{" "}
        <span className="font-medium text-foreground">{displayLocation}</span>.
        This filter is based on your settings.
      </div>
      <div className="flex items-center gap-2">
        <Button
          className="w-full"
          onClick={() => {
            setShowMobilePopup(false);
            setOpen(true);
          }}
        >
          Update Location
        </Button>
      </div>
    </div>
  );

  return (
    <>
      <div className="relative">
        {/* Mobile version */}
        <div className="xl:hidden">
          <Badge
            variant="secondary"
            className={cn(
              "location-badge text-md cursor-pointer gap-1 text-primary transition-colors hover:bg-accent",
              isLoading && "animate-pulse",
            )}
            onClick={(e) => {
              e.stopPropagation();
              setShowMobilePopup(!showMobilePopup);
            }}
          >
            <MapPin className="h-5 w-5" />
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              displayLocation
            )}
          </Badge>
          {showMobilePopup && (
            <div className="mobile-popup fixed left-1/2 top-32 z-50 min-w-[300px] max-w-[400px] -translate-x-1/2 transform rounded-md border bg-popover p-4 text-popover-foreground shadow-md sm:top-20 xl:hidden">
              <LocationInfo />
            </div>
          )}
        </div>

        {/* Desktop version */}
        <div className="group relative hidden xl:block">
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

          <div className="absolute left-1/2 top-9 z-10 hidden w-80 -translate-x-1/2 transform group-hover:block">
            <div className="rounded-md border bg-popover p-4 text-popover-foreground shadow-md">
              <LocationInfo />
            </div>
          </div>
        </div>
      </div>

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
