type NavLink = {
  href: string;
  label: string;
};

export const links: NavLink[] = [
  { href: "/", label: "home" },
  { href: "/my-events/create ", label: "create event" },
  { href: "/my-events", label: "my events" },
  { href: "/liked/events ", label: "liked events" },
  { href: "/followed/creators/events ", label: "creators feed" },
  { href: "/bookings ", label: "bookings" },
  { href: "/reviews ", label: "reviews" },
  { href: "/reservations ", label: "reservations" },
  { href: "/profile ", label: "profile" },
  { href: "/admin ", label: "admin" },
];
