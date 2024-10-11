import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { genres } from '@/utils/genres';
import SelectModal from './SelectModal';
import { SelectButton } from '@/components/form/Buttons';

const name = 'genre';

const GenresInput = ({
  defaultValue,
  onChange,
}: {
  defaultValue?: string;
  onChange: (value: string) => void;
}) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState(
    defaultValue || genres[0].label
  );

  const handleGenreChange = (value: string) => {
    setSelectedGenre(value);
    onChange(value);
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
        <div className="flex flex-col p-4 h-72 overflow-scroll items-center w-full">
          {genres.map((item) => (
            <div
              key={item.label}
              onClick={() => handleGenreChange(item.label)}
              className="cursor-pointer hover:bg-gray-300 p-2 rounded flex items-center gap-2  "
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
