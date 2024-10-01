import { IconType } from 'react-icons';
import { MdCabin } from 'react-icons/md';

import { TbCaravan, TbTent, TbBuildingCottage } from 'react-icons/tb';

import { GiWoodCabin, GiMushroomHouse } from 'react-icons/gi';
import { PiWarehouse, PiLighthouse, PiVan } from 'react-icons/pi';

import { GoContainer } from 'react-icons/go';

type Genre = {
  label: GenreLabel;
  icon: IconType;
};

export type GenreLabel =
  | 'Latin'
  | 'Salsa'
  | 'Cumbia'
  | 'Tropical'
  | 'Reggeaton'
  | 'Bachata'
  | 'Merengue'
  | 'Bolero'
  | 'Latin-Rock'
  | 'Latin-Jazz'
  | 'Andino';

export const genres: Genre[] = [
  {
    label: 'Latin',
    icon: MdCabin,
  },
  {
    label: 'Salsa',
    icon: PiVan,
  },
  {
    label: 'Cumbia',
    icon: GiWoodCabin,
  },
  {
    label: 'Tropical',
    icon: GiWoodCabin,
  },
  {
    label: 'Reggeaton',
    icon: TbTent,
  },
  {
    label: 'Bachata',
    icon: PiWarehouse,
  },
  {
    label: 'Merengue',
    icon: TbBuildingCottage,
  },
  {
    label: 'Bolero',
    icon: PiLighthouse,
  },
  {
    label: 'Latin-Rock',
    icon: GiMushroomHouse,
  },
  {
    label: 'Latin-Jazz',
    icon: GoContainer,
  },
  {
    label: 'Andino',
    icon: TbCaravan,
  },
];
