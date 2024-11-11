export type actionFunction = (
  prevState: any,
  formData: FormData,
) => Promise<{ message: string }>;

export type EventCardProps = {
  image: string;
  id: string;
  name: string;
  subtitle: string | null;
  country: string;
  price: number;
};

export type DateRangeSelect = {
  startDate: Date;
  endDate: Date;
  key: string;
};

export type Booking = {
  checkIn: Date;
  checkOut: Date;
};

export type EventWithDate = EventCardProps & {
  eventDateAndTime: Date;
};

// types/organizer.ts
export type Organizer = {
  id: string;
  organizerName: string;
  organizerImage: string;
  slogan?: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
  profileId: string;
};

export type OrganizersTabProps = {
  organizers: Organizer[];
};
