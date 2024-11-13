"use client";

import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import { Camera, Loader2 } from "lucide-react";
import { updateProfileImage } from "@/utils/actions";

type ProfileImageUploadProps = {
  isCreate?: boolean;
};

const ProfileImageUpload = ({ isCreate = false }: ProfileImageUploadProps) => {
  const { user, isLoaded } = useUser();
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    try {
      setError(null);
      setIsUploading(true);

      if (!isCreate) {
        // Only validate with server action if not creating
        const formData = new FormData();
        formData.append("image", file);
        const result = await updateProfileImage(formData);

        if (!result.success) {
          setError(result.error);
          return;
        }
      }

      // Always update Clerk
      await user.setProfileImage({ file });

      // Only sync with DB if not creating
      if (!isCreate) {
        const syncFormData = new FormData();
        syncFormData.append("sync", "true");
        await updateProfileImage(syncFormData);
      }
    } catch (error: any) {
      setError(error.message || "Error uploading image");
    } finally {
      setIsUploading(false);
    }
  };

  if (!isLoaded) {
    return <div className="h-32 w-32 animate-pulse rounded-full bg-gray-100" />;
  }

  return (
    <div className="w-fit">
      <div className="group relative w-fit">
        <div className="relative h-32 w-32 overflow-hidden rounded-full bg-gray-100">
          {user?.imageUrl ? (
            <img
              src={user.imageUrl}
              alt="Profile"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <Camera className="h-12 w-12 text-gray-400" />
            </div>
          )}

          {isUploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <Loader2 className="h-8 w-8 animate-spin text-white" />
            </div>
          )}

          {!isUploading && (
            <label className="absolute inset-0 flex cursor-pointer flex-col items-center justify-center bg-black/50 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
                name="image"
              />
              <div className="space-y-2 text-center text-white">
                <Camera className="mx-auto h-6 w-6" />
                <p className="text-sm">Change image</p>
              </div>
            </label>
          )}
        </div>

        {error && (
          <div className="absolute -bottom-6 left-0 right-0 text-center text-sm text-red-500">
            {error}
          </div>
        )}
      </div>
      <div className="mt-8 text-xs text-gray-500">Maximum file size: 5MB</div>
    </div>
  );
};

export default ProfileImageUpload;
