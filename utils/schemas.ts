import * as z from "zod";
import { ZodSchema } from "zod";

/* Profile Schema */
export const profileSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: "first name must be at least 2 characters." }),
  lastName: z
    .string()
    .min(2, { message: "last name must be at least 2 characters." }),
  username: z
    .string()
    .min(2, { message: "username must be at least 2 characters." }),
});

/*  validate With ZodSchema */
export const validateWithZodSchema = <T>(
  schema: ZodSchema<T>,
  data: unknown,
): T => {
  const result = schema.safeParse(data);
  if (!result.success) {
    const errors = result.error.errors.map((error) => error.message);

    throw new Error(errors.join(", "));
  }
  return result.data;
};

/* Image Schema */
export const imageSchema = z.object({
  image: validateFile(),
});

/* validate File */
function validateFile() {
  const maxUploadSize = 1024 * 1024;
  const acceptedFileTypes = ["image/"];
  return z
    .instanceof(File)
    .refine((file) => {
      return !file || file.size <= maxUploadSize;
    }, `File size must be less than 1 MB`)
    .refine((file) => {
      return (
        !file || acceptedFileTypes.some((type) => file.type.startsWith(type))
      );
    }, "File must be an image");
}

export const eventSchema = z
  .object({
    name: z
      .string()
      .min(2, {
        message: "name must be at least 2 characters.",
      })
      .max(100, {
        message: "name must be less than 100 characters.",
      }),
    subtitle: z
      .string()
      .min(2, {
        message: "subtitle must be at least 2 characters.",
      })
      .max(100, {
        message: "subtitle must be less than 100 characters.",
      })
      .optional()
      .or(z.literal("")),
    price: z.coerce.number().int().min(0, {
      message: "price must be a positive number.",
    }),
    genre: z.string(),
    description: z.string().refine(
      (description) => {
        const wordCount = description.split(" ").length;
        return wordCount >= 10 && wordCount <= 1000;
      },
      {
        message: "description must be between 10 and 1000 words.",
      },
    ),
    country: z.string(),
    floors: z.coerce.number().int().min(0, {
      message: "floor amount must be a positive number.",
    }),
    bars: z.coerce.number().int().min(0, {
      message: "bar amount must be a positive number.",
    }),
    outdoorAreas: z.coerce.number().int().min(0, {
      message: "outdoor area amount must be a positive number.",
    }),
    styles: z.string(),
    eventDateAndTime: z.preprocess(
      (arg) => {
        if (typeof arg === "string" || arg instanceof Date) {
          const date = new Date(arg);
          if (!isNaN(date.getTime())) {
            return date; // Return Date
          }
        }
        return undefined; // If invalid, return undefined
      },
      z
        .date({
          required_error: "Invalid date",
          invalid_type_error: "Invalid date",
        })
        .refine(
          (date) => {
            const now = new Date();
            return date.getTime() > now.getTime() + 60 * 60 * 1000; // Ensure at least 1 hour ahead
          },
          {
            message:
              "The event must be scheduled at least 1 hour in the future.",
          },
        ),
    ),
    eventEndDateAndTime: z.preprocess(
      (arg) => {
        if (typeof arg === "string" || arg instanceof Date) {
          const date = new Date(arg);
          return isNaN(date.getTime()) ? null : date;
        }
        return null;
      },
      z
        .date()
        .nullable()
        .refine(
          (date) => {
            if (date === null) return true; // Allow null values
            const now = new Date();
            return date.getTime() > now.getTime() + 60 * 60 * 1000; // Ensure at least 1 hour ahead
          },
          {
            message:
              "The event end time must be at least 1 hour in the future.",
          },
        ),
    ),
  })
  .refine(
    (data) => {
      if (data.eventEndDateAndTime && data.eventDateAndTime) {
        const diff =
          data.eventEndDateAndTime.getTime() - data.eventDateAndTime.getTime();
        return diff >= 60 * 60 * 1000; // Ensure 1-hour difference
      }
      return true;
    },
    {
      message:
        "The event end time must be at least 1 hour after the start time.",
    },
  );

export const createReviewSchema = z.object({
  eventId: z.string(),
  rating: z.coerce.number().int().min(1).max(5),
  comment: z.string().min(10).max(1000),
});
