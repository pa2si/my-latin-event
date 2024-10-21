import FormContainer from "@/components/form/FormContainer";
import { createEventAction } from "@/utils/actions";
import { SubmitButton } from "@/components/form/Buttons";
import PriceInput from "@/components/form/PriceInput";
import TextAreaInput from "@/components/form/TextAreaInput";
import CountriesInput from "@/components/form/CountriesInput";
import ImageInput from "@/components/form/ImageInput";
import CounterInput from "@/components/form/CounterInput";
import DateAndTimePickerContainer from "@/components/form/DateAndTimePickerContainer";
import { Style } from "@/utils/styles";
import NameAndSubtitleContainer from "@/components/form/NameAndSubtitleContainer";
import GenresInput from "@/components/form/GenresInput";
import StylesInput from "@/components/form/StylesInput";

const defaultGenre = "Latin";
const defaultStyles: Style[] = [];

const CreateEvent = () => {
  const defaultEventDateAndTime = new Date();
  defaultEventDateAndTime.setDate(defaultEventDateAndTime.getDate());
  defaultEventDateAndTime.setHours(20, 0, 0, 0);

  return (
    <section>
      <h1 className="mb-8 text-2xl font-semibold capitalize">create event</h1>
      <div className="rounded-md border p-8">
        <h3 className="mb-4 text-lg font-medium">General Info</h3>
        <FormContainer action={createEventAction}>
          <ImageInput />
          <NameAndSubtitleContainer defaultName="test" />
          <div className="mb-4 grid gap-8 md:grid-cols-2">
            <PriceInput />
            <GenresInput
              defaultValue={defaultGenre}
              defaultStyles={defaultStyles}
            />
          </div>

          <StylesInput
            defaultGenre={defaultGenre}
            defaultStyles={defaultStyles}
          />

          <TextAreaInput
            name="description"
            labelText="Description (10 - 1000 Words)"
          />
          <h3 className="mb-4 mt-12 text-lg font-medium">Direction</h3>
          <div className="mt-4 grid gap-8 sm:grid-cols-2">
            <CountriesInput />
          </div>
          <div>
            <h3 className="mb-4 mt-8 text-lg font-medium">Location Details</h3>
            <CounterInput detail="floors" />
            <CounterInput detail="bars" />
            <CounterInput detail="outdoorAreas" />
            <DateAndTimePickerContainer
              defaultValue={defaultEventDateAndTime}
              defaultEndValue=""
            />
          </div>
          <SubmitButton text="create event" className="mt-12" />
        </FormContainer>
      </div>
    </section>
  );
};

export default CreateEvent;
