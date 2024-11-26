import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getUserCity } from "@/utils/actions";

const CityFilterIndicator = async () => {
  const userLocation = await getUserCity();

  if (!userLocation) return null;

  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <Popover>
          <TooltipTrigger asChild>
            <PopoverTrigger asChild>
              <Badge
                variant="secondary"
                className="text-md cursor-pointer gap-1 text-primary transition-colors hover:bg-accent"
              >
                <MapPin className="h-5 w-5" />
                {userLocation.location}
              </Badge>
            </PopoverTrigger>
          </TooltipTrigger>

          <PopoverContent className="w-80" align="start">
            <div className="grid gap-4">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <div className="font-medium">Location Filter Active</div>
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
          </PopoverContent>

          <TooltipContent side="bottom" className="text-xs">
            Click to change your location filter
          </TooltipContent>
        </Popover>
      </Tooltip>
    </TooltipProvider>
  );
};

export default CityFilterIndicator;
