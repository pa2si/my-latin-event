'use client';

import GenresInput from '@/components/form/GenresInput';
import StylesInput from '@/components/form/StylesInput';
import { FiMusic } from 'react-icons/fi';
import { Style } from '@/utils/styles';
import { useGenreStyles } from '@/utils/useGenreStyles';

const GenreAndStylesContainer = ({
  defaultGenre,
  defaultStyles,
}: {
  defaultGenre: string;
  defaultStyles: Style[];
}) => {
  const { selectedGenre, setSelectedGenre, styles } = useGenreStyles(
    defaultGenre,
    defaultStyles
  );

  return (
    <>
      <GenresInput defaultValue={defaultGenre} onChange={setSelectedGenre} />
      <div className="mb-12 flex-row justify-center ">
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

export default GenreAndStylesContainer;
