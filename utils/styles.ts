import { IconType } from 'react-icons';
import {
  FiCloud,
  FiTruck,
  FiZap,
  FiWind,
  FiSun,
  FiCoffee,
  FiFeather,
  FiAirplay,
  FiTrello,
  FiBox,
  FiAnchor,
  FiDroplet,
  FiMapPin,
  FiSunrise,
  FiSunset,
  FiMusic,
} from 'react-icons/fi';

export type Style = {
  name: string;
  icon: IconType;
  selected: boolean;
};

export const salsaStyles: Style[] = [
  { name: 'Salsa', icon: FiMusic, selected: false },
  { name: 'Salsa Brava', icon: FiCloud, selected: false },
  { name: 'Guaguanco', icon: FiTruck, selected: false },
  { name: 'Guaracha', icon: FiFeather, selected: false },
  { name: 'Son Montuno', icon: FiZap, selected: false },
  { name: 'Son', icon: FiWind, selected: false },
  { name: 'Pachanga', icon: FiSun, selected: false },
  { name: 'Boogaloo', icon: FiCoffee, selected: false },
  { name: 'Descarga', icon: FiDroplet, selected: false },
  { name: 'Bolero', icon: FiAirplay, selected: false },
  { name: 'Merengue', icon: FiTrello, selected: false },
  { name: 'Bachata', icon: FiBox, selected: false },
  { name: 'Timba', icon: FiAnchor, selected: false },
  { name: 'Cha Cha Cha', icon: FiMapPin, selected: false },
  { name: 'Plena', icon: FiSunrise, selected: false },
  { name: 'Bomba', icon: FiSunset, selected: false },
];

export const bachataStyles: Style[] = [
  { name: 'Sensual', icon: FiBox, selected: false },
  { name: 'Dominicana', icon: FiAirplay, selected: false },
];

export const latinStyles: Style[] = [
  { name: 'Salsa', icon: FiBox, selected: false },
  { name: 'Cumbia', icon: FiAirplay, selected: false },
  { name: 'Reggeaton', icon: FiAirplay, selected: false },
  { name: 'Bachata', icon: FiAirplay, selected: false },
  { name: 'Merengue', icon: FiAirplay, selected: false },
  { name: 'HipHop', icon: FiAirplay, selected: false },
  { name: 'Tropical', icon: FiAirplay, selected: false },
  { name: 'Bolero', icon: FiAirplay, selected: false },
  { name: 'Latin-Rock', icon: FiAirplay, selected: false },
  { name: 'Latin-Jazz', icon: FiAirplay, selected: false },
];

export const cumbiaStyles: Style[] = [
  { name: 'Villera', icon: FiBox, selected: false },
  { name: 'Colombiana', icon: FiAirplay, selected: false },
  { name: 'Peruana', icon: FiAirplay, selected: false },
  { name: 'Mexicana', icon: FiAirplay, selected: false },
  { name: 'Chilena', icon: FiAirplay, selected: false },
  { name: 'Amazonica', icon: FiAirplay, selected: false },
  { name: 'Psicodelica', icon: FiAirplay, selected: false },
  { name: 'Folklorica', icon: FiAirplay, selected: false },
];
