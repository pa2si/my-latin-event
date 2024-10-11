'use client';

import FormInput from '@/components/form/FormInput';
import FormContainer from '@/components/form/FormContainer';
import { createEventAction } from '@/utils/actions';
import { SubmitButton } from '@/components/form/Buttons';
import PriceInput from '@/components/form/PriceInput';
import GenreAndStylesContainer from '@/components/form/GenreAndStylesContainer';
import TextAreaInput from '@/components/form/TextAreaInput';
import CountriesInput from '@/components/form/CountriesInput';
import ImageInput from '@/components/form/ImageInput';
import CounterInput from '@/components/form/CounterInput';
import DateAndTimePickerContainer from '@/components/form/DateAndTimePickerContainer';
import { Style } from '@/utils/styles';
import NameAndSubtitleContainer from '@/components/form/NameAndSubtitleContainer';

const defaultGenre = 'Latin';
const defaultStyles: Style[] = [];

const CreateEvent = () => {
  const defaultEventDateAndTime = new Date();
  defaultEventDateAndTime.setDate(defaultEventDateAndTime.getDate());
  defaultEventDateAndTime.setHours(20, 0, 0, 0);

  return (
    <section>
      <h1 className="text-2xl font-semibold mb-8 capitalize">create event</h1>
      <div className="border p-8 rounded-md">
        <h3 className="text-lg mb-4 font-medium">General Info</h3>
        <FormContainer action={createEventAction}>
          <NameAndSubtitleContainer />
          <div className="grid md:grid-cols-2 gap-8 mb-4">
            <PriceInput />
            <GenreAndStylesContainer
              defaultGenre={defaultGenre}
              defaultStyles={defaultStyles}
            />
          </div>
          <TextAreaInput
            name="description"
            labelText="Description (10 - 1000 Words)"
          />
          <div className="grid sm:grid-cols-2 gap-8 mt-4">
            <CountriesInput />
            <ImageInput />
          </div>
          <div>
            <h3 className="text-lg mt-8 mb-4 font-medium">Location Details</h3>
            <CounterInput detail="floors" />
            <CounterInput detail="bars" />
            <CounterInput detail="outdoorAreas" />
            <DateAndTimePickerContainer
              defaultValue={defaultEventDateAndTime}
            />
          </div>
          <SubmitButton text="create event" className="mt-12" />
        </FormContainer>
      </div>
    </section>
  );
};

export default CreateEvent;
