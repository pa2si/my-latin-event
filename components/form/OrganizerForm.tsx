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

      <FormInput
        type="text"
        name="organizerName"
        label="Organizer Name"
        defaultValue={organizer?.organizerName}
        required
      />

      <FormInput
        type="text"
        name="slogan"
        label="Slogan"
        defaultValue={organizer?.slogan || ""}
        description="A catchy phrase that describes your organization"
      />

      <SubmitButton
        text={isEdit ? "Update Organizer" : "Add Organizer"}
        className="mt-4 w-full"
      />
    </FormContainer>
  );
};

export default OrganizerForm;
