import React from "react";
import FormContainer from "@/components/form/FormContainer";
import FormInput from "@/components/form/FormInput";
import { SubmitButton } from "@/components/form/Buttons";
import OrganizerImageUpload from "@/components/profile/OrganizerImageUpload";
import { createOrganizerAction, updateOrganizerAction } from "@/utils/actions";
import { Organizer } from "@/utils/types";

type OrganizerFormProps = {
  organizer?: Organizer | null;
  isEdit: boolean;
  onClose: () => void;
};

const OrganizerForm: React.FC<OrganizerFormProps> = ({
  organizer = null,
  isEdit = false,
  onClose,
}) => {
  return (
    <FormContainer
      action={async (prevState: any, formData: FormData) => {
        try {
          if (isEdit && organizer) {
            const result = await updateOrganizerAction(formData);
            if (result.success) {
              onClose();
              return { message: "Organizer updated successfully!" };
            }
            return { message: result.message || "Failed to update organizer" };
          } else {
            const result = await createOrganizerAction(formData);
            if (result.success) {
              onClose();
              return { message: "Organizer created successfully!" };
            }
            return { message: result.message || "Failed to create organizer" };
          }
        } catch (error) {
          return { message: "An error occurred. Please try again." };
        }
      }}
    >
      {organizer && <input type="hidden" name="id" value={organizer.id} />}

      <OrganizerImageUpload
        currentImage={organizer?.organizerImage}
        organizerId={organizer?.id}
        size="md"
      />

      <FormInput
        type="text"
        name="organizerName"
        label="Organizer Name"
        defaultValue={organizer?.organizerName}
        required
      />

      <FormInput
        type="text"
        name="organizerImage"
        label="Profile Image URL"
        defaultValue={organizer?.organizerImage}
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
