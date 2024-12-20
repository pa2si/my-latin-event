"use client";

import { Badge } from "@/components/ui/badge";
import { AudioLines } from "lucide-react";
import { useCookies } from "next-client-cookies";

const GenreBadges = () => {
  const cookies = useCookies();
  const selectedGenres = JSON.parse(
    cookies.get("selectedGenres") || "[]",
  ) as string[];

  if (selectedGenres.length === 0) return null;

  return (
    <div className="mt-7 flex flex-wrap justify-center gap-2">
      {selectedGenres.map((genre) => (
        <Badge
          key={genre}
          variant="default"
          className="flex gap-2 bg-primary/90 text-primary-foreground"
        >
          <AudioLines className="w-4" />
          <p className="text-xs">{genre}</p>
        </Badge>
      ))}
    </div>
  );
};

export default GenreBadges;
