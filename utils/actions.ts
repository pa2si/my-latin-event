"use server";

import {
  createReviewSchema,
  imageSchema,
  profileSchema,
  eventSchema,
  validateWithZodSchema,
} from "./schemas";
import db from "./db";
import { auth, clerkClient, currentUser } from "@clerk/nextjs/server";
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

export const getCurrentUserProfileId = async () => {
  const user = await getAuthUser();
  const profile = await db.profile.findUnique({
    where: { clerkId: user.id },
    select: { id: true },
  });
  if (!profile) throw new Error("Profile not found");
  return profile.id;
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
    // Make sure to return id if you need it for relationships
    include: {
      // Add any related data you need
      _count: {
        select: {
          followers: true,
          following: true,
        },
      },
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
      select: { id: true, profileImage: true },
    });

    if (!currentProfile) throw new Error("Profile not found");

    const rawData = Object.fromEntries(formData);
    // console.log("Processed rawData:", rawData);

    const validatedFields = validateWithZodSchema(profileSchema, rawData);

    // Remove newImage from validatedFields before database update
    const { newImage, ...fieldsToUpdate } = validatedFields;

    let profileImage = currentProfile.profileImage;

    const image = formData.get("image") as File;
    if (image && image.size > 0) {
      const validatedImage = validateWithZodSchema(imageSchema, { image });
      profileImage = await uploadImage(validatedImage.image);
    }

    const updateResult = await db.profile.update({
      where: {
        clerkId: user.id,
      },
      data: {
        ...fieldsToUpdate, // Use fieldsToUpdate instead of validatedFields
        profileImage,
      },
    });

    revalidatePath("/profile");
    return { message: "Profile updated successfully" };
  } catch (error: any) {
    console.log("Final Error:", {
      name: error?.name,
      message: error?.message,
      stack: error?.stack,
    });
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
  try {
    const profileId = await getCurrentUserProfileId();

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
        profileId, // Use the profile id
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
      profile: {
        select: {
          id: true,
          firstName: true,
          profileImage: true,
          slogan: true,
          clerkId: true, // Only needed for ownership check
          username: true,
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

export const checkEventAccess = async (eventProfileClerkId: string) => {
  const { userId } = auth();
  return {
    canEdit:
      eventProfileClerkId === userId || userId === process.env.ADMIN_USER_ID,
  };
};

export const checkUserRole = async () => {
  const { userId } = auth();
  return {
    isAdminUser: userId === process.env.ADMIN_USER_ID,
    isAuthenticated: !!userId,
  };
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
    const currentUserProfileId = await getCurrentUserProfileId();

    const myEvents = await db.event.findMany({
      where: {
        profileId: currentUserProfileId,
      },
      select: {
        id: true,
        name: true,
        location: true,
        price: true,
        eventDateAndTime: true,
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

export const deleteMyEventAction = async (prevState: { eventId: string }) => {
  const { eventId } = prevState;
  const user = await getAuthUser();

  try {
    const profileId = await getCurrentUserProfileId();
    const event = await db.event.findUnique({
      where: { id: eventId },
      include: {
        profile: {
          select: {
            clerkId: true,
          },
        },
      },
    });

    if (!event) {
      return { message: "Event not found" };
    }

    const isAdminUser = user.id === process.env.ADMIN_USER_ID;
    if (event.profile.clerkId !== user.id && !isAdminUser) {
      return { message: "Not authorized to delete this event" };
    }
    //delete image
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
    const profileId = await getCurrentUserProfileId();
    return db.event.findUnique({
      where: {
        id: eventId,
        profileId,
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
    const profileId = await getCurrentUserProfileId();

    const rawData = Object.fromEntries(formData);
    const validatedFields = validateWithZodSchema(eventSchema, rawData);
    const eventDateAndTime = validatedFields.eventDateAndTime as
      | Date
      | undefined;
    const eventEndDateAndTime =
      validatedFields.eventEndDateAndTime as Date | null;

    const existingEvent = await db.event.findUnique({
      where: { id: eventId, profileId },
      select: { image: true },
    });

    if (!existingEvent) {
      throw new Error(
        "Event not found or you don't have permission to edit it",
      );
    }

    let imagePath = existingEvent.image;
    //check if there is a new image
    if (formData.get("newImage") === "true") {
      const file = formData.get("image") as File;
      if (file && file.size > 0) {
        const validatedFile = validateWithZodSchema(imageSchema, {
          image: file,
        });
        //delete old image
        if (existingEvent.image) {
          await backendClient.eventImages.deleteFile({
            url: existingEvent.image,
          });
        }
        //
        imagePath = await uploadImage(validatedFile.image);
      }
    }
    //update event
    await db.event.update({
      where: {
        id: eventId,
        profileId,
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

export async function fetchFollowId({ profileId }: { profileId: string }) {
  try {
    const myProfileId = await getCurrentUserProfileId();

    const follow = await db.follow.findFirst({
      where: {
        followerId: myProfileId, // I am the follower
        followingId: profileId, // Looking for the profile I'm following
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
  profileId, // This is the profile I want to follow
  followId,
  pathname,
}: {
  profileId: string;
  followId: string | null;
  pathname: string;
}) {
  try {
    const myProfileId = await getCurrentUserProfileId();

    if (followId) {
      await db.follow.delete({
        where: {
          id: followId,
        },
      });
      revalidatePath(pathname);
      return { message: "Unfollowed successfully" };
    }

    await db.follow.create({
      data: {
        followerId: myProfileId, // c3089... should be the follower
        followingId: profileId, // 5d299... should be the one being followed
      },
    });
    revalidatePath(pathname);
    return { message: "Followed successfully" };
  } catch (error) {
    console.log("Error toggling follow status:", error);
    return { message: "Error toggling follow status" };
  }
}

export const checkFollowAccess = async (profileId: string) => {
  try {
    const currentUserProfileId = await getCurrentUserProfileId();
    return {
      canFollow: currentUserProfileId !== profileId,
    };
  } catch (error) {
    return {
      canFollow: false,
    };
  }
};

export const fetchFollowedOrganizersEvents = async () => {
  try {
    const currentUserProfileId = await getCurrentUserProfileId();

    const events = await db.event.findMany({
      where: {
        profile: {
          followers: {
            some: {
              followerId: currentUserProfileId,
            },
          },
        },
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
        profile: {
          select: {
            id: true,
            firstName: true,
            profileImage: true,
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
