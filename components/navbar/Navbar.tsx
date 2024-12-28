import NavSearch from "./NavSearch";
import DarkMode from "./DarkMode";
import Logo from "./Logo";
import UserLocationIndicator from "@/components/navbar/UserLocationIndicator";
import GuestLocationIndicator from "@/components/navbar/GuestLocationIndicator";
import { currentUser } from "@clerk/nextjs/server";
import GenresDropdown from "@/components/navbar/GenresDropdown";
import { getUserCity } from "@/utils/actions";
import GenreBadges from "@/components/navbar/GenreBadges";
import SheetLinks from "./SheetLinks";

const Navbar = async () => {
  const user = await currentUser();
  const userLocation = await getUserCity();

  return (
    <nav className="border-b">
      <div className="container flex flex-col py-8">
        <div className="flex flex-row flex-wrap items-center justify-between gap-4">
          <Logo />
          <div className="order-2 flex items-center gap-2 sm:order-1">
            <NavSearch />
            {user ? (
              <UserLocationIndicator userLocation={userLocation} />
            ) : (
              <GuestLocationIndicator />
            )}
            <GenresDropdown />
          </div>
          <div className="order-1 flex items-center gap-4 sm:order-2">
            <DarkMode />
            <SheetLinks />
          </div>
        </div>
        <GenreBadges />
      </div>
    </nav>
  );
};

export default Navbar;
