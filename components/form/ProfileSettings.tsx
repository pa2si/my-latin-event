import React from "react";
import ProfileImageUpload from "../profile/ProfileImageUpload";
import FormContainer from "./FormContainer";
import FormInput from "./FormInput";
import { createProfileAction, updateProfileAction } from "@/utils/actions";
import { SubmitButton } from "./Buttons";
import TabDescription from "../profile/TabDescription";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface ProfileSettingsProps {
  user: {
    firstName?: string;
    lastName?: string;
    username?: string;
  } | null;
  isCreate?: boolean;
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({
  user,
  isCreate,
}) => {
  return (
    <section>
      <ProfileImageUpload isCreate={isCreate} />
      <FormContainer
        action={isCreate ? createProfileAction : updateProfileAction}
      >
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <FormInput
            type="text"
            name="firstName"
            label="First Name"
            description="(Optional)"
            defaultValue={user?.firstName ?? ""}
          />
          <FormInput
            type="text"
            name="lastName"
            label="Last Name"
            description="(Optional)"
            defaultValue={user?.lastName ?? ""}
          />
          <FormInput
            type="text"
            name="username"
            label="Username"
            defaultValue={user?.username ?? ""}
            description="Must be one word only"
            required
          />
        </div>
        {isCreate && (
          <Alert variant="default" className="mt-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                To create events, you need to add an Organizer Profile in your
                Profile Settings later.
              </AlertDescription>
            </div>
          </Alert>
        )}
        <SubmitButton
          text={isCreate ? "Create Profile" : "Update Profile"}
          className="mt-8"
        />
      </FormContainer>
    </section>
  );
};

export default ProfileSettings;
