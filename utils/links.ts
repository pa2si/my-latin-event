import { IconType } from "react-icons";
import { LuCalendar, LuHome, LuUser2, LuHeart } from "react-icons/lu";
import { MdEvent } from "react-icons/md";
import { IoIosStats } from "react-icons/io";

type NavLink = {
  href: string;
  label: string;
  icon: IconType;
};

export const links: NavLink[] = [
  {
    href: "/",
    label: "home",
    icon: LuHome,
  },
  {
    href: "/my-events/create",
    label: "create event",
    icon: MdEvent,
  },
  {
    href: "/my-events",
    label: "my events",
    icon: LuCalendar,
  },
  {
    href: "/liked/events",
    label: "liked events",
    icon: LuHeart,
  },
  {
    href: "/followed/organizers/events",
    label: "organizers feed",
    icon: LuUser2,
  },
  {
    href: "/profile?tab=profile",
    label: "profile",
    icon: LuUser2,
  },
  {
    href: "/admin",
    label: "admin",
    icon: IoIosStats,
  },
];
