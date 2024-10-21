"use client";

import Image from "next/image";
import React, { useState, useRef, useEffect } from "react";
import { IoCloudUploadOutline } from "react-icons/io5";
import { MdOutlineCancel } from "react-icons/md";

interface ImageInputProps {
  imageUrl?: string;
}

const ImageInput: React.FC<ImageInputProps> = ({ imageUrl }) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const name = "image";

  useEffect(() => {
    if (imageUrl) {
      setImagePreview(imageUrl);
    }
  }, [imageUrl]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleClearImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setImagePreview(null);
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSelectClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div
      className={`relative mb-4 flex h-52 w-52 cursor-pointer flex-col items-center justify-center rounded-lg ${
        imagePreview
          ? ""
          : "transition-color border-2 border-dashed duration-200 hover:border-primary"
      }`}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        id={name}
        name={name}
        className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
        onChange={handleImageUpload}
      />

      {imagePreview ? (
        <>
          <Image
            src={imagePreview}
            alt="Preview"
            className="h-full w-full rounded-lg object-cover"
            fill
            sizes="(max-width: 768px) 30vw, 20vw"
          />
          <button
            onClick={handleClearImage}
            className="absolute -right-3 -top-3 rounded-full bg-background p-[0.1rem] text-2xl transition-transform duration-200 hover:scale-110"
          >
            <MdOutlineCancel />
          </button>
        </>
      ) : (
        <>
          <div className="pointer-events-none flex flex-col items-center text-4xl text-gray-400">
            <IoCloudUploadOutline />
            <span className="text-sm">drag & drop to upload</span>
          </div>
          <button
            onClick={handleSelectClick}
            className="absolute bottom-8 rounded-lg bg-gray-500 px-4 py-1 text-sm text-gray-100 transition-colors duration-200 hover:bg-primary focus:outline-none focus:ring-1 focus:ring-gray-600"
            type="button"
          >
            select
          </button>
        </>
      )}
      {file && <input type="hidden" name="newImage" value="true" />}
    </div>
  );
};

export default ImageInput;
