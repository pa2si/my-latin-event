import * as z from 'zod';
import { ZodSchema } from 'zod';

/* Profile Schema */
export const profileSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: 'first name must be at least 2 characters.' }),
  lastName: z
    .string()
    .min(2, { message: 'last name must be at least 2 characters.' }),
  username: z
    .string()
    .min(2, { message: 'username must be at least 2 characters.' }),
});

/*  validate With ZodSchema */
export const validateWithZodSchema = <T>(
  schema: ZodSchema<T>,
  data: unknown
): T => {
  const result = schema.safeParse(data);
  if (!result.success) {
    const errors = result.error.errors.map((error) => error.message);

    throw new Error(errors.join(', '));
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
  const acceptedFileTypes = ['image/'];
  return z
    .instanceof(File)
    .refine((file) => {
      return !file || file.size <= maxUploadSize;
    }, `File size must be less than 1 MB`)
    .refine((file) => {
      return (
        !file || acceptedFileTypes.some((type) => file.type.startsWith(type))
      );
    }, 'File must be an image');
}

export const eventSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: 'name must be at least 2 characters.',
    })
    .max(100, {
      message: 'name must be less than 100 characters.',
    }),
  tagline: z
    .string()
    .min(2, {
      message: 'tagline must be at least 2 characters.',
    })
    .max(100, {
      message: 'tagline must be less than 100 characters.',
    }),
  price: z.coerce.number().int().min(0, {
    message: 'price must be a positive number.',
  }),
  genre: z.string(),
  description: z.string().refine(
    (description) => {
      const wordCount = description.split(' ').length;
      return wordCount >= 10 && wordCount <= 1000;
    },
    {
      message: 'description must be between 10 and 1000 words.',
    }
  ),
  country: z.string(),
  floors: z.coerce.number().int().min(0, {
    message: 'floor amount must be a positive number.',
  }),
  bars: z.coerce.number().int().min(0, {
    message: 'bar amount must be a positive number.',
  }),
  outdoorAreas: z.coerce.number().int().min(0, {
    message: 'outdoor area amount must be a positive number.',
  }),
  styles: z.string(),
  eventDateAndTime: z.preprocess((arg) => {
    // make sure this returns a Date or undefined
    if (typeof arg === 'string' || arg instanceof Date) {
      const date = new Date(arg);
      if (!isNaN(date.getTime())) {
        return date;
      }
    }
    return undefined; // or null, based on how you handle empty dates
  }, z.date()),
});

export const createReviewSchema = z.object({
  eventId: z.string(),
  rating: z.coerce.number().int().min(1).max(5),
  comment: z.string().min(10).max(1000),
});
