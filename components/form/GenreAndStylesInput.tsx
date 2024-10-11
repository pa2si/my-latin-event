'use client';

import { useState, useEffect } from 'react';
import GenresInput from '@/components/form/GenresInput';
import StylesInput from '@/components/form/StylesInput';
import getStyles from '@/utils/getStyles';
import { FiMusic } from 'react-icons/fi';
import { Style } from '@/utils/styles';

const GenreAndStylesInput = ({
  defaultGenre,
  defaultStyles,
}: {
  defaultGenre: string;
  defaultStyles: Style[];
}) => {
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

  return (
    <>
      <GenresInput defaultValue={defaultGenre} onChange={setSelectedGenre} />
      <div className="mb-12 flex-row justify-center">
        <div className="flex flex-row items-center gap-1 text-xl">
          <h3 className="text-lg mt-10 mb-6 font-medium">Styles</h3>
          <div className="mt-4">
            <FiMusic />
          </div>
        </div>
        <StylesInput styles={styles} />
      </div>
    </>
  );
};

export default GenreAndStylesInput;
