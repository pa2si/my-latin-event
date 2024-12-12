"use client";

import { useEffect } from "react";
import getStyles from "@/utils/getStyles";
import { useGenreStylesStore } from "./store";
import { Style } from "./types";

export const useGenreStyles = (
  defaultGenre: string[] | string,
  defaultStyles: Style[],
) => {
  const { selectedGenres, setSelectedGenres, styles, setStyles } =
    useGenreStylesStore();

  useEffect(() => {
    // Convert defaultGenre to array if it's a string
    const genresArray = Array.isArray(defaultGenre)
      ? defaultGenre
      : [defaultGenre];

    if (!selectedGenres.length) {
      setSelectedGenres(genresArray);
    }

    // Get styles for all selected genres
    const allStyles = selectedGenres.flatMap((genre) => getStyles(genre));

    // Remove duplicates and preserve selection state
    const uniqueStyles = Array.from(
      new Set(allStyles.map((style) => style.name)),
    ).map((name) => {
      const style = allStyles.find((s) => s.name === name);
      return {
        ...style!,
        selected: defaultStyles.some((ds) => ds.name === name && ds.selected),
      };
    });

    setStyles(uniqueStyles);
  }, [
    defaultGenre,
    defaultStyles,
    selectedGenres,
    setSelectedGenres,
    setStyles,
  ]);

  return { styles };
};
