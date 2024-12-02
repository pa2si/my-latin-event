"use client";

import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface LocationState {
  location: string;
  isCity: boolean;
}

interface ClientLocationIndicatorProps {
  userLocation: LocationState | null;
}

const ClientLocationIndicator = ({
  userLocation,
}: ClientLocationIndicatorProps) => {
  const [showMobilePopup, setShowMobilePopup] = useState(false);

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

  if (!userLocation) return null;

  const LocationInfo = () => (
    <div className="grid gap-4">
      <div className="flex items-center gap-2">
        <MapPin className="h-4 w-4 text-muted-foreground" />
        <div className="font-medium">Location Filter</div>
      </div>
      <div className="text-sm text-muted-foreground">
        Currently showing events in{" "}
        <span className="font-medium text-foreground">
          {userLocation.location}
        </span>
        . This filter is based on your profile settings.
      </div>
      <div className="flex items-center gap-2">
        <Link href="/profile" className="w-full">
          <Button className="w-full">Update Location</Button>
        </Link>
      </div>
    </div>
  );

  return (
    <div className="relative">
      {/* Mobile version */}
      <div className="xl:hidden">
        <Badge
          variant="secondary"
          className={cn(
            "location-badge text-md cursor-pointer gap-1 text-primary transition-colors hover:bg-accent",
          )}
          onClick={(e) => {
            e.stopPropagation();
            setShowMobilePopup(!showMobilePopup);
          }}
        >
          <MapPin className="h-5 w-5" />
          {userLocation.location}
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
          className="text-md cursor-pointer gap-1 text-primary transition-colors hover:bg-accent"
        >
          <MapPin className="h-5 w-5" />
          {userLocation.location}
        </Badge>

        <div className="absolute top-9 z-10 hidden w-80 group-hover:block">
          <div className="rounded-md border bg-popover p-4 text-popover-foreground shadow-md">
            <LocationInfo />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientLocationIndicator;
