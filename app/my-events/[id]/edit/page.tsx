import { fetchMyLocationDetails, updateEventAction } from "@/utils/actions";
import FormContainer from "@/components/form/FormContainer";
import PriceInput from "@/components/form/PriceInput";
import TextAreaInput from "@/components/form/TextAreaInput";
import CounterInput from "@/components/form/CounterInput";
import { SubmitButton } from "@/components/form/Buttons";
import { redirect } from "next/navigation";
import DateAndTimePickerContainer from "@/components/form/DateAndTimePickerContainer";
import { latinStyles } from "@/utils/styles";
import NameAndSubtitleContainer from "@/components/form/NameAndSubtitleContainer";
import ImageInput from "@/components/form/ImageInput";
import GenresInput from "@/components/form/GenresInput";
import StylesInput from "@/components/form/StylesInput";
import AddressInputContainer from "@/components/form/AddressInputContainer";
import { Style } from "@/utils/types";
import FormInput from "@/components/form/FormInput";
import OrganizerSelect from "@/components/form/OrganizerSelect";
import { User, Pencil, MapPin } from "lucide-react";
import HeaderSection from "@/components/ui/HeaderSection";

async function EditMyEventPage({ params }: { params: { id: string } }) {
  const event = await fetchMyLocationDetails(params.id);
  if (!event) redirect("/");

  // Create style objects with proper selected state
  const styleObjects: Style[] = event.styles.map(styleName => ({
    name: styleName,
    selected: true
  }));

  return (
    <section>
      <HeaderSection
        title="edit event"
        icon={Pencil}
        breadcrumb={{
          name: "edit event",
          parentPath: "/",
          parentName: "Home",
        }}
      />

      <div className="-mx-4 rounded-md border p-8 sm:mx-0">
        <div className="flex items-center gap-2 mb-4">
          <p>📋</p>
          <h3 className="text-lg font-medium">General Info</h3>
        </div>
        <FormContainer action={updateEventAction}>
          <input type="hidden" name="id" value={event.id} />
          <ImageInput imageUrl={event.image} />
          <NameAndSubtitleContainer
            defaultName={event.name}
            defaultSubtitle={event.subtitle || ""}
          />
          <div className="mb-4 grid gap-8 md:grid-cols-2">
            <PriceInput defaultValue={event.price} />
            <FormInput
              type="url"
              name="ticketLink"
              label="Ticket Link"
              placeholder="https://..."
              defaultValue={event.ticketLink || ""}
            />
            <GenresInput
              defaultValue={event.genres}
              defaultStyles={styleObjects}
            />
          </div>
          <StylesInput
            defaultGenres={event.genres}
            defaultStyles={styleObjects}
          />
          <TextAreaInput
            name="description"
            labelText="Description (max 100 Words)"
            defaultValue={event.description || ""}
          />
          <div className="flex items-center mt-12 gap-2 mb-4">
            <p>📍</p>
            <h3 className="text-lg font-medium">Direction</h3>
          </div>
          <AddressInputContainer
            defaultValues={{
              location: event.location ?? "",
              city: event.city ?? "",
              street: event.street ?? "",
              postalCode: event.postalCode ?? "",
              country: event.country ?? "",
              googleMapsLink: event.googleMapsLink ?? "",
            }}
          />

          <div className="flex items-center mt-8 gap-2 mb-4">
            <MapPin className="h-5 w-5" />
            <h3 className="text-lg font-medium">Location Details</h3>
          </div>
          <CounterInput
            detail="floors"
            defaultValue={event.floors ?? undefined}
          />
          <CounterInput
            detail="bars"
            defaultValue={event.bars ?? undefined}
          />
          <CounterInput
            detail="outdoorAreas"
            defaultValue={event.outdoorAreas ?? undefined}
          />
          <DateAndTimePickerContainer
            defaultValue={event.eventDateAndTime}
            defaultEndValue={event.eventEndDateAndTime || ""}
          />

          <div className="flex items-center mt-8 gap-2 mb-4">
            <User className="h-5 w-5" />
            <h3 className="text-lg font-medium">Organizer*</h3>
          </div>

          <OrganizerSelect defaultValue={event.organizer.id} />
          <SubmitButton text="edit event" className="mt-12" />
        </FormContainer>
      </div>
    </section>
  );
}

export default EditMyEventPage;