import {
  ChristmasToy,
  mapColor,
  mapShape,
  mapSize,
  ShapeForm,
  SortingType,
  sortWeight,
  ToyColor,
  ToySize,
} from 'src/types/app.types';
import AppStore from '../store/app-store';

class AppController {
  private _store: AppStore;
  constructor() {
    this._store = {} as AppStore;
  }

  set appStore(store: AppStore) {
    this._store = store;
  }

  get appStore() {
    return this._store;
  }
  public getToysRaw(): ChristmasToy[] {
    return this.appStore.store.toys;
  }
  public getToys(): ChristmasToy[] {
    return this.appStore.store.toys
      .map((toy, index) => {
        return { ...toy, id: index };
      })
      .filter((e) => !e.filter?.searchFilter)
      .filter((e) => !e.filter?.favoriteFilter)
      .filter((e) => !e.filter?.countFilter)
      .filter((e) => !e.filter?.yearFilter)
      .filter((e) => !e.filter?.circleFilter)
      .filter((e) => !e.filter?.bellFilter)
      .filter((e) => !e.filter?.coneFilter)
      .filter((e) => !e.filter?.snowflakeFilter)
      .filter((e) => !e.filter?.bearFilter)
      .filter((e) => !e.filter?.whiteFilter)
      .filter((e) => !e.filter?.redFilter)
      .filter((e) => !e.filter?.blueFilter)
      .filter((e) => !e.filter?.greenFilter)
      .filter((e) => !e.filter?.yellowFilter)
      .filter((e) => !e.filter?.bigFilter)
      .filter((e) => !e.filter?.middleFilter)
      .filter((e) => !e.filter?.littleFilter);
  }
  public sortToys(value: SortingType): void {
    switch (value) {
      case SortingType.AZ:
        this.appStore.store.filter.sortFilter = SortingType.AZ;
        this.sortAz();
        break;
      case SortingType.ZA:
        this.appStore.store.filter.sortFilter = SortingType.ZA;
        this.sortZa();
        break;
      case SortingType.INCREASE:
        this.appStore.store.filter.sortFilter = SortingType.INCREASE;
        this.increase();
        break;
      case SortingType.DECREASE:
        this.appStore.store.filter.sortFilter = SortingType.DECREASE;
        this.decrease();
        break;
      case SortingType.YEAR_INCREASE:
        this.appStore.store.filter.sortFilter = SortingType.YEAR_INCREASE;
        this.sortByYearInc();
        break;
      case SortingType.YEAR_DECREASE:
        this.appStore.store.filter.sortFilter = SortingType.YEAR_DECREASE;
        this.sortByYearDec();
        break;
      case SortingType.SIZE_INCREASE:
        this.appStore.store.filter.sortFilter = SortingType.SIZE_INCREASE;
        this.sortBySizeInc();
        break;
      case SortingType.SIZE_DECREASE:
        this.appStore.store.filter.sortFilter = SortingType.SIZE_DECREASE;
        this.sortBySizeDec();
        break;
    }
  }

  public filterByCount(left: number, right: number): void {
    this.appStore.store.filter.countFilter = [left, right];
    this.appStore.store.toys.forEach((e) => {
      if (!e.filter) {
        e.filter = {};
      }
      if (Number(e.count) >= left && Number(e.count) <= right) {
        e.filter.countFilter = false;
      } else {
        e.filter.countFilter = true;
      }
    });
  }
  public filterByYear(left: number, right: number): void {
    this.appStore.store.filter.yearFilter = [left, right];
    this.appStore.store.toys.forEach((e) => {
      if (!e.filter) {
        e.filter = {};
      }
      if (Number(e.year) >= left && Number(e.year) <= right) {
        e.filter.yearFilter = false;
      } else {
        e.filter.yearFilter = true;
      }
    });
  }

  public search(value: string): void {
    this.appStore.store.filter.searchFilter = value;
    const lowered = value.toLowerCase();
    this.appStore.store.toys.forEach((e) => {
      if (!e.filter) {
        e.filter = {};
      }
      if (!e.name.toLowerCase().includes(lowered)) {
        e.filter.searchFilter = true;
      } else {
        e.filter.searchFilter = false;
      }
    });
  }
  public checkboxSearch(checked: boolean): void {
    this.appStore.store.filter.favoriteFilter = checked;
    if (checked) {
      this.appStore.store.toys.forEach((e) => {
        if (!e.filter) {
          e.filter = {};
        }
        e.filter.favoriteFilter = !e.favorite;
      });
    } else {
      this.appStore.store.toys.forEach((e) => {
        if (!e.filter) {
          e.filter = {};
        }
        e.filter.favoriteFilter = false;
      });
    }
  }

  public filterByShapeForm(shape: ShapeForm, checked: boolean): void {
    this.appStore.store.filter[`${shape}Filter`] = checked;
    this.appStore.store.toys.forEach((e) => {
      if (!e.filter) {
        e.filter = {};
      }
      e.filter[`${shape}Filter`] = (checked && mapShape[shape] === e.shape) || false;
    });
  }

  public filterByColor(color: ToyColor, checked: boolean): void {
    this.appStore.store.filter[`${color}Filter`] = checked;
    this.appStore.store.toys.forEach((e) => {
      if (!e.filter) {
        e.filter = {};
      }
      e.filter[`${color}Filter`] = (checked && mapColor[color] === e.color) || false;
    });
  }

  public filterBySize(size: ToySize, checked: boolean): void {
    this.appStore.store.filter[`${size}Filter`] = checked;
    this.appStore.store.toys.forEach((e) => {
      if (!e.filter) {
        e.filter = {};
      }
      e.filter[`${size}Filter`] = (checked && mapSize[size] === e.size) || false;
    });
  }

  public countFavorite(): number {
    const favorite = this.appStore.store.toys.map((e) => e.favorite).reduce((a, b) => (b ? a + 1 : a), 0);
    this.appStore.store.favoriteSelected = favorite;
    return favorite;
  }

  public decrease(): void {
    this.appStore.store.toys.sort((a, b) => Number(b.count) - Number(a.count));
  }
  public increase(): void {
    this.appStore.store.toys.sort((a, b) => Number(a.count) - Number(b.count));
  }
  public sortAz(): void {
    this.appStore.store.toys.sort((a, b) => (a.name > b.name ? 1 : -1));
  }
  public sortZa(): void {
    this.appStore.store.toys.sort((a, b) => (a.name < b.name ? 1 : -1));
  }
  public sortByYearDec(): void {
    this.appStore.store.toys.sort((a, b) => Number(b.year) - Number(a.year));
  }
  public sortByYearInc(): void {
    this.appStore.store.toys.sort((a, b) => Number(a.year) - Number(b.year));
  }
  public sortBySizeDec(): void {
    this.appStore.store.toys.sort((a, b) => (sortWeight[a.size] < sortWeight[b.size] ? -1 : 1));
  }
  public sortBySizeInc(): void {
    this.appStore.store.toys.sort((a, b) => (sortWeight[a.size] > sortWeight[b.size] ? -1 : 1));
  }
  public maxCount(): number {
    return Math.max(...this.appStore.store.toys.map((e) => Number(e.count)));
  }
  public minCount(): number {
    return Math.min(...this.appStore.store.toys.map((e) => Number(e.count)));
  }
  public maxYear(): number {
    return Math.max(...this.appStore.store.toys.map((e) => Number(e.year)));
  }
  public minYear(): number {
    return Math.min(...this.appStore.store.toys.map((e) => Number(e.year)));
  }
}

export default AppController;
