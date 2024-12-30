"use server";

import {
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
import { backendClient } from "@/lib/edgestore-server";
import { optimizeImage } from "@/utils/imageOptimizer";
import type { Prisma } from "@prisma/client";
import { format } from "date-fns";

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

export const fetchUserLocation = async () => {
  try {
    const user = await getAuthUser();

    const profile = await db.profile.findUnique({
      where: { clerkId: user.id },
      select: {
        userCountry: true,
        userState: true,
        userCity: true,
      },
    });

    return {
      userCountry: profile?.userCountry || "",
      userState: profile?.userState || "",
      userCity: profile?.userCity || "",
    };
  } catch (error) {
    console.error("Error fetching user location:", error);
    return {
      userCountry: "",
      userState: "",
      userCity: "",
    };
  }
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
        userCountry: validatedFields.userCountry,
        userState: validatedFields.userState,
        userCity: validatedFields.userCity || "",
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
    // Optimize image as flyer
    const optimized = await optimizeImage(file, "flyer");

    const res = await backendClient.eventImages.upload({
      content: {
        blob: optimized.blob,
        extension: optimized.extension,
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
    // Optimize image as avatar
    const optimized = await optimizeImage(file, "avatar");

    const res = await backendClient.organizerImages.upload({
      content: {
        blob: optimized.blob,
        extension: optimized.extension,
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
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!profile) return redirect("/profile");
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
    const file = formData.get("image") as File;

    const validatedFields = validateWithZodSchema(organizerSchema, {
      organizerName: rawData.organizerName,
      slogan: rawData.slogan || undefined,
      contactEmail: rawData.contactEmail || undefined,
      contactWebsite: rawData.contactWebsite || undefined,
      contactPhone: rawData.contactPhone || undefined,
      contactSocialMedia: rawData.contactSocialMedia || undefined,
    });

    const validatedFile = validateWithZodSchema(imageSchema, { image: file });
    const fullPath = await uploadOrganizerImage(validatedFile.image);

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
    const validatedFields = validateWithZodSchema(organizerSchema, {
      organizerName: rawData.organizerName,
      slogan: rawData.slogan || undefined,
      contactEmail: rawData.contactEmail || undefined,
      contactWebsite: rawData.contactWebsite || undefined,
      contactPhone: rawData.contactPhone || undefined,
      contactSocialMedia: rawData.contactSocialMedia || undefined,
    });

    // Only handle image if a new one was uploaded
    const file = formData.get("image") as File;
    let imageUrl = organizer.organizerImage;

    if (file?.size > 0) {
      const validatedFile = validateWithZodSchema(imageSchema, { image: file });
      imageUrl = await uploadOrganizerImage(validatedFile.image);
    }

    // Update the organizer
    await db.organizer.update({
      where: { id: organizerId },
      data: {
        ...validatedFields,
        organizerImage: imageUrl,
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

type ActionResponse = {
  message: string;
  success?: boolean;
};

export const createEventAction = async (
  prevState: any,
  formData: FormData,
): Promise<ActionResponse> => {
  try {
    const user = await getAuthUser();
    const organizerId = formData.get("organizerId") as string;

    if (!organizerId) throw new Error("Organizer ID is required");

    // Check if the user is an organizer
    const isOrganizer = await db.organizer.findFirst({
      where: {
        id: organizerId,
        profile: {
          clerkId: user.id,
        },
      },
    });

    if (!isOrganizer) {
      throw new Error(
        "You are not authorized to create an event for this organizer",
      );
    }

    const rawData = Object.fromEntries(formData);

    // Pre-process genres and styles before validation
    const rawGenres = formData.get("genres");
    const rawStyles = formData.get("styles");

    // Parse genres and styles if they're JSON strings
    const processedData = {
      ...rawData,
      genres: rawGenres ? JSON.parse(rawGenres as string) : [],
      styles: rawStyles ? JSON.parse(rawStyles as string) : [],
      ticketLink: (formData.get("ticketLink") as string) || undefined,
    };

    const validatedFields = validateWithZodSchema(eventSchema, processedData);
    const validatedFile = validateWithZodSchema(imageSchema, {
      image: formData.get("image") as File,
    });

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

    return {
      message: "",
      success: true,
    };
  } catch (error) {
    return renderError(error);
  }
};

export const fetchEvents = async ({
  search = "",
  genres,
  style, // Add style parameter
  country,
  state,
  city,
}: {
  search?: string;
  genres?: string[];
  style?: string; // Add type
  country?: string;
  state?: string;
  city?: string;
}) => {
  try {
    const user = await currentUser();

    const baseSelect = {
      id: true,
      name: true,
      location: true,
      subtitle: true,
      country: true,
      image: true,
      price: true,
      eventDateAndTime: true,
      genres: true,
      styles: true, // Add
    } satisfies Prisma.EventSelect;

    const baseWhere: Prisma.EventWhereInput = {
      genres: genres ? { hasSome: genres } : undefined,
      styles: style ? { has: style } : undefined, // Add
      OR: [
        { name: { contains: search, mode: "insensitive" } },
        { subtitle: { contains: search, mode: "insensitive" } },
      ],
    };

    if (user) {
      const userProfile = await db.profile.findUnique({
        where: {
          clerkId: user.id,
        },
        select: {
          userCity: true,
          userState: true,
          userCountry: true,
        },
      });

      if (userProfile) {
        const events = await db.event.findMany({
          where: {
            ...baseWhere,
            city: userProfile.userCity || userProfile.userState,
            country: userProfile.userCountry,
          },
          select: baseSelect,
          orderBy: {
            createdAt: "desc",
          },
        });
        return events;
      }
    }

    // If no user profile, use the provided location parameters
    if (country || state || city) {
      const events = await db.event.findMany({
        where: {
          ...baseWhere,
          city: city || state,
          country: country,
        },
        select: baseSelect,
        orderBy: {
          createdAt: "desc",
        },
      });
      return events;
    }

    // Fallback to all events if no location data available
    const events = await db.event.findMany({
      where: baseWhere,
      select: baseSelect,
      orderBy: {
        createdAt: "desc",
      },
    });
    return events;
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
};

export const fetchLikeId = async ({ eventId }: { eventId: string }) => {
  try {
    const user = await getAuthUser();
    const like = await db.like.findFirst({
      where: {
        eventId,
        profile: {
          clerkId: user.id,
        },
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

export const fetchLikeIds = async ({ eventIds }: { eventIds: string[] }) => {
  try {
    const user = await getAuthUser();
    const likes = await db.like.findMany({
      where: {
        eventId: { in: eventIds },
        profile: { clerkId: user.id },
      },
      select: {
        eventId: true,
        id: true,
      },
    });

    return likes.reduce(
      (acc, like) => {
        acc[like.eventId] = like.id;
        return acc;
      },
      {} as Record<string, string | null>,
    );
  } catch (error) {
    console.error("Error fetching likes:", error);
    return {};
  }
};

export const fetchEventsWithLikes = async (
  fetchEventsFn: () => Promise<any[]>,
) => {
  const events = await fetchEventsFn();
  const eventIds = events.map((event) => event.id);
  const likeIds = await fetchLikeIds({ eventIds });
  return { events, likeIds };
};

export const toggleLikeAction = async (prevState: {
  eventId: string;
  likeId: string | null;
  pathname: string;
}) => {
  try {
    const { eventId, likeId, pathname } = prevState;
    const user = await getAuthUser();

    // Get current user's profile
    const profile = await db.profile.findUnique({
      where: { clerkId: user.id },
      select: { id: true },
    });

    if (!profile) throw new Error("Profile not found");

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
          profileId: profile.id,
        },
      });
    }
    revalidatePath(pathname);
    return { message: likeId ? "Removed from Likes" : "Added to Likes" };
  } catch (error: any) {
    return { message: error.message || "Error occurred" };
  }
};

export const fetchLikes = async () => {
  try {
    const user = await getAuthUser();

    const likes = await db.like.findMany({
      where: {
        profile: {
          clerkId: user.id,
        },
      },
      select: {
        event: {
          select: {
            id: true,
            name: true,
            subtitle: true,
            genres: true,
            location: true,
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
      createdAt: true,
      updatedAt: true,
      name: true,
      subtitle: true,
      location: true,
      city: true,
      street: true,
      postalCode: true,
      country: true,
      googleMapsLink: true,
      genres: true,
      styles: true,
      image: true,
      description: true,
      price: true,
      currency: true,
      floors: true,
      bars: true,
      outdoorAreas: true,
      eventDateAndTime: true,
      eventEndDateAndTime: true,

      ticketLink: true,
      organizer: {
        select: {
          id: true,
          contactEmail: true,
          contactWebsite: true,
          contactPhone: true,
          contactSocialMedia: true,
          organizerName: true,
          organizerImage: true,
          slogan: true,
          profile: {
            select: {
              clerkId: true,
            },
          },
          _count: {
            select: {
              events: true,
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

export const deleteMultipleEventsAction = async (
  prevState: any,
  formData: FormData,
) => {
  const user = await getAuthUser();
  try {
    const eventIds = JSON.parse(formData.get("eventIds") as string);

    if (!Array.isArray(eventIds) || eventIds.length === 0) {
      return { message: "No events selected for deletion" };
    }

    // Find all events with organizer and profile info
    const events = await db.event.findMany({
      where: {
        id: { in: eventIds },
        organizer: {
          profile: {
            clerkId: user.id,
          },
        },
      },
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

    // Check authorization
    const isAdminUser = user.id === process.env.ADMIN_USER_ID;
    const unauthorizedEvents = events.filter(
      (event) => event.organizer.profile.clerkId !== user.id && !isAdminUser,
    );

    if (unauthorizedEvents.length > 0) {
      return {
        message: "Not authorized to delete some of the selected events",
      };
    }

    // Delete images from EdgeStore
    for (const event of events) {
      if (event.image) {
        try {
          await backendClient.eventImages.deleteFile({
            url: event.image,
          });
        } catch (error) {
          console.error("Failed to delete image from EdgeStore:", error);
        }
      }
    }

    // Delete all events
    await db.event.deleteMany({
      where: {
        id: { in: eventIds },
      },
    });

    revalidatePath("/my-events");
    return { message: `Successfully deleted ${events.length} events` };
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
        genres: true,
        styles: true,
        image: true,
        description: true,
        price: true,
        floors: true,
        bars: true,
        outdoorAreas: true,
        eventDateAndTime: true,
        eventEndDateAndTime: true,
        // New fields

        ticketLink: true,
        // Needed for authorization
        organizer: {
          select: {
            id: true,
            contactEmail: true,
            contactWebsite: true,
            contactPhone: true,
            contactSocialMedia: true,
            profile: {
              select: {
                clerkId: true,
              },
            },
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
  const newOrganizerId = formData.get("organizerId") as string;

  try {
    const user = await getAuthUser();

    const hasPermission = await db.organizer.findFirst({
      where: {
        id: newOrganizerId,
        profile: {
          clerkId: user.id,
        },
      },
    });

    if (!hasPermission) {
      throw new Error("You don't have permission to assign this organizer");
    }

    const rawData = Object.fromEntries(formData);

    // Pre-process genres and styles before validation
    const processedData = {
      ...rawData,
      genres: JSON.parse(rawData.genres as string),
      styles: JSON.parse(rawData.styles as string),
      ticketLink: (formData.get("ticketLink") as string) || undefined,
    };

    const validatedFields = validateWithZodSchema(eventSchema, processedData);
    const eventDateAndTime = validatedFields.eventDateAndTime as Date;
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
    let imageUrl = existingEvent.image;

    if (file?.size > 0) {
      const validatedFile = validateWithZodSchema(imageSchema, { image: file });
      imageUrl = await uploadEventImage(validatedFile.image);
    }

    // Update event
    await db.event.update({
      where: {
        id: eventId,
      },
      data: {
        ...validatedFields,
        organizerId: newOrganizerId,
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
        genres: true,
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

export async function getUserCity() {
  try {
    const user = await currentUser();
    if (!user) return null;

    const profile = await db.profile.findUnique({
      where: { clerkId: user.id },
      select: {
        userCity: true,
        userState: true,
      },
    });

    if (!profile) return null;

    return {
      location: profile.userCity || profile.userState,
      isCity: !!profile.userCity, // Boolean flag to indicate if it's a city or state
    };
  } catch (error) {
    console.error("Error fetching user location:", error);
    return null;
  }
}

export const fetchAdminStats = async () => {
  await getAdminUser();

  const usersCount = await db.profile.count();
  const eventsCount = await db.event.count();
  const organizersCount = await db.organizer.count();
  const likesCount = await db.like.count();
  const followsCount = await db.follow.count();

  return {
    usersCount,
    eventsCount,
    organizersCount,
    likesCount,
    followsCount,
  };
};

export const fetchChartsData = async () => {
  await getAdminUser();

  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  // Get events created per month
  const events = await db.event.findMany({
    where: {
      createdAt: {
        gte: sixMonthsAgo,
      },
    },
    select: {
      createdAt: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  // Get likes created per month
  const likes = await db.like.findMany({
    where: {
      createdAt: {
        gte: sixMonthsAgo,
      },
    },
    select: {
      createdAt: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  // Get follows created per month
  const follows = await db.follow.findMany({
    where: {
      createdAt: {
        gte: sixMonthsAgo,
      },
    },
    select: {
      createdAt: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  // Helper function to group data by month
  const groupByMonth = (data: { createdAt: Date }[]) => {
    return data.reduce((acc: { [key: string]: number }, item) => {
      const date = format(item.createdAt, "MMM yyyy");
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});
  };

  const getFullMonthRange = () => {
    const months = [];
    for (let i = 0; i < 6; i++) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      months.unshift(format(date, "MMM yyyy"));
    }
    return months;
  };

  const fillMissingMonths = (data: { [key: string]: number }) => {
    const months = getFullMonthRange();
    const filledData = { ...data };
    months.forEach((month) => {
      if (!filledData[month]) {
        filledData[month] = 0;
      }
    });
    return filledData;
  };

  const eventsPerMonth = fillMissingMonths(groupByMonth(events));
  const likesPerMonth = fillMissingMonths(groupByMonth(likes));
  const followsPerMonth = fillMissingMonths(groupByMonth(follows));

  const chartData = Object.keys(eventsPerMonth).map((month) => ({
    name: month,
    events: eventsPerMonth[month],
    likes: likesPerMonth[month],
    follows: followsPerMonth[month],
  }));

  return chartData;
};
