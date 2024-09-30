import {
  fetchMyEventDetails,
  updateEventImageAction,
  updateEventAction,
} from '@/utils/actions';
import FormContainer from '@/components/form/FormContainer';
import FormInput from '@/components/form/FormInput';
import GenresInput from '@/components/form/GenresInput';
import PriceInput from '@/components/form/PriceInput';
import TextAreaInput from '@/components/form/TextAreaInput';
import CountriesInput from '@/components/form/CountriesInput';
import CounterInput from '@/components/form/CounterInput';
import StylesInput from '@/components/form/StylesInput';
import { SubmitButton } from '@/components/form/Buttons';
import { redirect } from 'next/navigation';
import { type Style } from '@/utils/styles';
import ImageInputContainer from '@/components/form/ImageInputContainer';

async function EditMyEventPage({ params }: { params: { id: string } }) {
  const event = await fetchMyEventDetails(params.id);

  if (!event) redirect('/');

  const defaultStyles: Style[] = JSON.parse(event.styles);

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
            <GenresInput defaultValue={event.genre} />
            <CountriesInput defaultValue={event.country} />
          </div>

          <TextAreaInput
            name="description"
            labelText="Description (10 - 100 Words)"
            defaultValue={event.description}
          />

          <h3 className="text-lg mt-8 mb-4 font-medium">
            Accommodation Details
          </h3>
          <CounterInput detail="guests" defaultValue={event.guests} />
          <CounterInput detail="bedrooms" defaultValue={event.bedrooms} />
          <CounterInput detail="beds" defaultValue={event.beds} />
          <CounterInput detail="baths" defaultValue={event.baths} />
          <h3 className="text-lg mt-10 mb-6 font-medium">Styles</h3>
          <StylesInput defaultValue={defaultStyles} />
          <SubmitButton text="edit event" className="mt-12" />
        </FormContainer>
      </div>
    </section>
  );
}
export default EditMyEventPage;
