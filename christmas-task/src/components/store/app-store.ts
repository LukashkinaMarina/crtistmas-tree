import data from 'src/data';
import { AppStorage, SortingType } from 'src/types/app.types';

export const defaultStore: AppStorage = {
  favoriteSelected: 0,
  toys: data,
  spruce: {
    snowflakes: true,
    garland: 'garland-off',
    bg: 'first-background',
    tree: 'first-spruce',
    audio: false,
    toysOnSpruce: {},
  },
  filter: {
    sortFilter: SortingType.AZ,
  },
};

class AppStore {
  private _store: AppStorage;
  constructor() {
    const saved = JSON.parse(localStorage.getItem('christmasTreeStore') || '{}');
    this._store = Object.keys(saved).length > 0 ? saved : defaultStore;
    window.addEventListener('beforeunload', () => {
      localStorage.setItem('christmasTreeStore', JSON.stringify(this._store));
    });
  }

  get store(): AppStorage {
    if (!this._store.spruce) {
      this._store.spruce = defaultStore.spruce;
    }
    if (!this._store.spruce.toysOnSpruce) {
      this._store.spruce.toysOnSpruce = {};
    }
    return this._store;
  }
}

export default AppStore;
