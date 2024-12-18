export type actionFunction = (
  prevState: any,
  formData: FormData,
) => Promise<{ message: string }>;

export type Style = {
  name: string;
  selected: boolean;
};

export type EventCardProps = {
  id: string;
  name: string;
  genres: string[];
  location: string;
  subtitle?: string | null;
  image: string;
  eventDateAndTime: Date; // Ensure this is strictly Date
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

export type Organizer = {
  id: string;
  organizerName: string;
  organizerImage: string;
  slogan?: string | null;
  profileId?: string;
  _count?: {
    events: number;
  };
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

export type ProfileTab = "profile" | "organizers" | "email" | "password";

export interface PriceInputProps {
  defaultValue?: string;
  currency?: string;
  onCurrencyChange?: (currency: string) => void;
}
