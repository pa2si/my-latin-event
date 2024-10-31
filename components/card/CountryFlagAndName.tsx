import { getCountryCodeByName, findCountryByName } from "@/utils/countries";

const CountryFlagAndName = ({ country }: { country: string }) => {
  const validCountry = findCountryByName(country);

  if (!validCountry) {
    return;
  }

  const { flag, name } = validCountry;
  const countryName = name.length > 20 ? `${name.substring(0, 20)}...` : name;

  // Get the country code
  const countryCode = getCountryCodeByName(countryName);

  return (
    <span className="flex items-center justify-between gap-2 text-sm">
      {flag} {countryCode}
    </span>
  );
};

export default CountryFlagAndName;
