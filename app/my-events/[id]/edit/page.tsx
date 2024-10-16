import {
  fetchMyEventDetails,
  updateEventImageAction,
  updateEventAction,
} from "@/utils/actions";
import FormContainer from "@/components/form/FormContainer";
import FormInput from "@/components/form/FormInput";
import PriceInput from "@/components/form/PriceInput";
import TextAreaInput from "@/components/form/TextAreaInput";
import CountriesInput from "@/components/form/CountriesInput";
import CounterInput from "@/components/form/CounterInput";
import { SubmitButton } from "@/components/form/Buttons";
import { redirect } from "next/navigation";
import ImageInputContainer from "@/components/form/ImageInputContainer";
import GenreAndStylesContainer from "@/components/form/GenreAndStylesContainer";
import DateAndTimePickerContainer from "@/components/form/DateAndTimePickerContainer";
import { Style } from "@/utils/styles";
import NameAndSubtitleContainer from "@/components/form/NameAndSubtitleContainer";
import ImageUploadContainer from "@/components/form/ImageUploadContainer";

async function EditMyEventPage({ params }: { params: { id: string } }) {
  const event = await fetchMyEventDetails(params.id);

  if (!event) redirect("/");

  let parsedStyles: Style[] = [];
  try {
    parsedStyles = JSON.parse(event.styles as string);
  } catch (error) {
    // console.error("Error parsing styles:", error);
    parsedStyles = [];
  }

  return (
    <section>
      <h1 className="mb-8 text-2xl font-semibold capitalize">Edit Event</h1>
      <div className="rounded-md border p-8">
        {/* <ImageUploadContainer name="image" defaultImageUrl={event.image} /> */}
        {/* <ImageInputContainer
          name={event.name}
          text="Update Image"
          action={updateEventImageAction}
          image={event.image}
        >
          <input type="hidden" name="id" value={event.id} />
        </ImageInputContainer> */}

        <FormContainer action={updateEventAction}>
          <input type="hidden" name="id" value={event.id} />
          <ImageUploadContainer name="image" defaultImage={event.image} />
          <NameAndSubtitleContainer
            defaultName={event.name}
            defaultSubtitle={event.subtitle || ""}
          />
          <div className="mb-4 grid gap-8 md:grid-cols-2">
            <PriceInput defaultValue={event.price} />
            <GenreAndStylesContainer
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

          <h3 className="mb-4 mt-8 text-lg font-medium">
            Accommodation Details
          </h3>
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
