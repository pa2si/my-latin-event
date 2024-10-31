import countries from "world-countries";

export const formattedCountries = countries.map((item) => ({
  code: item.cca2,
  name: item.name.common,
  flag: item.flag,
  location: item.latlng,
  region: item.region,
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
