"use server";

import {
  createReviewSchema,
  imageSchema,
  profileSchema,
  eventSchema,
  validateWithZodSchema,
  passwordSchema,
  organizerSchema,
} from "./schemas";
import db from "./db";
import { auth, clerkClient, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { calculateTotals } from "./calculateTotals";
import { formatDate } from "./format";
import { backendClient } from "@/lib/edgestore-server";
import { EmailData } from "@//utils/types";

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

export const getCurrentUserProfileId = async () => {
  const user = await getAuthUser();
  const profile = await db.profile.findUnique({
    where: { clerkId: user.id },
    select: { id: true },
  });
  if (!profile) throw new Error("Profile not found");
  return profile.id;
};

export const checkEventAccess = async (organizerClerkId: string) => {
  const { userId } = auth();

  return {
    canEdit:
      organizerClerkId === userId || userId === process.env.ADMIN_USER_ID,
  };
};

export const checkUserRole = async () => {
  const { userId } = auth();
  return {
    isAdminUser: userId === process.env.ADMIN_USER_ID,
    isAuthenticated: !!userId,
  };
};

// Helper function to check if user owns an organizer
export const verifyOrganizerOwnership = async (organizerId: string) => {
  const user = await getAuthUser();

  const organizer = await db.organizer.findFirst({
    where: {
      id: organizerId,
      profile: {
        clerkId: user.id,
      },
    },
  });

  if (!organizer) throw new Error("Organizer not found or access denied");
  return organizer;
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

    // Get clerk client instance
    const clerk = clerkClient();

    // Update Clerk user first with core user data
    await clerk.users.updateUser(user.id, {
      firstName: validatedFields.firstName,
      lastName: validatedFields.lastName,
      username: validatedFields.username,
    });

    await db.profile.create({
      data: {
        clerkId: user.id,
        email: user.emailAddresses[0].emailAddress,
        profileImage: user.imageUrl ?? "",
        ...validatedFields,
      },
    });

    await clerk.users.updateUserMetadata(user.id, {
      privateMetadata: {
        hasProfile: true,
      },
    });
  } catch (error) {
    return renderError(error);
  }
  redirect("/");
};

export async function fetchProfileImage() {
  try {
    const user = await getAuthUser();

    if (!user) {
      return null;
    }

    // Always get the latest from Clerk
    const clerk = await clerkClient();
    const clerkUser = await clerk.users.getUser(user.id);

    // Check if our DB is out of sync with Clerk
    const profile = await db.profile.findUnique({
      where: { clerkId: user.id },
      select: { profileImage: true },
    });

    // If DB has different URL than Clerk, update it
    if (profile && profile.profileImage !== clerkUser.imageUrl) {
      await db.profile.update({
        where: { clerkId: user.id },
        data: { profileImage: clerkUser.imageUrl ?? "" },
      });
    }

    // Return Clerk's image URL as it's always the most up-to-date
    return clerkUser.imageUrl;
  } catch (error) {
    return null;
  }
}

export async function updateProfileImage(formData: FormData) {
  try {
    const user = await getAuthUser();

    // Check if this is a sync request after Clerk upload
    if (formData.get("sync")) {
      const clerk = await clerkClient();
      const clerkUser = await clerk.users.getUser(user.id);

      // Sync the new image URL to our DB
      await db.profile.update({
        where: { clerkId: user.id },
        data: {
          profileImage: clerkUser.imageUrl ?? "",
        },
      });

      revalidatePath("/"); // Revalidate to update UserIcon
      return { success: true };
    }

    // If not a sync request, just validate the file
    const file = formData.get("image") as File;
    const validatedFile = validateWithZodSchema(imageSchema, { image: file });

    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to update image",
    };
  }
}

