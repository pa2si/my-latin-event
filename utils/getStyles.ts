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
} from './styles';

const getStyles = (genre: string) => {
  switch (genre) {
    case 'Latin':
      return latinStyles;
    case 'Salsa':
      return salsaStyles;
    case 'Cumbia':
      return cumbiaStyles;
    case 'Tropical':
      return tropicalStyles;
    case 'Reggeaton':
      return reggeatonStyles;
    case 'Bachata':
      return bachataStyles;
    case 'Merengue':
      return merengueStyles;
    case 'Bolero':
      return boleroStyles;
    case 'Latin-Rock':
      return latinRockStyles;
    case 'Latin-Jazz':
      return latinJazzStyles;
    case 'Musica Andina':
      return musicaAndindaStyles;
    default:
      return [];
  }
};

export default getStyles;
