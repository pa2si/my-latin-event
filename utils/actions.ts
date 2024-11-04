"use server";

import {
  createReviewSchema,
  imageSchema,
  profileSchema,
  eventSchema,
  validateWithZodSchema,
} from "./schemas";
import db from "./db";
import { clerkClient, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { calculateTotals } from "./calculateTotals";
import { formatDate } from "./format";
import { backendClient } from "@/lib/edgestore-server";

/* Helper Functions */
export const getAuthUser = async () => {
  const user = await currentUser();
  if (!user) {
    throw new Error("You must be logged in to access this route");
  }
  if (!user.privateMetadata.hasProfile) redirect("/profile/create");
  return user;
};

const getAdminUser = async () => {
  const user = await getAuthUser();
  if (user.id !== process.env.ADMIN_USER_ID) redirect("/");
  return user;
};

const renderError = (error: unknown): { message: string } => {
  console.log(error);
  return {
    message: error instanceof Error ? error.message : "An error occurred",
  };
};

/* Actions */
export const createProfileAction = async (
  prevState: any,
  formData: FormData,
) => {
  try {
    const user = await currentUser();
    if (!user) throw new Error("Please login to create a profile");

    const rawData = Object.fromEntries(formData);
    const validatedFields = validateWithZodSchema(profileSchema, rawData);

    await db.profile.create({
      data: {
        clerkId: user.id,
        email: user.emailAddresses[0].emailAddress,
        profileImage: user.imageUrl ?? "",
        ...validatedFields,
      },
    });
    await clerkClient.users.updateUserMetadata(user.id, {
      privateMetadata: {
        hasProfile: true,
      },
    });
  } catch (error) {
    return renderError(error);
  }
  redirect("/");
};

export const fetchProfileImage = async () => {
  const user = await currentUser();
  if (!user) return null;

  const profile = await db.profile.findUnique({
    where: {
      clerkId: user.id,
    },
    select: {
      profileImage: true,
    },
  });
  return profile?.profileImage;
};

export const fetchProfile = async () => {
  const user = await getAuthUser();

  const profile = await db.profile.findUnique({
    where: {
      clerkId: user.id,
    },
  });
  if (!profile) return redirect("/profile/create");
  return profile;
};

export const updateProfileAction = async (
  prevState: any,
  formData: FormData,
): Promise<{ message: string }> => {
  const user = await getAuthUser();
  try {
    const currentProfile = await db.profile.findUnique({
      where: { clerkId: user.id },
      select: { profileImage: true },
    });

    const rawData = Object.fromEntries(formData);

    const validatedFields = validateWithZodSchema(profileSchema, rawData);

    let profileImage = currentProfile?.profileImage;

    // Only process image if a new one was uploaded
    const image = formData.get("image") as File | null;
    const hasNewImage = formData.get("newImage") === "true";

    if (hasNewImage && image && image.size > 0) {
      const validatedImage = validateWithZodSchema(imageSchema, { image });
      profileImage = await uploadImage(validatedImage.image);
    }

    await db.profile.update({
      where: {
        clerkId: user.id,
      },
      data: {
        ...validatedFields,
        profileImage: profileImage, // Update image only if it's uploaded
      },
    });

    revalidatePath("/profile");
    return { message: "Profile updated successfully" };
  } catch (error) {
    return renderError(error);
  }
};

export const uploadImage = async (file: File): Promise<string> => {
  try {
    const res = await backendClient.eventImages.upload({
      content: {
        blob: new Blob([file], { type: file.type }), // Use file type for proper content-type
        extension: file.name.split(".").pop() || "", // Extract file extension from filename
      },
    });

    return res.url;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw new Error("Failed to upload image");
  }
};

export const createEventAction = async (
  prevState: any,
  formData: FormData,
): Promise<{ message: string }> => {
  const user = await getAuthUser();
  try {
    const rawData = Object.fromEntries(formData);
    console.log("thats the raw data", rawData);
    const file = formData.get("image") as File;

    const validatedFields = validateWithZodSchema(eventSchema, rawData);
    const validatedFile = validateWithZodSchema(imageSchema, { image: file });
    const fullPath = await uploadImage(validatedFile.image);
    const eventDateAndTime = validatedFields.eventDateAndTime as Date;
    const eventEndDateAndTime =
      validatedFields.eventEndDateAndTime as Date | null;
    await db.event.create({
      data: {
        ...validatedFields,
        image: fullPath,
        profileId: user.id,
        eventDateAndTime,
        eventEndDateAndTime,
      },
    });
  } catch (error) {
    return renderError(error);
  }
  redirect("/");
};

export const fetchEvents = async ({
  search = "",
  genre,
}: {
  search?: string;
  genre?: string;
}) => {
  const events = await db.event.findMany({
    where: {
      genre,
      OR: [
        { name: { contains: search, mode: "insensitive" } },
        { subtitle: { contains: search, mode: "insensitive" } },
      ],
    },
    select: {
      id: true,
      name: true,
      subtitle: true,
      country: true,
      image: true,
      price: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return events;
};

export const fetchFavoriteId = async ({ eventId }: { eventId: string }) => {
  const user = await getAuthUser();
  const favorite = await db.favorite.findFirst({
    where: {
      eventId,
      profileId: user.id,
    },
    select: {
      id: true,
    },
  });
  return favorite?.id || null;
};

export const toggleFavoriteAction = async (prevState: {
  eventId: string;
  favoriteId: string | null;
  pathname: string;
}) => {
  const user = await getAuthUser();
  const { eventId, favoriteId, pathname } = prevState;
  try {
    if (favoriteId) {
      await db.favorite.delete({
        where: {
          id: favoriteId,
        },
      });
    } else {
      await db.favorite.create({
        data: {
          eventId,
          profileId: user.id,
        },
      });
    }
    revalidatePath(pathname);
    return { message: favoriteId ? "Removed from Faves" : "Added to Faves" };
  } catch (error) {
    return renderError(error);
  }
};

export const fetchFavorites = async () => {
  const user = await getAuthUser();
  const favorites = await db.favorite.findMany({
    where: {
      profileId: user.id,
    },
    select: {
      event: {
        select: {
          id: true,
          name: true,
          subtitle: true,
          price: true,
          country: true,
          image: true,
        },
      },
    },
  });
  return favorites.map((favorite) => favorite.event);
};

export const fetchLocationDetails = (id: string) => {
  return db.event.findUnique({
    where: {
      id,
    },
    include: {
      profile: true,
      bookings: {
        select: {
          checkIn: true,
          checkOut: true,
        },
      },
    },
  });
};

export const createReviewAction = async (
  prevState: any,
  formData: FormData,
) => {
  const user = await getAuthUser();
  try {
    const rawData = Object.fromEntries(formData);

    const validatedFields = validateWithZodSchema(createReviewSchema, rawData);
    await db.review.create({
      data: {
        ...validatedFields,
        profileId: user.id,
      },
    });
    revalidatePath(`/events/${validatedFields.eventId}`);
    return { message: "Review submitted successfully" };
  } catch (error) {
    return renderError(error);
  }
};

export async function fetchEventReviews(eventId: string) {
  const reviews = await db.review.findMany({
    where: {
      eventId,
    },
    select: {
      id: true,
      rating: true,
      comment: true,
      profile: {
        select: {
          firstName: true,
          profileImage: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return reviews;
}

export const fetchEventReviewsByUser = async () => {
  const user = await getAuthUser();
  const reviews = await db.review.findMany({
    where: {
      profileId: user.id,
    },
    select: {
      id: true,
      rating: true,
      comment: true,
      event: {
        select: {
          name: true,
          image: true,
        },
      },
    },
  });
  return reviews;
};

export const deleteReviewAction = async (prevState: { reviewId: string }) => {
  const { reviewId } = prevState;
  const user = await getAuthUser();

  try {
    await db.review.delete({
      where: {
        id: reviewId,
        profileId: user.id,
      },
    });

    revalidatePath("/reviews");
    return { message: "Review deleted successfully" };
  } catch (error) {
    return renderError(error);
  }
};

export async function fetchEventRating(eventId: string) {
  const result = await db.review.groupBy({
    by: ["eventId"],
    _avg: {
      rating: true,
    },
    _count: {
      rating: true,
    },
    where: {
      eventId,
    },
  });

  // empty array if no reviews
  return {
    rating: result[0]?._avg.rating?.toFixed(1) ?? 0,
    count: result[0]?._count.rating ?? 0,
  };
}

export const findExistingReview = async (userId: string, eventId: string) => {
  return db.review.findFirst({
    where: {
      profileId: userId,
      eventId: eventId,
    },
  });
};

export const createBookingAction = async (prevState: {
  eventId: string;
  checkIn: Date;
  checkOut: Date;
}) => {
  const user = await getAuthUser();
  await db.booking.deleteMany({
    where: {
      profileId: user.id,
      paymentStatus: false,
    },
  });
  let bookingId: null | string = null;

  const { eventId, checkIn, checkOut } = prevState;
  const event = await db.event.findUnique({
    where: { id: eventId },
    select: { price: true },
  });
  if (!event) {
    return { message: "Event not found" };
  }
  const { orderTotal, totalNights } = calculateTotals({
    checkIn,
    checkOut,
    price: event.price,
  });

  try {
    const booking = await db.booking.create({
      data: {
        checkIn,
        checkOut,
        orderTotal,
        totalNights,
        profileId: user.id,
        eventId,
      },
    });
    bookingId = booking.id;
  } catch (error) {
    return renderError(error);
  }
  redirect(`/checkout?bookingId=${bookingId}`);
};

export const fetchBookings = async () => {
  const user = await getAuthUser();
  const bookings = await db.booking.findMany({
    where: {
      profileId: user.id,
      paymentStatus: true,
    },
    include: {
      event: {
        select: {
          id: true,
          name: true,
          country: true,
        },
      },
    },
    orderBy: {
      checkIn: "desc",
    },
  });
  return bookings;
};

export const deleteBookingAction = async (prevState: { bookingId: string }) => {
  const { bookingId } = prevState;
  const user = await getAuthUser();

  try {
    const result = await db.booking.delete({
      where: {
        id: bookingId,
        profileId: user.id,
      },
    });

    revalidatePath("/bookings");
    return { message: "Booking deleted successfully" };
  } catch (error) {
    return renderError(error);
  }
};

export const fetchMyEvents = async () => {
  const user = await getAuthUser();
  const myEvents = await db.event.findMany({
    where: {
      profileId: user.id,
    },
    select: {
      id: true,
      name: true,
      price: true,
      image: true,
    },
  });

  const myEventsWithBookingSums = await Promise.all(
    myEvents.map(async (myEvent) => {
      const totalNightsSum = await db.booking.aggregate({
        where: {
          eventId: myEvent.id,
          paymentStatus: true,
        },
        _sum: {
          totalNights: true,
        },
      });

      const orderTotalSum = await db.booking.aggregate({
        where: {
          eventId: myEvent.id,
          paymentStatus: true,
        },
        _sum: {
          orderTotal: true,
        },
      });

      return {
        ...myEvent,
        totalNightsSum: totalNightsSum._sum.totalNights,
        orderTotalSum: orderTotalSum._sum.orderTotal,
      };
    }),
  );

  return myEventsWithBookingSums;
};

export const deleteMyEventAction = async (prevState: { eventId: string }) => {
  const { eventId } = prevState;
  const user = await getAuthUser();

  try {
    const event = await db.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      return { message: "Event not found" };
    }

    const isAdminUser = user.id === process.env.ADMIN_USER_ID;

    if (event.profileId !== user.id && !isAdminUser) {
      return { message: "Not authorized to delete this event" };
    }

    // Delete the image from EdgeStore
    if (event.image) {
      try {
        await backendClient.eventImages.deleteFile({
          url: event.image,
        });
      } catch (error) {
        console.error("Failed to delete image from EdgeStore:", error);
      }
    }

    await db.event.delete({
      where: {
        id: eventId,
      },
    });

    revalidatePath("/my-events");
    return { message: "My Event deleted successfully" };
  } catch (error) {
    return renderError(error);
  }
};

export const fetchMyLocationDetails = async (eventId: string) => {
  const user = await getAuthUser();

  return db.event.findUnique({
    where: {
      id: eventId,
      profileId: user.id,
    },
  });
};

export const updateEventAction = async (
  prevState: any,
  formData: FormData,
): Promise<{ message: string }> => {
  const user = await getAuthUser();
  const eventId = formData.get("id") as string;

  try {
    const rawData = Object.fromEntries(formData);
    const validatedFields = validateWithZodSchema(eventSchema, rawData);
    const eventDateAndTime = validatedFields.eventDateAndTime as
      | Date
      | undefined;
    const eventEndDateAndTime =
      validatedFields.eventEndDateAndTime as Date | null;

    const existingEvent = await db.event.findUnique({
      where: { id: eventId, profileId: user.id },
      select: { image: true },
    });

    if (!existingEvent) {
      throw new Error(
        "Event not found or you don't have permission to edit it",
      );
    }

    let imagePath = existingEvent.image;

    // Check if a new image is being uploaded
    if (formData.get("newImage") === "true") {
      const file = formData.get("image") as File;
      if (file && file.size > 0) {
        const validatedFile = validateWithZodSchema(imageSchema, {
          image: file,
        });

        // Delete the old image if it exists
        if (existingEvent.image) {
          await backendClient.eventImages.deleteFile({
            url: existingEvent.image,
          });
        }

        // Upload the new image
        imagePath = await uploadImage(validatedFile.image);
      }
    }

    await db.event.update({
      where: {
        id: eventId,
        profileId: user.id,
      },
      data: {
        ...validatedFields,
        image: imagePath,
        eventDateAndTime,
        eventEndDateAndTime,
      },
    });

    revalidatePath(`/my-events/${eventId}/edit`);
    return { message: "Update Successful" };
  } catch (error) {
    return renderError(error);
  }
};

export const fetchReservations = async () => {
  const user = await getAuthUser();

  const reservations = await db.booking.findMany({
    where: {
      paymentStatus: true,
      event: {
        profileId: user.id,
      },
    },

    orderBy: {
      createdAt: "desc", // or 'asc' for ascending order
    },

    include: {
      event: {
        select: {
          id: true,
          name: true,
          price: true,
          country: true,
        },
      }, // include event details in the result
    },
  });
  return reservations;
};

export const fetchStats = async () => {
  await getAdminUser();

  const usersCount = await db.profile.count();
  const eventsCount = await db.event.count();
  const bookingsCount = await db.booking.count({
    where: {
      paymentStatus: true,
    },
  });

  return {
    usersCount,
    eventsCount,
    bookingsCount,
  };
};

export const fetchChartsData = async () => {
  await getAdminUser();

  const date = new Date();
  date.setMonth(date.getMonth() - 6);
  const sixMonthsAgo = date;

  const bookings = await db.booking.findMany({
    where: {
      paymentStatus: true,
      createdAt: {
        gte: sixMonthsAgo,
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });
  let bookingsPerMonth = bookings.reduce(
    (total, current) => {
      const date = formatDate(current.createdAt, true);

      const existingEntry = total.find((entry) => entry.date === date);
      if (existingEntry) {
        existingEntry.count += 1;
      } else {
        total.push({ date, count: 1 });
      }
      return total;
    },
    [] as Array<{ date: string; count: number }>,
  );
  return bookingsPerMonth;
};

export const fetchReservationStats = async () => {
  const user = await getAuthUser();
  const events = await db.event.count({
    where: {
      profileId: user.id,
    },
  });

  const totals = await db.booking.aggregate({
    _sum: {
      orderTotal: true,
      totalNights: true,
    },
    where: {
      event: {
        profileId: user.id,
      },
    },
  });

  return {
    events,
    nights: totals._sum.totalNights || 0,
    amount: totals._sum.orderTotal || 0,
  };
};
