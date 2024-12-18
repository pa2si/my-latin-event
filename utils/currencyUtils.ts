import currencyCodes from "currency-codes";

export function getCurrencyFromCountry(countryName: string): string {
  if (!countryName) return "€";

  // Map of country names from Country-State-City to exact names from currency-codes
  const countryNameMap: Record<string, string> = {
    "United States": "united states of america (the)",
    "United Kingdom":
      "united kingdom of great britain and northern ireland (the)",
    // Add more mappings as needed
  };

  // Convert country name to lowercase and map if needed
  const normalizedCountry =
    countryNameMap[countryName] || countryName.toLowerCase();

  const currencies = currencyCodes.country(normalizedCountry);

  if (currencies && currencies.length > 0) {
    return currencies[0].code;
  }

  return "€";
}
