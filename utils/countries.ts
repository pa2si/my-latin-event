import { Country } from "country-state-city";

export const formattedCountries = Country.getAllCountries().map((item) => ({
  code: item.isoCode,
  name: item.name,
  flag: item.flag,
  location: [item.latitude, item.longitude],
}));

export const findCountryByCode = (code: string) =>
  formattedCountries.find((item) => item.code === code);

export const findCountryByName = (name: string) => {
  if (!name) {
    return undefined;
  }

  return formattedCountries.find(
    (item) => item.name.toLowerCase() === name.trim().toLowerCase(),
  );
};

export const getCountryCodeByName = (name: string): string | undefined => {
  const country = findCountryByName(name);
  return country ? country.code : undefined;
};
