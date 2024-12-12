"use client";

import React, { useState, useEffect, useRef } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { genres } from "@/utils/genres";
import { useGenreStylesStore } from "@/utils/store";
import SelectionDialog from "@/components/form/SelectionDialog";
import { Check } from "lucide-react";
import { Style } from "@/utils/types";

const name = "genres";

const GenresInput = ({
  defaultValue,
  defaultStyles,
}: {
  defaultValue: string[];
  defaultStyles: Style[];
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { selectedGenres, setSelectedGenres } = useGenreStylesStore();
  const [buttonWidth, setButtonWidth] = useState(0);
  const buttonRef = useRef<HTMLButtonElement>(null);

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

  const formatGenresString = (genres: string[]) => {
    const joinedString = genres.join(", ");
    // Approximate characters that fit in the button (assuming average char width of 8px)
    const approximateMaxChars = Math.floor(buttonWidth / 8);
    return joinedString.length > approximateMaxChars
      ? joinedString.substring(0, approximateMaxChars) + "..."
      : joinedString;
  };

  useEffect(() => {
    if (!selectedGenres || selectedGenres.length === 0) {
      setSelectedGenres(defaultValue || [genres[0].label]);
    }
  }, [defaultValue, selectedGenres, setSelectedGenres]);

  const handleGenreChange = (e: React.MouseEvent, value: string) => {
    e.preventDefault();
    const newSelectedGenres = selectedGenres.includes(value)
      ? selectedGenres.filter((genre) => genre !== value)
      : [...selectedGenres, value];
    setSelectedGenres(newSelectedGenres);
  };

  return (
    <div className="mb-2">
      <Label htmlFor={name} className="capitalize">
        Genres
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

      {/* Change this to pass the array directly */}
      <input
        type="hidden"
        name="genres"
        value={JSON.stringify(selectedGenres)}
      />
    </div>
  );
};

export default GenresInput;