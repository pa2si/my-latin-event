"use client";
import React, { useState, useRef } from "react";
import { SingleImageDropzone } from "@/components/form/SingleImageDropzone";
import { useEdgeStore } from "@/lib/edgestore";

interface ImageUploadContainerProps {
  name: string;
}

const ImageUploadContainer: React.FC<ImageUploadContainerProps> = ({
  name,
}) => {
  const [file, setFile] = useState<File>();
  const [progress, setProgress] = useState<number>(0);
  const { edgestore } = useEdgeStore();
  const uploadResponseRef = useRef<{ url: string } | null>(null);

  const handleImageUpload = async (newFile: File | undefined) => {
    setFile(newFile);
    if (newFile) {
      try {
        const res = await edgestore.publicImages.upload({
          file: newFile,
          options: {
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
        value={file}
        dropzoneOptions={{
          maxSize: 1024 * 1024 * 5, // 5MB
        }}
        onChange={handleImageUpload}
      />
      <div className="h-[6px] w-[12.5rem] overflow-hidden rounded border border-black">
        <div
          className="h-full bg-green-600 transition-all duration-150"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default ImageUploadContainer;
