import NavSearch from "./NavSearch";
import LinksDropdown from "./LinksDropdown";
import DarkMode from "./DarkMode";
import Logo from "./Logo";
import UserLocationIndicator from "@/components/navbar/UserLocationIndicator";
import GuestLocationIndicator from "@/components/navbar/GuestLocationIndicator";
import { currentUser } from "@clerk/nextjs/server";
import GenresDropdown from "@/components/navbar/GenresDropdown";
import { getUserCity } from "@/utils/actions";

const Navbar = async () => {
  const user = await currentUser();
  const userLocation = await getUserCity();

  return (
    <nav className="border-b">
      <div className="container flex flex-wrap gap-4 py-8 flex-row items-center justify-between">
        <Logo />
        <div className="flex items-center gap-2 order-2 sm:order-1">
          <NavSearch />
          {user ? (
            <UserLocationIndicator userLocation={userLocation} />
          ) : (
            <GuestLocationIndicator />
          )}
          <GenresDropdown />
        </div>
        <div className="flex items-center gap-4 order-1 sm:order-2">
          <DarkMode />
          <LinksDropdown />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;