import { fetchOrganizers, getAllEmailAddresses } from "@/utils/actions";
import ChangePassword from "@/components/profile/ChangePassword";
import EmailSettings from "@/components/profile/EmailSettings";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileSettings from "@/components/form/ProfileSettings";
import OrganizersTab from "@/components/profile/OrganizersTab";
import HeaderSection from "@/components/ui/HeaderSection";
import { currentUser } from "@clerk/nextjs/server";

const ProfilePage = async () => {
  const emails = await getAllEmailAddresses();
  const organizers = await fetchOrganizers();
  const user = await currentUser();

  const profileData = user
    ? {
        firstName: user.firstName ?? undefined,
        lastName: user.lastName ?? undefined,
        username: user.username ?? undefined,
      }
    : null;

  return (
    <>
      <HeaderSection
        title="Account Settings"
        breadcrumb={{
          name: "Account Settings",
          parentPath: "/",
          parentName: "Home",
        }}
      />
      <div className="rounded-md border">
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="organizers">Organizers</TabsTrigger>
            <TabsTrigger value="email">Email</TabsTrigger>
            <TabsTrigger value="password">Password</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="p-8">
            <ProfileSettings user={profileData} />
          </TabsContent>
          <TabsContent value="organizers" className="p-8">
            <OrganizersTab organizers={organizers} />
          </TabsContent>
          <TabsContent value="email" className="p-8">
            <EmailSettings emails={emails} />
          </TabsContent>

          <TabsContent value="password" className="p-8">
            <ChangePassword />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default ProfilePage;
