"use client";

import React, { useState, useRef } from "react";
import { SingleImageDropzone } from "@/components/form/SingleImageDropzone";
import { useEdgeStore } from "@/lib/edgestore";

interface ImageUploadContainerProps {
  name: string;
  defaultImage?: string; // New prop for default image URL
}

const ImageUploadContainer: React.FC<ImageUploadContainerProps> = ({
  name,
  defaultImage,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const { edgestore } = useEdgeStore();
  const uploadResponseRef = useRef<{ url: string } | null>(null);
  const [currentImage, setCurrentImage] = useState(defaultImage); // Track the current image URL

  // Update the type of newFile to be File | undefined to handle the case when the image is cleared
  const handleImageUpload = async (newFile: File | undefined) => {
    if (!newFile) {
      // If the file is undefined, it means the image has been cleared
      setFile(null);
      setCurrentImage(undefined);

      // Clear the hidden input value as well
      const urlInput = document.querySelector(
        `input[name="${name}"]`,
      ) as HTMLInputElement;
      if (urlInput) {
        urlInput.value = ""; // Set the value to an empty string to represent no image
      }

      return;
    }

    setFile(newFile);

    if (newFile) {
      try {
        const res = await edgestore.publicImages.upload({
          file: newFile,
          options: {
            replaceTargetUrl: currentImage || undefined, // Replace existing image if it exists
            temporary: true,
          },
          onProgressChange: (progress) => setProgress(progress),
        });

        uploadResponseRef.current = res;

        // Update hidden input with the temporary URL
        const urlInput = document.querySelector(
          `input[name="${name}"]`,
        ) as HTMLInputElement;
        if (urlInput) {
          urlInput.value = res.url;
        }

        setCurrentImage(res.url); // Set the new uploaded image URL
      } catch (error) {
        console.error("Upload error:", error);
      }
    }
  };

  React.useEffect(() => {
    const form = document.querySelector("form");
    if (form) {
      const handleSubmit = async (e: SubmitEvent) => {
        if (uploadResponseRef.current) {
          try {
            await edgestore.publicImages.confirmUpload({
              url: uploadResponseRef.current.url,
            });
          } catch (error) {
            console.error("Confirmation error:", error);
            e.preventDefault();
          }
        }
      };

      form.addEventListener("submit", handleSubmit);
      return () => form.removeEventListener("submit", handleSubmit);
    }
  }, [edgestore.publicImages]);

  return (
    <div>
      <SingleImageDropzone
        width={200}
        height={200}
        value={file || currentImage} // Pass current image or file for display
        dropzoneOptions={{
          maxSize: 1024 * 1024 * 5, // 5MB
        }}
        onChange={handleImageUpload} // Pass the updated handler
      />

      <div className="h-[6px] w-[12.5rem] overflow-hidden rounded border border-black">
        <div
          className="h-full bg-green-600 transition-all duration-150"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Hidden input for the form submission */}
      <input type="hidden" name={name} value={currentImage || ""} />
    </div>
  );
};

export default ImageUploadContainer;
