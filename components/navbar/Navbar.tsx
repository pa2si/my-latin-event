import NavSearch from "./NavSearch";
import LinksDropdown from "./LinksDropdown";
import DarkMode from "./DarkMode";
import Logo from "./Logo";
import CityFilterIndicator from "@/components/navbar/CityFilterIndicator";
import GuestLocationIndicator from "@/components/navbar/GuestLocationIndicator";
import { currentUser } from "@clerk/nextjs/server";

const Navbar = async () => {
  const user = await currentUser();

  return (
    <nav className="border-b">
      <div className="container flex flex-col flex-wrap gap-4 py-8 sm:flex-row sm:items-center sm:justify-between">
        <Logo />
        <div className="flex items-center gap-2">
          <NavSearch />
          {user ? <CityFilterIndicator /> : <GuestLocationIndicator />}
        </div>
        <div className="flex items-center gap-4">
          <DarkMode />
          <LinksDropdown />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
