"use client";

import { useState, useEffect } from "react";
import { genres } from "@/utils/genres";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Music, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCookies } from "next-client-cookies";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import GenresSelectionDialog from "@/components/form/GenresSelectionDialog";
import { useAuth } from "@clerk/nextjs";

const GenreInfo = ({ selectedGenres }: { selectedGenres: string[] }) => (
  <>
    <div className="flex items-center gap-2">
      <Music className="h-4 w-4 text-primary" />
      <div className="font-medium">Genre Filter</div>
    </div>
    <div className="text-sm text-muted-foreground">
      {selectedGenres.length > 0 ? (
        <>
          Currently showing{" "}
          <span className="font-medium text-foreground">
            {selectedGenres.length > 1 ? ` ${selectedGenres.length}` : ""}
          </span>{" "}
          genres. Select another genre to change the filter.
        </>
      ) : (
        "Select genres to filter events by music style."
      )}
    </div>
  </>
);

const GenresDropdown = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [showGenresDialog, setShowGenresDialog] = useState(false);
  const router = useRouter();
  const cookies = useCookies();
  const { isSignedIn } = useAuth();

  const selectedGenres = JSON.parse(
    cookies.get("selectedGenres") || "[]",
  ) as string[];

  // Remove the complex observer setup and simplify the conditions
  useEffect(() => {
    const genresCookie = cookies.get("selectedGenres");
    const shouldShowDialog =
      !genresCookie && (isSignedIn || cookies.get("guestLocation"));

    if (shouldShowDialog) {
      setShowGenresDialog(true);
    }
  }, [cookies, isSignedIn]);

  const handleSelect = (genre: string) => {
    let newSelectedGenres: string[];

    if (selectedGenres.includes(genre)) {
      if (selectedGenres.length > 1) {
        newSelectedGenres = selectedGenres.filter((g) => g !== genre);
      } else {
        setShowAlert(true);
        return;
      }
    } else {
      newSelectedGenres = [...selectedGenres, genre];
    }

    const expires = new Date();
    expires.setFullYear(expires.getFullYear() + 1);
    cookies.set("selectedGenres", JSON.stringify(newSelectedGenres), {
      expires,
    });
    router.refresh();
  };

  const buttonText =
    selectedGenres.length > 0
      ? `${selectedGenres.length} ${selectedGenres.length === 1 ? "Genre" : "Genres"} selected`
      : "Select Genres";

  return (
    <>
      <GenresSelectionDialog
        isOpen={showGenresDialog}
        onOpenChange={setShowGenresDialog}
      />

      {/* Mobile Sheet */}
      <div className="xl:hidden">
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="text-primary">
              {buttonText}
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <div className="grid gap-4">
              <GenreInfo selectedGenres={selectedGenres} />
              <div className="rounded-xl bg-popover p-1">
                {genres.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => handleSelect(item.label)}
                    className={cn(
                      "relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 font-anton text-sm tracking-wide outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                      selectedGenres.includes(item.label) && "text-primary",
                    )}
                  >
                    <span className="flex-1">{item.label}</span>
                    {selectedGenres.includes(item.label) && (
                      <Check className="ml-2 h-4 w-4" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Hover Version */}
      <div className="hidden xl:block" onMouseLeave={() => setIsHovered(false)}>
        <Popover open={isHovered}>
          <PopoverTrigger asChild>
            <div onMouseEnter={() => setIsHovered(true)}>
              <Button variant="outline" className="text-primary">
                {buttonText}
              </Button>
            </div>
          </PopoverTrigger>

          <PopoverContent
            className="w-64"
            align="start"
            onMouseEnter={() => setIsHovered(true)}
          >
            <div className="grid gap-4">
              <GenreInfo selectedGenres={selectedGenres} />
              <div className="rounded-xl bg-popover p-1">
                {genres.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => handleSelect(item.label)}
                    className={cn(
                      "relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-left font-anton text-sm tracking-wide text-foreground/80 outline-none transition-transform duration-100 hover:scale-105 hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                      selectedGenres.includes(item.label) && "text-primary",
                    )}
                  >
                    <span className="flex-1 text-left">{item.label}</span>
                    {selectedGenres.includes(item.label) && (
                      <Check className="ml-2 h-4 w-4" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
        <AlertDialogContent>
          <AlertDialogTitle>Cannot Remove Genre</AlertDialogTitle>
          <AlertDialogDescription>
            You must maintain at least one genre selection to help us show you
            relevant events.
          </AlertDialogDescription>
          <AlertDialogCancel onClick={() => setShowAlert(false)}>
            OK
          </AlertDialogCancel>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default GenresDropdown;
