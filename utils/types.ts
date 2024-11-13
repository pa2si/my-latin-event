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

// types.ts or can be in the same file
export type EmailData = {
  id: string;
  emailAddress: string;
  verification: {
    status: string | undefined;
  } | null;
  isPrimary: boolean;
};

// You might also want these related types
export type EmailSettingsProps = {
  emails: EmailData[];
};

export type EmailListProps = {
  emails: EmailData[];
  onResendCode: (emailId: string) => void;
  onDelete: (
    prevState: any,
    formData: FormData,
  ) => Promise<{ message: string }>;
  setPrimaryAction: (
    prevState: any,
    formData: FormData,
  ) => Promise<{ message: string }>;
};

export type EmailListItemProps = {
  email: EmailData;
  onResendCode: (emailId: string) => void;
  onDelete: (emailId: string) => void;
};
