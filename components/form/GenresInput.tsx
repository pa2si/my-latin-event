"use client";

import React, { useState, useEffect, useRef } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AlertDialog, AlertDialogContent, AlertDialogTitle, AlertDialogDescription, AlertDialogAction } from "@/components/ui/alert-dialog";
import { genres } from "@/utils/genres";
import { useGenreStylesStore } from "@/utils/store";
import SelectionDialog from "@/components/form/SelectionDialog";
import { Check } from "lucide-react";
import { Style } from "@/utils/types";
import { getStylesForMultipleGenres } from "@/utils/getStyles";

const name = "genres";

const GenresInput = ({
  defaultValue,
  defaultStyles,
}: {
  defaultValue: string[];
  defaultStyles: Style[];
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const {
    selectedGenres,
    setSelectedGenres,
    selectedStyles,
    setSelectedStyles,
    availableStyles,
    setAvailableStyles
  } = useGenreStylesStore();
  const [buttonWidth, setButtonWidth] = useState(0);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const previousGenresRef = useRef<string[]>([]);

  useEffect(() => {
    if (buttonRef.current) {
      const resizeObserver = new ResizeObserver(entries => {
        for (const entry of entries) {
          setButtonWidth(entry.contentRect.width);
        }
      });

      resizeObserver.observe(buttonRef.current);
      return () => resizeObserver.disconnect();
    }
  }, []);

  useEffect(() => {
    if (defaultValue?.length > 0) {
      setSelectedGenres(defaultValue);
    }
  }, [defaultValue, setSelectedGenres]);

  useEffect(() => {
    return () => {
      useGenreStylesStore.getState().reset();
    };
  }, []);

  useEffect(() => {
    if (!selectedGenres || selectedGenres.length === 0) {
      setSelectedGenres(defaultValue || [genres[0].label]);
    }
  }, [defaultValue, selectedGenres, setSelectedGenres]);

  useEffect(() => {
    // Only update if genres actually changed
    if (JSON.stringify(previousGenresRef.current) !== JSON.stringify(selectedGenres)) {
      if (selectedGenres.length > 0) {
        const newAvailableStyles = getStylesForMultipleGenres(selectedGenres);
        setAvailableStyles(newAvailableStyles);

        const validSelectedStyles = selectedStyles.filter(styleName =>
          newAvailableStyles.some(style => style.name === styleName)
        );

        if (JSON.stringify(validSelectedStyles) !== JSON.stringify(selectedStyles)) {
          setSelectedStyles(validSelectedStyles);
        }
      }
      previousGenresRef.current = selectedGenres;
    }
  }, [selectedGenres, selectedStyles, setAvailableStyles, setSelectedStyles]);

  const formatGenresString = (genres: string[]) => {
    const joinedString = genres.join(", ");
    const approximateMaxChars = Math.floor(buttonWidth / 8);
    return joinedString.length > approximateMaxChars
      ? joinedString.substring(0, approximateMaxChars) + "..."
      : joinedString;
  };

  const handleGenreChange = (e: React.MouseEvent, value: string) => {
    e.preventDefault();
    if (selectedGenres.length === 1 && selectedGenres.includes(value)) {
      setShowAlert(true);
      return;
    }
    const newSelectedGenres = selectedGenres.includes(value)
      ? selectedGenres.filter((genre) => genre !== value)
      : [...selectedGenres, value];
    setSelectedGenres(newSelectedGenres);
  };

  return (
    <div className="mb-4">
      <Label htmlFor={name} className="capitalize">
        Genres*
      </Label>
      <Button
        ref={buttonRef}
        type="button"
        variant="outline"
        onClick={(e) => {
          e.preventDefault();
          setIsOpen(true);
        }}
        className="w-full justify-start font-normal"
      >
        {selectedGenres.length > 0
          ? formatGenresString(selectedGenres)
          : "Select genres..."}
      </Button>

      <SelectionDialog
        open={isOpen}
        onOpenChange={setIsOpen}
        title="Choose Genres"
      >
        {genres.map((item) => (
          <Button
            key={item.label}
            type="button"
            variant="ghost"
            onClick={(e) => handleGenreChange(e, item.label)}
            className={cn(
              "w-full justify-between text-left",
              selectedGenres.includes(item.label) && "text-primary"
            )}
          >
            <span>{item.label}</span>
            {selectedGenres.includes(item.label) && <Check className="h-4 w-4" />}
          </Button>
        ))}
      </SelectionDialog>

      <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
        <AlertDialogContent>
          <AlertDialogTitle>Cannot Remove Genre</AlertDialogTitle>
          <AlertDialogDescription>
            You must maintain at least one genre selection to help us show you relevant events.
          </AlertDialogDescription>
          <AlertDialogAction onClick={() => setShowAlert(false)}>OK</AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>


      <input
        type="hidden"
        name="genres"
        value={JSON.stringify(selectedGenres)}
      />
    </div>
  );
};

export default GenresInput;