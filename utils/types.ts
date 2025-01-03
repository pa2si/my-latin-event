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

export type UserProfile = {
  _count: {
    following: number;
    followers: number;
  };
  firstName: string;
  lastName: string;
  username: string;
  slogan: string | null;
  id: string;
  createdAt: Date;
  updatedAt: Date;
  clerkId: string;
  email: string;
  profileImage: string;
};
