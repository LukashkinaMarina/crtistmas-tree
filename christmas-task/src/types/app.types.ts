export interface ChristmasToy {
  num: string;
  name: string;
  count: string;
  year: string;
  shape: string;
  color: string;
  size: string;
  favorite: boolean;
  filter?: Filter;
}

export interface Filter {
  sortFilter?: SortingType;
  favoriteFilter?: boolean;
  searchFilter?: boolean | string;
  countFilter?: boolean | [number, number];
  yearFilter?: boolean | [number, number];
  circleFilter?: boolean;
  bellFilter?: boolean;
  coneFilter?: boolean;
  snowflakeFilter?: boolean;
  bearFilter?: boolean;
  whiteFilter?: boolean;
  redFilter?: boolean;
  blueFilter?: boolean;
  greenFilter?: boolean;
  yellowFilter?: boolean;
  littleFilter?: boolean;
  bigFilter?: boolean;
  middleFilter?: boolean;
}

export interface ImgOnSpruce {
  left: string;
  top: string;
  src: string;
}

export interface SpruceData {
  snowflakes: boolean;
  garland: string;
  bg: string;
  tree: string;
  audio: boolean;
  toysOnSpruce: Record<number, ImgOnSpruce[]>;
}

export interface Point {
  x: number;
  y: number;
}

export interface AppStorage {
  favoriteSelected: number;
  toys: ChristmasToy[];
  spruce: SpruceData;
  filter: Filter;
}

export enum SortingType {
  AZ = 'az',
  ZA = 'za',
  INCREASE = 'increase',
  DECREASE = 'decrease',
  YEAR_INCREASE = 'year-inc',
  YEAR_DECREASE = 'year-dec',
  SIZE_INCREASE = 'size-inc',
  SIZE_DECREASE = 'size-dec',
}

export enum ShapeForm {
  CIRCLE = 'circle',
  BELL = 'bell',
  CONE = 'cone',
  SNOWFLAKE = 'snowflake',
  BEAR = 'bear',
}

export enum ToyColor {
  RED = 'red',
  BLUE = 'blue',
  WHITE = 'white',
  YELLOW = 'yellow',
  GREEN = 'green',
}

export enum ToySize {
  BIG = 'big',
  MIDDLE = 'middle',
  SMALL = 'little',
}

export const mapSize: Record<ToySize, string> = {
  [ToySize.BIG]: 'большой',
  [ToySize.MIDDLE]: 'средний',
  [ToySize.SMALL]: 'малый',
};

export const sortWeight: Record<string, number> = {
  [mapSize[ToySize.BIG]]: 1,
  [mapSize[ToySize.MIDDLE]]: 2,
  [mapSize[ToySize.SMALL]]: 3,
};

export const mapColor: Record<ToyColor, string> = {
  [ToyColor.RED]: 'красный',
  [ToyColor.WHITE]: 'белый',
  [ToyColor.BLUE]: 'синий',
  [ToyColor.YELLOW]: 'желтый',
  [ToyColor.GREEN]: 'зелёный',
};

export const mapShape: Record<ShapeForm, string> = {
  [ShapeForm.CIRCLE]: 'шар',
  [ShapeForm.BELL]: 'колокольчик',
  [ShapeForm.CONE]: 'шишка',
  [ShapeForm.SNOWFLAKE]: 'снежинка',
  [ShapeForm.BEAR]: 'фигурка',
};

export interface DrawCircleProps {
  ctx: CanvasRenderingContext2D;
  radius: number;
  x: number;
  y: number;
  color: string;
  lineWidth?: number;
  strokeColor?: string;
}

export interface NoUISlider {
  create: (el: HTMLElement, config: { [x: string]: number[] | number | boolean | { [x: string]: number } }) => void;
}

export const garlands = [
  'garland-red',
  'garland-green',
  'garland-blue',
  'garland-yellow',
  'garland-multicolor',
  'garland-off',
];
export const bgs = [
  'first-background',
  'second-background',
  'third-background',
  'fourth-background',
  'fifth-background',
  'sixth-background',
  'seventh-background',
  'eighth-background',
  'ninth-background',
  'tenth-background',
];

export const spruces = [
  'first-spruce',
  'second-spruce',
  'third-spruce',
  'fourth-spruce',
  'fifth-spruce',
  'sixth-spruce',
];
