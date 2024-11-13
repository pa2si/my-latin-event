import sharp from "sharp";

export async function optimizeImage(
  file: File,
  type: "avatar" | "flyer",
): Promise<{ blob: Blob; extension: string }> {
  // Convert File to Buffer
  const buffer = Buffer.from(await file.arrayBuffer());

  // Different optimization settings based on type
  const settings = {
    avatar: {
      maxWidth: 400,
      quality: 60,
      format: "webp" as const,
    },
    flyer: {
      maxWidth: 1200,
      quality: 80,
      format: "webp" as const,
    },
  };

  const config = settings[type];

  try {
    const optimizedBuffer = await sharp(buffer)
      .resize(config.maxWidth, null, {
        withoutEnlargement: true,
        fit: "inside",
      })
      [config.format]({
        quality: config.quality,
      })
      .toBuffer();

    return {
      blob: new Blob([optimizedBuffer], { type: `image/${config.format}` }),
      extension: config.format,
    };
  } catch (error) {
    console.error("Image optimization failed:", error);
    // Fallback to original file if optimization fails
    return {
      blob: new Blob([buffer], { type: file.type }),
      extension: file.name.split(".").pop() || "",
    };
  }
}
