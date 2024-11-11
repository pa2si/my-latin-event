"use client";

import { useState } from "react";
import { Camera, Loader2 } from "lucide-react";

interface BaseImageUploadProps {
  currentImage?: string | null;
  onImageChange?: (file: File) => Promise<void>;
  size?: "sm" | "md" | "lg";
  className?: string;
  alt?: string;
}

export const BaseImageUpload = ({
  currentImage,
  onImageChange,
  size = "lg",
  className = "",
  alt = "Image",
}: BaseImageUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sizeClasses = {
    sm: "h-10 w-10",
    md: "h-24 w-24",
    lg: "h-32 w-32",
  };

  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file || !onImageChange) return;

    try {
      setError(null);
      setIsUploading(true);

      // Validate file size
      if (file.size > 5 * 1024 * 1024) {
        setError("Image must be less than 5MB");
        return;
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        setError("File must be an image");
        return;
      }

      await onImageChange(file);
    } catch (error: any) {
      setError(error.message || "Error uploading image");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-fit">
      <div className="group relative w-fit">
        <div
          className={`relative overflow-hidden rounded-full bg-gray-100 ${sizeClasses[size]} ${className}`}
        >
          {currentImage ? (
            <img
              src={currentImage}
              alt={alt}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <Camera
                className={`${size === "sm" ? "h-4 w-4" : "h-12 w-12"} text-gray-400`}
              />
            </div>
          )}

          {isUploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <Loader2
                className={`${size === "sm" ? "h-4 w-4" : "h-8 w-8"} animate-spin text-white`}
              />
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
              {size !== "sm" && (
                <div className="space-y-2 text-center text-white">
                  <Camera className="mx-auto h-6 w-6" />
                  <p className="text-sm">Change image</p>
                </div>
              )}
            </label>
          )}
        </div>

        {error && (
          <div className="absolute -bottom-6 left-0 right-0 text-center text-sm text-red-500">
            {error}
          </div>
        )}
      </div>
      {size !== "sm" && (
        <div className="mt-8 text-xs text-gray-500">Maximum file size: 5MB</div>
      )}
    </div>
  );
};
