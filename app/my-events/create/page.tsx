import FormInput from '@/components/form/FormInput';
import FormContainer from '@/components/form/FormContainer';
import { createEventAction } from '@/utils/actions';
import { SubmitButton } from '@/components/form/Buttons';
import PriceInput from '@/components/form/PriceInput';
import GenreAndStylesInput from '@/components/form/GenreAndStylesInput';
import TextAreaInput from '@/components/form/TextAreaInput';
import CountriesInput from '@/components/form/CountriesInput';
import ImageInput from '@/components/form/ImageInput';
import CounterInput from '@/components/form/CounterInput';
import DateAndTimePickerContainer from '@/components/form/DateAndTimePickerContainer';
import { Style } from '@/utils/styles';

const defaultGenre = 'Latin'; // Set the default genre
const defaultStyles: Style[] = [];
const CreateEvent = () => {
  const initialDate: Date | null = null; // Or set to new Date() for today
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
            <GenreAndStylesInput
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
            <DateAndTimePickerContainer initialDate={initialDate} />
          </div>
          <SubmitButton text="create event" className="mt-12" />
        </FormContainer>
      </div>
    </section>
  );
};

export default CreateEvent;
