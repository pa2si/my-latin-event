import { ProfileTab } from "@/utils/types";

export const isValidTab = (
  tab: string | string[] | undefined,
): tab is ProfileTab => {
  if (typeof tab !== "string") return false;
  return ["profile", "organizers", "email", "password"].includes(tab);
};
