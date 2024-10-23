import { getCountryCodeByName } from "@/utils/countries";

const CountryFlagAndName = ({
  country,
}: {
  country: { flag: string; name: string };
}) => {
  const countryName =
    country.name.length > 20
      ? `${country.name.substring(0, 20)}...`
      : country.name;

  const counterCode = getCountryCodeByName(countryName);

  return (
    <span className="flex items-center justify-between gap-2 text-sm">
      {country.flag} {counterCode}
    </span>
  );
};

export default CountryFlagAndName;
