"use client";

import { useEffect } from "react";
import getStyles from "@/utils/getStyles";
import { Style } from "@/utils/styles";
import { useGenreStylesStore } from "./store";

export function useGenreStyles(initialGenre: string, initialStyles: Style[]) {
  const { selectedGenre, setSelectedGenre, styles, setStyles } =
    useGenreStylesStore();

  useEffect(() => {
    if (!selectedGenre) {
      setSelectedGenre(initialGenre);
    }
  }, [initialGenre, selectedGenre, setSelectedGenre]);

  useEffect(() => {
    const fetchStyles = async () => {
      const allStyles = (await getStyles(selectedGenre)) || [];
      const updatedStyles = allStyles.map((style) => ({
        ...style,
        selected: initialStyles.some(
          (s) => s.name === style.name && s.selected,
        ),
      }));
      setStyles(updatedStyles);
    };

    fetchStyles();
  }, [selectedGenre, initialStyles, setStyles]);

  return {
    selectedGenre,
    setSelectedGenre,
    styles,
    setStyles,
  };
}
