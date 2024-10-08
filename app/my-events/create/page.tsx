'use client';

import { useState, useEffect } from 'react';
import { FiMusic } from 'react-icons/fi';
import FormInput from '@/components/form/FormInput';
import FormContainer from '@/components/form/FormContainer';
import { createEventAction } from '@/utils/actions';
import { SubmitButton } from '@/components/form/Buttons';
import PriceInput from '@/components/form/PriceInput';
import GenresInput from '@/components/form/GenresInput';
import TextAreaInput from '@/components/form/TextAreaInput';
import CountriesInput from '@/components/form/CountriesInput';
import ImageInput from '@/components/form/ImageInput';
import CounterInput from '@/components/form/CounterInput';
import StylesInput from '@/components/form/StylesInput';
import getStyles from '@/utils/getStyles';

const defaultGenre = 'Latin'; // Set the default genre

const CreateEvent = () => {
  const [selectedGenre, setSelectedGenre] = useState<string>(defaultGenre);
  const [styles, setStyles] = useState(getStyles(defaultGenre));

  useEffect(() => {
    setStyles(getStyles(selectedGenre));
  }, [selectedGenre]);

  const handleGenreChange = (genre: string) => {
    setSelectedGenre(genre);
  };

  return (
    <section>
      <h1 className="text-2xl font-semibold mb-8 capitalize">create event</h1>
      <div className="border p-8 rounded-md">
        <h3 className="text-lg mb-4 font-medium">General Info</h3>
        <FormContainer action={createEventAction}>
          <div className="grid md:grid-cols-2 gap-8 mb-4">
            <FormInput
              name="name"
              type="text"
              label="Name (100 limit)"
              defaultValue="My Event"
            />
            <FormInput
              name="tagline"
              type="text"
              label="Tagline (30 limit)"
              defaultValue="This is your catchy event phrase"
            />
            <PriceInput />
            <GenresInput
              defaultValue={defaultGenre}
              onChange={handleGenreChange}
            />
          </div>

          <div className="mb-12 flex-row justify-center">
            <div className="flex flex-row items-center gap-1 text-xl">
              <h3 className="text-lg mt-10 mb-6 font-medium">Styles</h3>
              <div className="mt-4">
                <FiMusic />
              </div>
            </div>
            <StylesInput styles={styles || []} />
          </div>

          <TextAreaInput
            name="description"
            labelText="Description (10 - 1000 Words)"
          />
          <div className="grid sm:grid-cols-2 gap-8 mt-4">
            <CountriesInput />
            <ImageInput />
          </div>
          <h3 className="text-lg mt-8 mb-4 font-medium">Location Details</h3>
          <CounterInput detail="floors" />
          <CounterInput detail="bars" />
          <CounterInput detail="outdoorAreas" />
          <SubmitButton text="create event" className="mt-12" />
        </FormContainer>
      </div>
    </section>
  );
};

export default CreateEvent;
