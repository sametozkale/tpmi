import countries from "i18n-iso-countries";
import enLocale from "i18n-iso-countries/langs/en.json";

countries.registerLocale(enLocale);

export interface CountryOption {
  id: string;
  name: string;
}

export function getCountryOptions(): CountryOption[] {
  const alpha2Codes = Object.keys(countries.getAlpha2Codes());

  return alpha2Codes
    .map((id) => {
      const name =
        countries.getName(id, "en", { select: "official" }) ??
        countries.getName(id, "en");

      return {
        id,
        name: name ?? id,
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}
