import { useState, useEffect } from 'react';
import GenresInput from '@/components/form/GenresInput';
import StylesInput from '@/components/form/StylesInput';
import getStyles from '@/utils/getStyles';
import { FiMusic } from 'react-icons/fi';
import { Style } from '@/utils/styles';

const GenreAndStylesInput = ({
  defaultGenre,
  defaultStyles = [], // Default to empty array if not provided
}: {
  defaultGenre: string;
  defaultStyles?: Style[]; // Optional but defaults to empty array
}) => {
  const [styles, setStyles] = useState<Style[]>(() =>
    defaultStyles?.length > 0 ? defaultStyles : getStyles(defaultGenre)
  );

  // Update styles when the selected genre changes, but only if no defaultStyles are provided
  useEffect(() => {
    if (!defaultStyles?.length) {
      setStyles(getStyles(defaultGenre));
    }
  }, [defaultGenre, defaultStyles]);

  const handleGenreChange = (genre: string) => {
    setStyles(getStyles(genre));
  };

  return (
    <>
      <GenresInput defaultValue={defaultGenre} onChange={handleGenreChange} />
      <div className="mb-12 flex-row justify-center">
        <div className="flex flex-row items-center gap-1 text-xl">
          <h3 className="text-lg mt-10 mb-6 font-medium">Styles</h3>
          <div className="mt-4">
            <FiMusic />
          </div>
        </div>
        <StylesInput styles={styles || []} />
      </div>
    </>
  );
};

export default GenreAndStylesInput;
