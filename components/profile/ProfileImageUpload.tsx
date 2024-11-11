"use client";

import { useUser } from "@clerk/nextjs";
import { BaseImageUpload } from "@/components/form/BaseImageUpload";
import { updateProfileImage } from "@/utils/actions";

const ProfileImageUpload = () => {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return <div className="h-32 w-32 animate-pulse rounded-full bg-gray-100" />;
  }

  if (!user) {
    return null; // Or some fallback UI
  }

  const handleImageChange = async (file: File) => {
    // Create form data for server action
    const formData = new FormData();
    formData.append("image", file);

    // First validate using server action
    const result = await updateProfileImage(formData);

    if (!result.success) {
      throw new Error(result.error);
    }

    // Update Clerk
    await user.setProfileImage({ file });

    // Sync with DB
    const syncFormData = new FormData();
    syncFormData.append("sync", "true");
    await updateProfileImage(syncFormData);
  };

  return (
    <BaseImageUpload
      currentImage={user.imageUrl}
      onImageChange={handleImageChange}
      alt="Profile"
      size="lg"
    />
  );
};

export default ProfileImageUpload;