export const updateProfileAction = async (
  prevState: any,
  formData: FormData,
): Promise<{ message: string }> => {
  const user = await getAuthUser();
  try {
    const currentProfile = await db.profile.findUnique({
      where: { clerkId: user.id },
      select: { id: true },
    });

    if (!currentProfile) throw new Error("Profile not found");

    const rawData = Object.fromEntries(formData);
    const validatedFields = validateWithZodSchema(profileSchema, rawData);

    // First update Clerk with the new user data
    const clerk = await clerkClient();
    await clerk.users.updateUser(user.id, {
      firstName: validatedFields.firstName,
      lastName: validatedFields.lastName,
      username: validatedFields.username,
    });

    // Get the updated user data from Clerk
    const updatedClerkUser = await clerk.users.getUser(user.id);

    // Update database with the data from Clerk
    const updateResult = await db.profile.update({
      where: {
        clerkId: user.id,
      },
      data: {
        firstName: updatedClerkUser.firstName ?? "",
        lastName: updatedClerkUser.lastName ?? "",
        username: updatedClerkUser.username ?? "",
      },
    });

    revalidatePath("/profile");
    return { message: "Profile updated successfully" };
  } catch (error) {
    return renderError(error);
  }
};

export const uploadEventImage = async (file: File): Promise<string> => {
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

export const uploadOrganizerImage = async (file: File): Promise<string> => {
  try {
    const res = await backendClient.organizerImages.upload({
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

// Fetch all organizers for the current user
export const fetchOrganizers = async () => {
  const user = await getAuthUser();

  const profile = await db.profile.findUnique({
    where: { clerkId: user.id },
    include: {
      organizers: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!profile) return redirect("/profile/create");
  return profile.organizers;
};

// Create new organizer
export const createOrganizerAction = async (
  prevState: any,
  formData: FormData,
): Promise<{ message: string }> => {
  const user = await getAuthUser();

  try {
    const currentProfile = await db.profile.findUnique({
      where: { clerkId: user.id },
      select: { id: true },
    });

    if (!currentProfile) throw new Error("Profile not found");

    const rawData = Object.fromEntries(formData);
    // Handle image upload
    console.log("thats the raw data", rawData);
    const file = formData.get("image") as File;

    const validatedFields = validateWithZodSchema(organizerSchema, rawData);
    const validatedFile = validateWithZodSchema(imageSchema, { image: file });
    const fullPath = await uploadOrganizerImage(validatedFile.image);

    // Create the organizer
    await db.organizer.create({
      data: {
        ...validatedFields,
        organizerImage: fullPath,
        profileId: currentProfile.id,
      },
    });

    revalidatePath("/profile");
    return { message: "Organizer created successfully" };
  } catch (error: any) {
    return renderError(error);
  }
};

// Update existing organizer
export const updateOrganizerAction = async (
  prevState: any,
  formData: FormData,
): Promise<{ message: string }> => {
  const user = await getAuthUser();

  try {
    const organizerId = formData.get("id") as string;
    if (!organizerId) throw new Error("Organizer ID is required");

    // Verify ownership
    const organizer = await db.organizer.findFirst({
      where: {
        id: organizerId,
        profile: {
          clerkId: user.id,
        },
      },
    });

    if (!organizer) throw new Error("Organizer not found or access denied");

    const rawData = Object.fromEntries(formData);
    const validatedFields = validateWithZodSchema(organizerSchema, rawData);

    // Only handle image if a new one was uploaded
    const file = formData.get("image") as File;
    let imageUrl = organizer.organizerImage; // Keep existing image by default

    if (file?.size > 0) {
      const validatedFile = validateWithZodSchema(imageSchema, { image: file });
      imageUrl = await uploadOrganizerImage(validatedFile.image);
    }

    // Update the organizer
    await db.organizer.update({
      where: { id: organizerId },
      data: {
        ...validatedFields,
        organizerImage: imageUrl, // Use new image if uploaded, otherwise keep existing
      },
    });

    revalidatePath("/profile");
    return { message: "Organizer updated successfully" };
  } catch (error: any) {
    return renderError(error);
  }
};

// Delete organizer
export const deleteOrganizerAction = async (
  prevState: any,
  formData: FormData,
): Promise<{ message: string }> => {
  const user = await getAuthUser();

  try {
    const organizerId = formData.get("id") as string;
    if (!organizerId) throw new Error("Organizer ID is required");

    // Verify ownership
    const organizer = await db.organizer.findFirst({
      where: {
        id: organizerId,
        profile: {
          clerkId: user.id,
        },
      },
    });

    if (!organizer) throw new Error("Organizer not found or access denied");

    // Delete image from EdgeStore
    if (organizer.organizerImage) {
      try {
        await backendClient.organizerImages.deleteFile({
          url: organizer.organizerImage,
        });
      } catch (error) {
        console.error("Failed to delete image from EdgeStore:", error);
      }
    }

    // Delete the organizer
    await db.organizer.delete({
      where: { id: organizerId },
    });

    revalidatePath("/profile");
    return { message: "Organizer deleted successfully" };
  } catch (error: any) {
    return renderError(error);
  }
};

export const createEventAction = async (
  prevState: any,
  formData: FormData,
): Promise<{ message: string }> => {
  try {
    const user = await getAuthUser();
    const organizerId = formData.get("organizerId") as string;

    if (!organizerId) throw new Error("Organizer ID is required");

    // Verify organizer ownership
    const organizer = await db.organizer.findFirst({
      where: {
        id: organizerId,
        profile: {
          clerkId: user.id,
        },
      },
    });

    if (!organizer) throw new Error("Organizer not found or access denied");

    const rawData = Object.fromEntries(formData);
    console.log("thats the raw data", rawData);
    const file = formData.get("image") as File;

    const validatedFields = validateWithZodSchema(eventSchema, rawData);
    const validatedFile = validateWithZodSchema(imageSchema, { image: file });
    const fullPath = await uploadEventImage(validatedFile.image);
    const eventDateAndTime = validatedFields.eventDateAndTime as Date;
    const eventEndDateAndTime =
      validatedFields.eventEndDateAndTime as Date | null;

    await db.event.create({
      data: {
        ...validatedFields,
        image: fullPath,
        organizerId,
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

export const fetchLikeId = async ({ eventId }: { eventId: string }) => {
  try {
    const profileId = await getCurrentUserProfileId();
    const like = await db.like.findFirst({
      where: {
        eventId,
        profileId,
      },
      select: {
        id: true,
      },
    });
    return like?.id || null;
  } catch (error) {
    return null;
  }
};

export const toggleLikeAction = async (prevState: {
  eventId: string;
  likeId: string | null;
  pathname: string;
}) => {
  try {
    const { eventId, likeId, pathname } = prevState;
    const profileId = await getCurrentUserProfileId();

    if (likeId) {
      await db.like.delete({
        where: {
          id: likeId,
        },
      });
    } else {
      await db.like.create({
        data: {
          eventId,
          profileId,
        },
      });
    }
    revalidatePath(pathname);
    return { message: likeId ? "Removed from Likes" : "Added to Likes" };
  } catch (error: any) {
    return renderError(error);
  }
};

export const fetchLikes = async () => {
  try {
    const profileId = await getCurrentUserProfileId();

    const likes = await db.like.findMany({
      where: {
        profileId,
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
            eventDateAndTime: true,
          },
        },
      },
    });
    return likes.map((like) => like.event);
  } catch (error) {
    console.log("Error fetching likes:", error);
    return [];
  }
};

export const fetchEventDetails = async (id: string) => {
  return db.event.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      name: true,
      subtitle: true,
      location: true,
      city: true,
      street: true,
      postalCode: true,
      country: true,
      googleMapsLink: true,
      genre: true,
      styles: true,
      image: true,
      description: true,
      price: true,
      floors: true,
      bars: true,
      outdoorAreas: true,
      eventDateAndTime: true,
      eventEndDateAndTime: true,
      organizer: {
        select: {
          id: true,
          organizerName: true,
          organizerImage: true,
          slogan: true,
          profile: {
            select: {
              clerkId: true, // Only needed for ownership check
            },
          },
        },
      },
      _count: {
        select: {
          likes: true,
        },
      },
    },
  });
};

//hasnt been updated to profile id reference
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

//hasnt been updated to profile id reference
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

//hasnt been updated to profile id reference
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

//hasnt been updated to profile id reference
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

//hasnt been updated to profile id reference
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

//hasnt been updated to profile id reference
export const findExistingReview = async (userId: string, eventId: string) => {
  return db.review.findFirst({
    where: {
      profileId: userId,
      eventId: eventId,
    },
  });
};

//hasnt been updated to profile id reference
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

//hasnt been updated to profile id reference
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

//hasnt been updated to profile id reference
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
  try {
    const user = await getAuthUser();

    const myEvents = await db.event.findMany({
      where: {
        organizer: {
          profile: {
            clerkId: user.id,
          },
        },
      },
      select: {
        id: true,
        name: true,
        location: true,
        price: true,
        eventDateAndTime: true,
        organizer: {
          select: {
            organizerName: true,
          },
        },
        _count: {
          select: {
            likes: true,
          },
        },
      },
      orderBy: {
        eventDateAndTime: "asc",
      },
    });

    return myEvents;
  } catch (error) {
    console.log("Error fetching my events:", error);
    return [];
  }
};

export const deleteEventAction = async (prevState: { eventId: string }) => {
  const { eventId } = prevState;
  const user = await getAuthUser();

  try {
    // Find event with organizer and profile info
    const event = await db.event.findUnique({
      where: { id: eventId },
      include: {
        organizer: {
          select: {
            profile: {
              select: {
                clerkId: true,
              },
            },
          },
        },
      },
    });

    if (!event) {
      return { message: "Event not found" };
    }

    // Check authorization
    const isAdminUser = user.id === process.env.ADMIN_USER_ID;
    if (event.organizer.profile.clerkId !== user.id && !isAdminUser) {
      return { message: "Not authorized to delete this event" };
    }

    // Delete image
    if (event.image) {
      try {
        await backendClient.eventImages.deleteFile({
          url: event.image,
        });
      } catch (error) {
        console.error("Failed to delete image from EdgeStore:", error);
      }
    }

    // Delete event
    await db.event.delete({
      where: { id: eventId },
    });

    revalidatePath("/my-events");
    return { message: "My Event deleted successfully" };
  } catch (error: any) {
    return renderError(error);
  }
};

export const fetchMyLocationDetails = async (eventId: string) => {
  try {
    const user = await getAuthUser();
    return db.event.findFirst({
      where: {
        id: eventId,
        organizer: {
          profile: {
            clerkId: user.id,
          },
        },
      },
    });
  } catch (error) {
    console.error("Error fetching location details:", error);
    return null;
  }
};

export const updateEventAction = async (
  prevState: any,
  formData: FormData,
): Promise<{ message: string }> => {
  const eventId = formData.get("id") as string;

  try {
    const user = await getAuthUser();

    const rawData = Object.fromEntries(formData);
    const validatedFields = validateWithZodSchema(eventSchema, rawData);
    const eventDateAndTime = validatedFields.eventDateAndTime as
      | Date
      | undefined;
    const eventEndDateAndTime =
      validatedFields.eventEndDateAndTime as Date | null;

    // Find event and verify ownership through organizer relationship
    const existingEvent = await db.event.findFirst({
      where: {
        id: eventId,
        organizer: {
          profile: {
            clerkId: user.id,
          },
        },
      },
      select: {
        image: true,
        organizerId: true,
      },
    });

    if (!existingEvent) {
      throw new Error(
        "Event not found or you don't have permission to edit it",
      );
    }

    // Only handle image if a new one was uploaded
    const file = formData.get("image") as File;
    let imageUrl = existingEvent.image; // Keep existing image by default

    if (file?.size > 0) {
      const validatedFile = validateWithZodSchema(imageSchema, { image: file });
      imageUrl = await uploadEventImage(validatedFile.image);
    }

    // Update event
    await db.event.update({
      where: {
        id: eventId,
        organizerId: existingEvent.organizerId,
      },
      data: {
        ...validatedFields,
        image: imageUrl,
        eventDateAndTime,
        eventEndDateAndTime,
      },
    });

    revalidatePath(`/my-events/${eventId}/edit`);
    return { message: "Update Successful" };
  } catch (error: any) {
    return renderError(error);
  }
};

//hasnt been updated to profile id reference
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

//hasnt been updated to profile id reference
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

export async function fetchFollowId({ organizerId }: { organizerId: string }) {
  try {
    const user = await getAuthUser();

    const follow = await db.follow.findFirst({
      where: {
        profile: {
          clerkId: user.id, // I am the follower
        },
        organizerId: organizerId, // Looking for the organizer I'm following
      },
      select: {
        id: true,
      },
    });
    return follow?.id || null;
  } catch (error) {
    console.log("Error fetching follow status:", error);
    return null;
  }
}

export async function toggleFollowAction({
  organizerId, // This is the organizer I want to follow
  followId,
  pathname,
}: {
  organizerId: string;
  followId: string | null;
  pathname: string;
}) {
  try {
    const user = await getAuthUser();

    // Get current user's profile
    const profile = await db.profile.findUnique({
      where: { clerkId: user.id },
      select: { id: true },
    });

    if (!profile) throw new Error("Profile not found");

    if (followId) {
      // Unfollow
      await db.follow.delete({
        where: {
          id: followId,
        },
      });
      revalidatePath(pathname);
      return { message: "Unfollowed successfully" };
    }

    // Follow
    await db.follow.create({
      data: {
        profileId: profile.id, // Current user's profile
        organizerId: organizerId, // Organizer being followed
      },
    });
    revalidatePath(pathname);
    return { message: "Followed successfully" };
  } catch (error) {
    console.log("Error toggling follow status:", error);
    return { message: "Error toggling follow status" };
  }
}

export const checkFollowAccess = async (organizerId: string) => {
  try {
    const user = await getAuthUser();

    // Check if this organizer belongs to the current user
    const organizer = await db.organizer.findFirst({
      where: {
        id: organizerId,
        profile: {
          clerkId: user.id,
        },
      },
    });

    return {
      canFollow: !organizer, // Can follow if it's not user's own organizer
    };
  } catch (error) {
    return {
      canFollow: false,
    };
  }
};

export const fetchFollowedOrganizersEvents = async () => {
  try {
    const user = await getAuthUser();

    // Get current date at start of day
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const events = await db.event.findMany({
      where: {
        AND: [
          {
            organizer: {
              followers: {
                some: {
                  profile: {
                    clerkId: user.id,
                  },
                },
              },
            },
          },
          {
            eventDateAndTime: {
              gte: today,
            },
          },
        ],
      },
      select: {
        id: true,
        name: true,
        subtitle: true,
        location: true,
        country: true,
        image: true,
        price: true,
        eventDateAndTime: true,
        organizer: {
          select: {
            id: true,
            organizerName: true,
            organizerImage: true,
          },
        },
      },
      orderBy: {
        eventDateAndTime: "asc",
      },
    });

    return events;
  } catch (error) {
    console.log("Error fetching followed organizers events:", error);
    return [];
  }
};
export const fetchBreadcrumbInfo = async () => {
  try {
    return {
      pageName: "Followed Organizers Events", // Static name for this page
    };
  } catch (error) {
    console.log("Error fetching breadcrumb info:", error);
    return {
      pageName: "Events",
    };
  }
};

// export async function changePasswordAction(prevState: any, formData: FormData) {
//   try {
//     // Convert FormData to an object
//     const formValues = Object.fromEntries(formData.entries());
//     const { currentPassword, password, confirmPassword } = formValues;

//     // Validate the input
//     const validatedFields = passwordSchema.safeParse({
//       currentPassword,
//       password,
//       confirmPassword,
//     });

//     if (!validatedFields.success) {
//       return {
//         message: validatedFields.error.errors[0].message,
//       };
//     }

//     const user = await getAuthUser();
//     const { sessionId } = await auth();

//     if (!sessionId) {
//       return {
//         message: "No active session found",
//       };
//     }

//     try {
//       await (
//         await clerkClient()
//       ).users.verifyPassword({
//         userId: user.id,
//         password: currentPassword as string,
//       });
//     } catch (error) {
//       return {
//         message: "Current password is incorrect",
//       };
//     }

//     await (
//       await clerkClient()
//     ).users.updateUser(user.id, {
//       password: password as string,
//       signOutOfOtherSessions: true,
//     });

//     await (await clerkClient()).sessions.revokeSession(sessionId);

//     revalidatePath("/profile");

//     return {
//       message: "Password updated successfully! Redirecting...",
//     };
//   } catch (error) {
//     return {
//       message:
//         error instanceof Error ? error.message : "Failed to update password",
//     };
//   }
// }

// app/actions/password.ts

// actions/password.ts

type FormState = {
  message: string;
  success?: boolean;
};

export async function changePasswordAction(
  prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  try {
    const user = await getAuthUser();
    const { sessionId } = await auth();

    if (!sessionId) {
      return {
        message: "No active session found",
      };
    }

    const formValues = {
      currentPassword: formData.get("currentPassword") as string,
      password: formData.get("password") as string,
      confirmPassword: formData.get("confirmPassword") as string,
    };

    const validationResult = passwordSchema.safeParse(formValues);
    if (!validationResult.success) {
      return {
        message: validationResult.error.errors[0].message,
      };
    }

    try {
      await (
        await clerkClient()
      ).users.verifyPassword({
        userId: user.id,
        password: formValues.currentPassword,
      });
    } catch (error) {
      return {
        message: "Current password is incorrect",
      };
    }

    // First revoke the session
    await (await clerkClient()).sessions.revokeSession(sessionId);

    // Then update the password
    await (
      await clerkClient()
    ).users.updateUser(user.id, {
      password: formValues.password,
    });

    // Revalidate paths
    revalidatePath("/", "layout");

    return {
      message: "Password updated successfully! Redirecting to homepage...",
      success: true,
    };
  } catch (error) {
    return renderError(error);
  }
}

export const getEmailDetails = async () => {
  const user = await getAuthUser();

  if (!user.primaryEmailAddressId) {
    return null;
  }

  const emailAddress = await (
    await clerkClient()
  ).emailAddresses.getEmailAddress(user.primaryEmailAddressId);

  // Return a plain object with only the data we need
  return {
    id: emailAddress.id,
    emailAddress: emailAddress.emailAddress,
    verification: emailAddress.verification
      ? {
          status: emailAddress.verification.status,
        }
      : null,
  };
};

export const getAllEmailAddresses = async () => {
  const user = await getAuthUser();

  // Get all email addresses for the user
  const allEmails = await (await clerkClient()).users.getUser(user.id);

  // Return formatted email data with status possibly being undefined
  return allEmails.emailAddresses.map((email) => ({
    id: email.id,
    emailAddress: email.emailAddress,
    verification: {
      status: email.verification?.status || "unverified", // Provide default value
    },
    isPrimary: email.id === allEmails.primaryEmailAddressId,
  }));
};

export const updateEmailAction = async (
  prevState: any,
  formData: FormData,
): Promise<{ message: string }> => {
  try {
    const user = await getAuthUser();
    const newEmail = formData.get("newEmail") as string;

    // Create new email address with verified: false to trigger verification
    const emailAddress = await (
      await clerkClient()
    ).emailAddresses.createEmailAddress({
      userId: user.id,
      emailAddress: newEmail,
      verified: false, // This ensures verification is required
    });

    revalidatePath("/profile");
    return {
      message: "Email added. Check your inbox for verification.",
    };
  } catch (error: any) {
    console.error("Email update error:", error);
    return {
      message:
        error instanceof Error
          ? error.message
          : "Failed to add email. Please try again.",
    };
  }
};

export const setPrimaryEmailAction = async (
  prevState: any,
  formData: FormData,
): Promise<{ message: string }> => {
  try {
    const user = await getAuthUser();
    const selectedEmailId = formData.get("value") as string;

    if (!selectedEmailId) {
      throw new Error("No email address selected");
    }

    // Update the primary email in Clerk
    await clerkClient.users.updateUser(user.id, {
      primaryEmailAddressID: selectedEmailId,
    });

    // Get the updated user data to ensure we have the latest state
    const updatedUser = await clerkClient.users.getUser(user.id);

    // Find the new primary email from Clerk's data
    const primaryEmail = updatedUser.emailAddresses.find(
      (email) => email.id === updatedUser.primaryEmailAddressId,
    );

    if (!primaryEmail) {
      throw new Error("Failed to get primary email after update");
    }

    // Update database with the email from Clerk
    await db.profile.update({
      where: { clerkId: user.id },
      data: {
        email: primaryEmail.emailAddress,
      },
    });

    revalidatePath("/settings/emails");
    return {
      message: "Primary email updated successfully",
    };
  } catch (error) {
    return renderError(error);
  }
};

export const deleteEmailAction = async (
  prevState: any,
  formData: FormData,
): Promise<{ message: string }> => {
  try {
    const emailId = formData.get("emailId") as string;

    await (await clerkClient()).emailAddresses.deleteEmailAddress(emailId);

    revalidatePath("/profile");
    return {
      message: "Email address deleted successfully",
    };
  } catch (error) {
    return renderError(error);
  }
};

export const resendVerificationAction = async (
  prevState: any,
  formData: FormData,
): Promise<{ message: string }> => {
  try {
    const emailId = formData.get("emailId") as string;

    await (
      await clerkClient()
    ).emailAddresses.updateEmailAddress(emailId, {
      verified: false,
    });

    revalidatePath("/profile");
    return {
      message: "A new verification email has been sent.",
    };
  } catch (error: any) {
    return {
      message:
        error instanceof Error
          ? error.message
          : "Failed to resend verification email",
    };
  }
};
