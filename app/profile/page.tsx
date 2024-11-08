import { clerkClient } from "@clerk/nextjs/server";
import {
  fetchProfile,
  getAllEmailAddresses,
  getAuthUser,
  getEmailDetails,
} from "@/utils/actions";
import FormContainer from "@/components/form/FormContainer";
import { updateProfileAction } from "@/utils/actions";
import FormInput from "@/components/form/FormInput";
import { SubmitButton } from "@/components/form/Buttons";
import ProfileImageUpload from "@/components/form/ProfileImageUpload"; // We'll create this next
import ChangePassword from "@/components/form/ChangePassword";
import EmailSettings from "@/components//form/EmailSettings";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ProfilePage = async () => {
  const user = await getAuthUser();
  const profile = await fetchProfile();
  const emails = await getAllEmailAddresses();

  return (
    <section>
      <h1 className="mb-8 text-2xl font-semibold capitalize">User Profile</h1>
      <div className="rounded-md border">
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="email">Email</TabsTrigger>
            <TabsTrigger value="password">Password</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="p-8">
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
                <FormInput
                  type="text"
                  name="slogan"
                  label="Slogan"
                  defaultValue={profile.slogan ?? ""}
                  description="A catchy tagline"
                />
              </div>
              <SubmitButton text="Update Profile" className="mt-8" />
            </FormContainer>
          </TabsContent>

          <TabsContent value="email" className="p-8">
            <EmailSettings emails={emails} />
          </TabsContent>

          <TabsContent value="password" className="p-8">
            <ChangePassword />
          </TabsContent>
        </Tabs>
      </div>
      {/* <UserProfile /> */}
    </section>
  );
};

export default ProfilePage;
