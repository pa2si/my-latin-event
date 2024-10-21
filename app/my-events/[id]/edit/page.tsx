import { fetchMyEventDetails, updateEventAction } from "@/utils/actions";
import FormContainer from "@/components/form/FormContainer";
import PriceInput from "@/components/form/PriceInput";
import TextAreaInput from "@/components/form/TextAreaInput";
import CountriesInput from "@/components/form/CountriesInput";
import CounterInput from "@/components/form/CounterInput";
import { SubmitButton } from "@/components/form/Buttons";
import { redirect } from "next/navigation";
import DateAndTimePickerContainer from "@/components/form/DateAndTimePickerContainer";
import { Style } from "@/utils/styles";
import NameAndSubtitleContainer from "@/components/form/NameAndSubtitleContainer";
import ImageInput from "@/components/form/ImageInput";
import GenresInput from "@/components/form/GenresInput";
import StylesInput from "@/components/form/StylesInput";

async function EditMyEventPage({ params }: { params: { id: string } }) {
  const event = await fetchMyEventDetails(params.id);

  if (!event) redirect("/");

  let parsedStyles: Style[] = [];
  try {
    parsedStyles = JSON.parse(event.styles as string);
  } catch (error) {
    parsedStyles = [];
  }

  return (
    <section>
      <h1 className="mb-8 text-2xl font-semibold capitalize">Edit Event</h1>
      <div className="rounded-md border p-8">
        <h3 className="mb-4 text-lg font-medium">General Info</h3>
        <FormContainer action={updateEventAction}>
          <input type="hidden" name="id" value={event.id} />
          <ImageInput imageUrl={event.image} />
          <NameAndSubtitleContainer
            defaultName={event.name}
            defaultSubtitle={event.subtitle || ""}
          />
          <div className="mb-4 grid gap-8 md:grid-cols-2">
            <PriceInput defaultValue={event.price} />
            <GenresInput
              defaultValue={event.genre}
              defaultStyles={parsedStyles}
            />
          </div>
          <StylesInput
            defaultGenre={event.genre}
            defaultStyles={parsedStyles}
          />
          <TextAreaInput
            name="description"
            labelText="Description (10 - 100 Words)"
            defaultValue={event.description}
          />
          <h3 className="mb-4 mt-12 text-lg font-medium">Direction</h3>
          <div className="mt-4 grid gap-8 sm:grid-cols-2">
            <CountriesInput defaultValue={event.country} />
          </div>

          <h3 className="mb-4 mt-8 text-lg font-medium">Location Details</h3>
          <CounterInput detail="floors" defaultValue={event.floors} />
          <CounterInput detail="bars" defaultValue={event.bars} />
          <CounterInput
            detail="outdoorAreas"
            defaultValue={event.outdoorAreas}
          />
          <DateAndTimePickerContainer
            defaultValue={event.eventDateAndTime}
            defaultEndValue={event.eventEndDateAndTime || ""}
          />
          <SubmitButton text="edit event" className="mt-12" />
        </FormContainer>
      </div>
    </section>
  );
}
export default EditMyEventPage;
