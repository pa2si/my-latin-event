"use client";

import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { genres } from "@/utils/genres";
import SelectModal from "./SelectModal";
import { SelectButton } from "@/components/form/Buttons";
import { useGenreStylesStore } from "@/utils/store";
import { useGenreStyles } from "@/utils/useGenreStyles";
import { Style } from "@/utils/styles";

const name = "genre";

const GenresInput = ({
  defaultValue,
  defaultStyles,
}: {
  defaultValue: string;
  defaultStyles: Style[];
}) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const { selectedGenre, setSelectedGenre } = useGenreStylesStore();
  const { styles } = useGenreStyles(defaultValue, defaultStyles);

  useEffect(() => {
    if (!selectedGenre) {
      setSelectedGenre(defaultValue || genres[0].label);
    }
  }, [defaultValue, selectedGenre, setSelectedGenre]);

  const handleGenreChange = (value: string) => {
    setSelectedGenre(value);
    setModalVisible(false); // Close modal after selection
  };

  return (
    <div className="mb-2">
      <Label htmlFor={name} className="capitalize">
        Genres
      </Label>
      <SelectButton
        text={selectedGenre}
        onClick={() => setModalVisible(true)}
        className="w-full"
      />

      <SelectModal
        isVisible={isModalVisible}
        onClose={() => setModalVisible(false)}
        title="Choose a Genre"
      >
        <div className="flex h-72 w-full flex-col items-center overflow-scroll p-4">
          {genres.map((item) => (
            <div
              key={item.label}
              onClick={() => handleGenreChange(item.label)}
              className="flex cursor-pointer items-center gap-2 rounded p-2 hover:bg-gray-300"
            >
              {/* <item.icon className="text-lg" /> */}
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </SelectModal>

      <input type="hidden" name={name} value={selectedGenre} />
    </div>
  );
};

export default GenresInput;
