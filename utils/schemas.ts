import * as z from "zod";
import { ZodSchema } from "zod";

/* Profile Schema */
export const organizerSchema = z.object({
  organizerName: z
    .string()
    .trim()
    .min(2, { message: "Organizer name must be at least 2 characters." })
    .max(50, { message: "Organizer name cannot exceed 50 characters." }),
  slogan: z.string().optional(),
});

export const profileSchema = z.object({
  firstName: z
    .string()
    .trim()
    .max(50, { message: "First name cannot exceed 50 characters." })
    .optional(),
  lastName: z
    .string()
    .trim()
    .max(50, { message: "Last name cannot exceed 50 characters." })
    .optional(),
  username: z
    .string()
    .trim()
    .min(2, { message: "Username must be at least 2 characters." })
    .max(30, { message: "Username cannot exceed 30 characters." }),
  userCountry: z
    .string()
    .trim()
    .min(1, { message: "Country is required" })
    .max(100, { message: "Country cannot exceed 100 characters." }),
  userState: z
    .string()
    .trim()
    .min(1, { message: "State is required" })
    .max(100, { message: "State cannot exceed 100 characters." }),
  userCity: z
    .string()
    .trim()
    .max(100, { message: "City cannot exceed 100 characters." })
    .optional(),
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

export const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    password: z.string().min(8, "New password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "New passwords don't match",
    path: ["confirmPassword"],
  });

/* Image Schema */
export const imageSchema = z.object({
  image: validateFile(),
});

/* validate File */
function validateFile() {
  const maxUploadSize = 1024 * 1024 * 5;
  const acceptedFileTypes = ["image/"];
  return z
    .instanceof(File)
    .refine((file) => {
      return !file || file.size <= maxUploadSize;
    }, `File size must be less than 5 MB`)
    .refine((file) => {
      return (
        !file || acceptedFileTypes.some((type) => file.type.startsWith(type))
      );
    }, "You must upload an image file");
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
    location: z
      .string()
      .min(1, {
        message: "location name is required",
      })
      .max(200, { message: "location must not exceed 100 characters" }),
    city: z
      .string()
      .min(1, {
        message: "city is required",
      })
      .max(200, { message: "location must not exceed 100 characters" }),
    street: z
      .string()
      .min(1, { message: "Street address is required" })
      .max(100, { message: "Street address must not exceed 100 characters" }),
    postalCode: z
      .string()
      .max(50, { message: "Postal code must not exceed 50 characters" })
      .optional(),
    country: z
      .string()
      .min(1, { message: "Country is required" })
      .max(100, { message: "Country must not exceed 100 characters" }),
    googleMapsLink: z
      .string()
      .max(200, { message: "Google Maps link must not exceed 200 characters" })
      .optional(),
    price: z.coerce.number().int().min(0, {
      message: "price must be a positive number.",
    }),
    genres: z.array(z.string()).min(1, "At least one genre is required"),
    description: z
      .string()
      .refine(
        (description) => {
          const wordCount = description.split(" ").length;
          return wordCount <= 100;
        },
        {
          message: "description must not exceed 100 words.",
        },
      )
      .optional(),
    floors: z.coerce.number().int().min(0),
    bars: z.coerce.number().int().min(0),
    outdoorAreas: z.coerce.number().int().min(0),
    styles: z.array(z.string()), // Changed from z.string()
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
