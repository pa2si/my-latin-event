"use client";

import { BaseImageUpload } from "@/components/form/BaseImageUpload";
import { updateOrganizerImage } from "@/utils/actions";

interface OrganizerImageUploadProps {
  currentImage?: string | null;
  organizerId: string;
  size?: "sm" | "md" | "lg";
}

const OrganizerImageUpload = ({
  currentImage,
  organizerId,
  size = "md",
}: OrganizerImageUploadProps) => {
  const handleImageChange = async (file: File) => {
    const formData = new FormData();
    formData.append("image", file);
    formData.append("organizerId", organizerId);

    const result = await updateOrganizerImage(formData);

    if (!result.success) {
      throw new Error(result.error);
    }
  };

  return (
    <BaseImageUpload
      currentImage={currentImage}
      onImageChange={handleImageChange}
      alt="Organizer"
      size={size}
    />
  );
};

export default OrganizerImageUpload;
