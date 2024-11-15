"use client";

import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { genres } from "@/utils/genres";
import { useGenreStylesStore } from "@/utils/store";
import { useGenreStyles } from "@/utils/useGenreStyles";
import { Style } from "@/utils/styles";
import SelectionDialog from "@/components/form/SelectionDialog";

const name = "genre";

const GenresInput = ({
  defaultValue,
  defaultStyles,
}: {
  defaultValue: string;
  defaultStyles: Style[];
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { selectedGenre, setSelectedGenre } = useGenreStylesStore();
  const { styles } = useGenreStyles(defaultValue, defaultStyles);

  useEffect(() => {
    if (!selectedGenre) {
      setSelectedGenre(defaultValue || genres[0].label);
    }
  }, [defaultValue, selectedGenre, setSelectedGenre]);

  const handleGenreChange = (e: React.MouseEvent, value: string) => {
    e.preventDefault();
    setSelectedGenre(value);
    setIsOpen(false);
  };

  return (
    <div className="mb-2">
      <Label htmlFor={name} className="capitalize">
        Genres
      </Label>
      <Button
        type="button"
        variant="outline"
        onClick={(e) => {
          e.preventDefault();
          setIsOpen(true);
        }}
        className="w-full justify-start text-left font-normal"
      >
        {selectedGenre}
      </Button>

      <SelectionDialog
        open={isOpen}
        onOpenChange={setIsOpen}
        title="Choose a Genre"
      >
        {genres.map((item) => (
          <Button
            key={item.label}
            type="button"
            variant="ghost"
            onClick={(e) => handleGenreChange(e, item.label)}
            className={cn(
              "w-full justify-center gap-2 text-center",
              selectedGenre === item.label && "text-primary",
            )}
          >
            <span>{item.label}</span>
          </Button>
        ))}
      </SelectionDialog>

      <input type="hidden" name={name} value={selectedGenre} />
    </div>
  );
};

export default GenresInput;
