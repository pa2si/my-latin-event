import {
  salsaStyles,
  bachataStyles,
  cumbiaStyles,
  latinStyles,
  tropicalStyles,
  reggeatonStyles,
  merengueStyles,
  boleroStyles,
  latinRockStyles,
  latinJazzStyles,
  musicaAndindaStyles,
  folclorStyles,
  cantinaStyles,
} from "./styles";

const getStyles = (genre: string) => {
  switch (genre) {
    case "Latin":
      return latinStyles;
    case "Salsa":
      return salsaStyles;
    case "Cumbia":
      return cumbiaStyles;
    case "Tropical":
      return tropicalStyles;
    case "Reggeaton":
      return reggeatonStyles;
    case "Bachata":
      return bachataStyles;
    case "Merengue":
      return merengueStyles;
    case "Bolero":
      return boleroStyles;
    case "Latin-Rock":
      return latinRockStyles;
    case "Latin-Jazz":
      return latinJazzStyles;
    case "Musica Andina":
      return musicaAndindaStyles;
    case "Folclor":
      return folclorStyles;
    case "Cantina":
      return cantinaStyles;
    default:
      return [];
  }
};

// Helper function to get styles for multiple genres
export const getStylesForMultipleGenres = (genres: string[]) => {
  const allStyles = genres.flatMap((genre) => getStyles(genre));
  return Array.from(new Set(allStyles.map((style) => style.name))).map(
    (name) => allStyles.find((s) => s.name === name)!,
  );
};

export default getStyles;
