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
  FiHeadphones,
  FiRadio,
  FiFilm,
  FiTv,
} from 'react-icons/fi';

export type Style = {
  name: string;
  icon: IconType;
  selected: boolean;
};

export const styles: Style[] = [
  { name: 'Salsa', icon: FiMusic, selected: false },
  { name: 'Salsa Brava', icon: FiCloud, selected: false },
  { name: 'Guaguanco', icon: FiTruck, selected: false },
  { name: 'Guaracha', icon: FiFeather, selected: false },
  { name: 'Son Montuno', icon: FiZap, selected: false },
  {
    name: 'Son',
    icon: FiWind,
    selected: false,
  },
  { name: 'Pachanga', icon: FiSun, selected: false },
  { name: 'Boogaloo', icon: FiCoffee, selected: false },
  { name: 'Descarga', icon: FiDroplet, selected: false },
  { name: 'Bolero', icon: FiAirplay, selected: false },
  { name: 'Merengue', icon: FiTrello, selected: false },
  {
    name: 'Bachata',
    icon: FiBox,
    selected: false,
  },
  { name: 'Timba', icon: FiAnchor, selected: false },
  {
    name: 'Cha Cha Cha',
    icon: FiMapPin,
    selected: false,
  },
  { name: 'Plena', icon: FiSunrise, selected: false },
  { name: 'Bomba', icon: FiSunset, selected: false },
];
