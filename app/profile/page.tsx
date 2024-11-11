import {
  fetchProfile,
  getAllEmailAddresses,
  getAuthUser,
} from "@/utils/actions";

import ChangePassword from "@/components/profile/ChangePassword";
import EmailSettings from "@/components/profile/EmailSettings";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserProfileSettings from "@/components/profile/UserProfileSettings";

const ProfilePage = async () => {
  const user = await getAuthUser();
  const profile = await fetchProfile();
  const emails = await getAllEmailAddresses();

  return (
    <section>
      <h1 className="mb-8 text-2xl font-semibold capitalize">
        Profile Settings
      </h1>
      <div className="rounded-md border">
        <Tabs defaultValue="Profile" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="Profile">Profile</TabsTrigger>
            <TabsTrigger value="email">Email</TabsTrigger>
            <TabsTrigger value="password">Password</TabsTrigger>
          </TabsList>

          <TabsContent value="Profile" className="p-8">
            <UserProfileSettings
              user={{
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
              }}
              slogan={profile.slogan}
            />
          </TabsContent>
          <TabsContent value="email" className="p-8">
            <EmailSettings emails={emails} />
          </TabsContent>

          <TabsContent value="password" className="p-8">
            <ChangePassword />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default ProfilePage;
