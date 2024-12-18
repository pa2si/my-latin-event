"use client"

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import FormContainer from "@/components/form/FormContainer";
import { createEventAction } from "@/utils/actions";
import { SubmitButton } from "@/components/form/Buttons";
import PriceInput from "@/components/form/PriceInput";
import TextAreaInput from "@/components/form/TextAreaInput";
import ImageInput from "@/components/form/ImageInput";
import CounterInput from "@/components/form/CounterInput";
import DateAndTimePickerContainer from "@/components/form/DateAndTimePickerContainer";
import { Style } from "@/utils/types";
import NameAndSubtitleContainer from "@/components/form/NameAndSubtitleContainer";
import GenresInput from "@/components/form/GenresInput";
import StylesInput from "@/components/form/StylesInput";
import AddressInputContainer from "@/components/form/AddressInputContainer";
import OrganizerSelect from "@/components/form/OrganizerSelect";
import EventSuccessDialog from "@/components/form/EventSuccessDialog";
import HeaderSection from "@/components/ui/HeaderSection";
import { User, MapPin } from "lucide-react";
import FormInput from "@/components/form/FormInput";

const CreateEvent = () => {

  const router = useRouter();
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  // Get date from URL and parse it, defaulting to today if not provided
  const searchParams = useSearchParams();
  const defaultEventDateAndTime = useMemo(() => {
    const dateParam = searchParams?.get('date');
    const date = dateParam ? new Date(dateParam) : new Date();
    date.setHours(20, 0, 0, 0);
    return date;
  }, [searchParams]);

  // Wrap the createEventAction to handle success state
  const handleEventAction = async (prevState: any, formData: FormData) => {
    const result = await createEventAction(prevState, formData);
    if (result.success) {
      setShowSuccessDialog(true);
      return { ...result, success: false }; // Prevent default redirect
    }
    return result;
  };

  const handleDialogClose = () => {
    setShowSuccessDialog(false);
    router.push("/");
  };

  return (
    <section>
      <HeaderSection
        title="create event"
        description="Let everyone know about your event"
        icon='🎉'
        breadcrumb={{
          name: "create event",
          parentPath: "/",
          parentName: "Home",
        }}
      />
      <div className="-mx-4 rounded-md border p-8 sm:mx-0">
        <div className="flex items-center gap-2 mb-4">
          <p>📋</p>
          <h3 className="text-lg font-medium">General Info</h3>
        </div>
        <FormContainer action={handleEventAction}>
          <ImageInput />
          <NameAndSubtitleContainer defaultName="test" />
          <div className="mb-4 grid gap-8 md:grid-cols-2">
            <PriceInput />
            <FormInput
              type="url"
              name="ticketLink"
              label="Ticket Link"
              placeholder="https://..."
            />
            <GenresInput
              defaultValue={[]}
              defaultStyles={[]}
            />
          </div>
          <StylesInput
            defaultGenres={[]}
            defaultStyles={[]}
          />
          <TextAreaInput
            name="description"
            labelText="Description (max 100 Words)"
          />

          <div className="flex items-center mt-12 gap-2 mb-4">
            <p>📍</p>
            <h3 className="text-lg font-medium">Direction</h3>
          </div>

          <AddressInputContainer />
          <div>

            <div className="flex items-center mt-8 gap-2 mb-4">
              <MapPin className="h-5 w-5" />
              <h3 className="text-lg font-medium">Location Details</h3>
            </div>

            <CounterInput detail="floors" />
            <CounterInput detail="bars" />
            <CounterInput detail="outdoorAreas" />
            <DateAndTimePickerContainer
              defaultValue={defaultEventDateAndTime}
              defaultEndValue=""
            />
          </div>
          <div className="flex items-center mt-8 gap-2 mb-4">
            <User className="h-5 w-5" />
            <h3 className="text-lg font-medium">Organizer*</h3>
          </div>
          <OrganizerSelect />
          <SubmitButton text="create event" className="mt-12" />
        </FormContainer>

        <EventSuccessDialog
          isOpen={showSuccessDialog}
          onClose={handleDialogClose}
          paypalUsername="your-paypal@email.com"
          cryptoWallet="your-metamask-address"
          bitcoinAddress="your-bitcoin-address"
        />
      </div>
    </section>
  );
};

export default CreateEvent;
