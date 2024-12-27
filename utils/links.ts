type NavLink = {
  href: string;
  label: string;
};

export const links: NavLink[] = [
  { href: "/", label: "home" },
  { href: "/my-events/create ", label: "create event" },
  { href: "/my-events", label: "my events" },
  { href: "/liked/events ", label: "liked events" },
  { href: "/followed/organizers/events ", label: "organizers feed" },
  { href: "/profile?tab=profile ", label: "profile" },
  { href: "/admin ", label: "admin" },
];
