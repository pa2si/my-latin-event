import React from "react";
import ProfileImageUpload from "./ProfileImageUpload";
import FormContainer from "../form/FormContainer";
import FormInput from "../form/FormInput";
import { updateProfileAction } from "@/utils/actions";
import { SubmitButton } from "../form/Buttons";

interface UserProfileSettingsProps {
  user: {
    username: string | null;
    firstName?: string | null;
    lastName?: string | null;
  };
  slogan: string | null;
}

const UserProfileSettings = ({ user, slogan }: UserProfileSettingsProps) => {
  return (
    <section>
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
        <FormInput
          type="text"
          name="slogan"
          label="Slogan"
          defaultValue={slogan ?? ""}
          description="A catchy tagline"
        />

        <SubmitButton text="Update Profile" className="mt-8" />
      </FormContainer>
    </section>
  );
};

export default UserProfileSettings;
