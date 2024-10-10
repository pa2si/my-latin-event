import {
  fetchMyEventDetails,
  updateEventImageAction,
  updateEventAction,
} from '@/utils/actions';
import FormContainer from '@/components/form/FormContainer';
import FormInput from '@/components/form/FormInput';
import PriceInput from '@/components/form/PriceInput';
import TextAreaInput from '@/components/form/TextAreaInput';
import CountriesInput from '@/components/form/CountriesInput';
import CounterInput from '@/components/form/CounterInput';
import { SubmitButton } from '@/components/form/Buttons';
import { redirect } from 'next/navigation';
import ImageInputContainer from '@/components/form/ImageInputContainer';
import GenreAndStylesInput from '@/components/form/GenreAndStylesInput';
import DatePickerContainer from '@/components/form/DateAndTimePickerContainer';
import { Style } from '@/utils/styles';

async function EditMyEventPage({ params }: { params: { id: string } }) {
  const event = await fetchMyEventDetails(params.id);

  if (!event) redirect('/');

  let parsedStyles: Style[] = [];
  try {
    parsedStyles = JSON.parse(event.styles as string);
  } catch (error) {
    console.error('Error parsing styles:', error);
    // If parsing fails, default to an empty array
    parsedStyles = [];
  }

  return (
    <section>
      <h1 className="text-2xl font-semibold mb-8 capitalize">Edit Event</h1>
      <div className="border p-8 rounded-md ">
        <ImageInputContainer
          name={event.name}
          text="Update Image"
          action={updateEventImageAction}
          image={event.image}
        >
          <input type="hidden" name="id" value={event.id} />
        </ImageInputContainer>

        <FormContainer action={updateEventAction}>
          <input type="hidden" name="id" value={event.id} />
          <div className="grid md:grid-cols-2 gap-8 mb-4 mt-8">
            <FormInput
              name="name"
              type="text"
              label="Name (20 limit)"
              defaultValue={event.name}
            />
            <FormInput
              name="tagline"
              type="text "
              label="Tagline (30 limit)"
              defaultValue={event.tagline}
            />
            <PriceInput defaultValue={event.price} />
            <GenreAndStylesInput
              defaultGenre={event.genre}
              defaultStyles={parsedStyles}
            />
          </div>

          <TextAreaInput
            name="description"
            labelText="Description (10 - 100 Words)"
            defaultValue={event.description}
          />
          <CountriesInput defaultValue={event.country} />

          <h3 className="text-lg mt-8 mb-4 font-medium">
            Accommodation Details
          </h3>
          <CounterInput detail="floors" defaultValue={event.floors} />
          <CounterInput detail="bars" defaultValue={event.bars} />
          <CounterInput
            detail="outdoorAreas"
            defaultValue={event.outdoorAreas}
          />
          <DatePickerContainer initialDate={event.eventDate} />
          <SubmitButton text="edit event" className="mt-12" />
        </FormContainer>
      </div>
    </section>
  );
}
export default EditMyEventPage;
