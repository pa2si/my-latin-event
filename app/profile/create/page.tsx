import FormInput from "@/components/form/FormInput";
import { SubmitButton } from "@/components/form/Buttons";
import FormContainer from "@/components/form/FormContainer";
import { createProfileAction } from "@/utils/actions";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import HeaderSection from "@/components/ui/HeaderSection";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Suspense } from "react";
import { ProfileSkeleton } from "@/components/profile/LoadingProfile";
import ProfileSettings from "@/components/form/ProfileSettings";
import OrganizersTab from "@/components/profile/OrganizersTab";

const CreateProfile = async () => {
  const user = await currentUser();

  if (user?.privateMetadata?.hasProfile) redirect("/");

  const profileData = user
    ? {
        firstName: user.firstName ?? undefined,
        lastName: user.lastName ?? undefined,
        username: user.username ?? undefined,
      }
    : null;

  return (
    <section>
      <HeaderSection title="Create your Profile" />

      <div className="rounded-md border p-8">
        <Suspense fallback={<ProfileSkeleton />}>
          <ProfileSettings user={profileData} isCreate={true} />
        </Suspense>
      </div>
    </section>
  );
};

export default CreateProfile;
