'use client';

import { useState, useEffect } from 'react';
import getStyles from '@/utils/getStyles';
import { Style } from '@/utils/styles';

export function useGenreStyles(defaultGenre: string, defaultStyles: Style[]) {
  const [selectedGenre, setSelectedGenre] = useState<string>(defaultGenre);
  const [styles, setStyles] = useState<Style[]>(() => {
    const allStyles = getStyles(defaultGenre) || [];
    return allStyles.map((style) => ({
      ...style,
      selected: defaultStyles.some((s) => s.name === style.name && s.selected),
    }));
  });

  useEffect(() => {
    const allStyles = getStyles(selectedGenre) || [];
    setStyles(
      allStyles.map((style) => ({
        ...style,
        selected: defaultStyles.some(
          (s) => s.name === style.name && s.selected
        ),
      }))
    );
  }, [selectedGenre, defaultStyles]);

  return {
    selectedGenre,
    setSelectedGenre,
    styles,
    setStyles,
  };
}
