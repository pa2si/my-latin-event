import {
  fetchOrganizers,
  fetchUserLocation,
  getAllEmailAddresses,
} from "@/utils/actions";
import ChangePassword from "@/components/profile/ChangePassword";
import EmailSettings from "@/components/profile/EmailSettings";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileSettings from "@/components/form/ProfileSettings";
import OrganizersTab from "@/components/profile/OrganizersTab";
import HeaderSection from "@/components/ui/HeaderSection";
import { currentUser } from "@clerk/nextjs/server";
import { isValidTab } from "@/utils/isValidTab";
import { ProfileTab } from "@/utils/types";

interface ProfilePageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

const ProfilePage = async ({ searchParams }: ProfilePageProps) => {
  const defaultTab: ProfileTab = isValidTab(searchParams.tab)
    ? searchParams.tab
    : "profile";

  const [emails, organizers, user, locationData] = await Promise.all([
    getAllEmailAddresses(),
    fetchOrganizers(),
    currentUser(),
    fetchUserLocation(),
  ]);

  const profileData = user
    ? {
        firstName: user.firstName ?? undefined,
        lastName: user.lastName ?? undefined,
        username: user.username ?? undefined,
        userCountry: locationData.userCountry,
        userState: locationData.userState,
        userCity: locationData.userCity,
      }
    : null;

  console.log("Profile data being passed:", profileData); // Add this to debug

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
        <Tabs defaultValue={defaultTab} className="w-full">
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
