import {
  salsaStyles,
  bachataStyles,
  cumbiaStyles,
  latinStyles,
} from './styles';

const getStyles = (genre: string) => {
  switch (genre) {
    case 'Salsa':
      return salsaStyles;
    case 'Bachata':
      return bachataStyles;
    case 'Cumbia':
      return cumbiaStyles;
    case 'Latin':
      return latinStyles;
    default:
      return [];
  }
};

export default getStyles;
