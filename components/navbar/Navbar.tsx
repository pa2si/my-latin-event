import NavSearch from "./NavSearch";
import LinksDropdown from "./LinksDropdown";
import DarkMode from "./DarkMode";
import Logo from "./Logo";
import CityFilterIndicator from "@/components/navbar/CityFilterIndicator";

const Navbar = () => {
  return (
    <nav className="border-b">
      <div className="container flex flex-col flex-wrap gap-4 py-8 sm:flex-row sm:items-center sm:justify-between">
        <Logo />
        <div className="flex items-center gap-2">
          <NavSearch />
          <CityFilterIndicator />
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
