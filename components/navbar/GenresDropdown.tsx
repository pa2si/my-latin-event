"use client";

import { genres } from "@/utils/genres";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "../ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { Music } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useCookies } from "next-client-cookies";

const GENRE_COOKIE_KEY = "selectedGenre";

const GenreInfo = ({ genre }: { genre: string | null }) => (
  <>
    <div className="flex items-center gap-2">
      <Music className="h-4 w-4 text-primary" />
      <div className="font-medium">Genre Filter</div>
    </div>

    <div className="text-sm text-muted-foreground">
      {genre ? (
        <>
          Currently showing{" "}
          <span className="font-medium text-foreground">{genre}</span> events.
          Select another genre to change the filter.
        </>
      ) : (
        "Select a genre to filter events by music style."
      )}
    </div>
  </>
);

const GenresDropdown = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();
  const cookies = useCookies();

  const genre = cookies.get(GENRE_COOKIE_KEY) || null;

  const handleSelect = (selectedGenre: string) => {
    const expires = new Date();
    expires.setFullYear(expires.getFullYear() + 1);

    cookies.set(GENRE_COOKIE_KEY, selectedGenre, {
      expires,
    });
    router.refresh();
    setIsHovered(false);
    setIsDropdownOpen(false);
  };

  const handleClear = () => {
    cookies.remove(GENRE_COOKIE_KEY);
    router.refresh();
    setIsHovered(false);
    setIsDropdownOpen(false);
  };

  return (
    <>
      {/* Mobile Dropdown */}
      <div className="xl:hidden">
        <DropdownMenu onOpenChange={setIsDropdownOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="text-primary">
              {genre ? `${genre} Events` : "Select Genre"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-80">
            <div className="grid gap-4 p-4">
              <GenreInfo genre={genre} />
              <div className="rounded-xl border bg-popover p-1">
                {genres.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => handleSelect(item.label)}
                    className={cn(
                      "relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                      genre === item.label && "text-primary",
                    )}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Desktop Hover Version */}
      <div
        className="hidden xl:block"
        onMouseLeave={() => {
          setIsHovered(false);
          setIsDropdownOpen(false);
        }}
      >
        <Popover open={isHovered}>
          <PopoverTrigger asChild>
            <div onMouseEnter={() => setIsHovered(true)}>
              <Button variant="outline" className="text-primary">
                {genre ? `${genre} Events` : "Select Genre"}
              </Button>
            </div>
          </PopoverTrigger>

          <PopoverContent
            className="w-80"
            align="start"
            onMouseEnter={() => {
              setIsHovered(true);
              setIsDropdownOpen(true);
            }}
          >
            <div className="grid gap-4">
              <GenreInfo genre={genre} />
              <div className="rounded-xl border bg-popover p-1">
                {genres.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => handleSelect(item.label)}
                    className={cn(
                      "relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                      genre === item.label && "text-primary",
                    )}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
              {genre && (
                <Button
                  variant="ghost"
                  onClick={handleClear}
                  className="text-muted-foreground hover:text-foreground"
                >
                  Clear Filter
                </Button>
              )}
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </>
  );
};

export default GenresDropdown;
