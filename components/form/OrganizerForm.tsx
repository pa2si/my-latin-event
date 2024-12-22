import React from "react";
import FormContainer from "@/components/form/FormContainer";
import FormInput from "@/components/form/FormInput";
import { SubmitButton } from "@/components/form/Buttons";
import ImageInput from "@/components/form/ImageInput";
import { Organizer } from "@/utils/types";
import { createOrganizerAction, updateOrganizerAction } from "@/utils/actions";

type OrganizerFormProps = {
  organizer?: Organizer | null;
  isEdit: boolean;
  onSuccess: () => void;
};

const OrganizerForm: React.FC<OrganizerFormProps> = ({
  organizer = null,
  isEdit = false,
  onSuccess,
}) => {
  const wrappedAction = async (prevState: any, formData: FormData) => {
    const result = await (
      isEdit ? updateOrganizerAction : createOrganizerAction
    )(prevState, formData);

    if (!result.message.toLowerCase().includes("error")) {
      // Call onSuccess after successful submission
      onSuccess();
    }

    return result;
  };

  return (
    <FormContainer action={wrappedAction}>
      {organizer && <input type="hidden" name="id" value={organizer.id} />}

      <ImageInput imageUrl={organizer?.organizerImage} isProfileImage />
      <div className="flex flex-col space-y-4">
        <FormInput
          type="text"
          name="organizerName"
          label="Organizer Name*"
          defaultValue={organizer?.organizerName}
          required
        />

        <FormInput
          type="text"
          name="slogan"
          label="Slogan"
          defaultValue={organizer?.slogan || ""}
          description="A catchy phrase that describes your organization"
          hasMaxChar
          maxChar={40}
        />

        <FormInput
          type="email"
          name="contactEmail"
          label="Contact Email"
          defaultValue={organizer?.contactEmail || ""}
          description="Email address for inquiries"
        />

        <FormInput
          type="url"
          name="contactWebsite"
          label="Website"
          defaultValue={organizer?.contactWebsite || ""}
          description="Your organization's website URL"
        />

        <FormInput
          type="tel"
          name="contactPhone"
          label="Contact Phone"
          defaultValue={organizer?.contactPhone || ""}
          description="Your phone number (e.g., WhatsApp)"
        />

        <FormInput
          type="text"
          name="contactSocialMedia"
          label="Social Media"
          defaultValue={organizer?.contactSocialMedia || ""}
          description="Your primary social media profile link"
        />

        <p className="mb-4 mt-2 text-sm text-gray-500">* Required field</p>
      </div>

      <SubmitButton
        text={isEdit ? "Update Organizer" : "Add Organizer"}
        className="mt-4 w-full"
      />
    </FormContainer>
  );
};

export default OrganizerForm;
