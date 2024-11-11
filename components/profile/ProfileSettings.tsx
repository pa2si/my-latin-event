import React from "react";
import ProfileImageUpload from "./ProfileImageUpload";
import FormContainer from "../form/FormContainer";
import FormInput from "../form/FormInput";
import { updateProfileAction } from "@/utils/actions";
import { SubmitButton } from "../form/Buttons";
import TabDescription from "./TabDescription";

interface UserProfileSettingsProps {
  user: {
    username: string | null;
    firstName?: string | null;
    lastName?: string | null;
  };
}

const UserProfileSettings = ({ user }: UserProfileSettingsProps) => {
  return (
    <section>
      <TabDescription description="Make your Profile Settings..." />
      <ProfileImageUpload />
      <FormContainer action={updateProfileAction}>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <FormInput
            type="text"
            name="firstName"
            label="First Name"
            defaultValue={user.firstName ?? ""}
          />
          <FormInput
            type="text"
            name="lastName"
            label="Last Name"
            defaultValue={user.lastName ?? ""}
          />
          <FormInput
            type="text"
            name="username"
            label="Username"
            defaultValue={user.username ?? ""}
            description="Can only be 1 word"
            required
          />
        </div>

        <SubmitButton text="Update Profile" className="mt-8" />
      </FormContainer>
    </section>
  );
};

export default UserProfileSettings;
