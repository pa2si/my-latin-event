import { LuUser2 } from "react-icons/lu";
import { fetchProfileImage } from "@/utils/actions";

async function UserIcon() {
  try {
    const profileImage = await fetchProfileImage();

    if (profileImage) {
      return (
        <img
          src={profileImage}
          className="h-6 w-6 rounded-full object-cover"
          alt="User profile"
        />
      );
    }
  } catch (error) {}

  // Default fallback icon
  return <LuUser2 className="h-6 w-6 rounded-full bg-primary text-white" />;
}

export default UserIcon;
