import FormContainer from "@/components/form/FormContainer";
import { updateProfileAction, fetchProfile } from "@/utils/actions";
import FormInput from "@/components/form/FormInput";
import { SubmitButton } from "@/components/form/Buttons";
import ImageInput from "@/components/form/ImageInput";
import { Label } from "@/components/ui/label";

const ProfilePage = async () => {
  const profile = await fetchProfile();

  return (
    <section>
      <h1 className="mb-8 text-2xl font-semibold capitalize">user profile</h1>
      <div className="rounded-md border p-8">
        <p className="mb-1">
          <Label>Profile Image</Label>
        </p>
        <FormContainer action={updateProfileAction}>
          <ImageInput imageUrl={profile.profileImage} isProfileImage={true} />
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <FormInput
              type="text"
              name="firstName"
              label="First Name"
              defaultValue={profile.firstName}
            />
            <FormInput
              type="text"
              name="lastName"
              label="Last Name"
              defaultValue={profile.lastName}
            />
            <FormInput
              type="text"
              name="username"
              label="Username"
              defaultValue={profile.username}
            />
            <FormInput
              type="text"
              name="slogan"
              label="Slogan (optional)"
              defaultValue={profile.slogan || undefined}
            />
          </div>
          <SubmitButton text="Update Profile" className="mt-8" />
        </FormContainer>
      </div>
    </section>
  );
};
export default ProfilePage;
