import { AppStorage, NoUISlider, ShapeForm, SortingType, ToyColor, ToySize } from 'src/types/app.types';
import AppController from '../controller/controller';
import AppView from '../view/appView';
import App from './app';
import {
  listenBackgroundButtons,
  listenGarlandColorsButtons,
  listenGenSpruce,
  listenMainSpruceButton,
  listenSnowflakeButton,
  listenSoundButton,
  resetSpruce,
} from './spruce.service';

const getHtmlElement = (query: string): HTMLElement => <HTMLElement>document.querySelector(query);
const getHtmlInputElement = (query: string): HTMLInputElement => <HTMLInputElement>document.querySelector(query);

const listenSearch = (controller: AppController, view: AppView): void => {
  const input = getHtmlInputElement('#site-search');
  input.addEventListener('keyup', (event: Event) => {
    controller.search((<HTMLInputElement>event.target).value);
    view.drawDecorations(controller);
  });
};

const listenFavoriteFilter = (controller: AppController, view: AppView): void => {
  (<HTMLElement>document.querySelector(`.favorite-counter`)).textContent = String(controller.countFavorite());
  getHtmlElement('#filter-checkbox').addEventListener('change', (event: Event) => {
    controller.checkboxSearch((<HTMLInputElement>event.target).checked);
    view.drawDecorations(controller);
  });
};

const listenSort = (controller: AppController, view: AppView): void => {
  getHtmlElement('.sorting-type').addEventListener('change', (event: Event) => {
    controller.sortToys(<SortingType>(<HTMLInputElement>event.target).value);
    view.drawDecorations(controller, true);
  });
};

const initTwoPointSlider = (query: string, range: { min: number; max: number }) => {
  var slider = getHtmlElement(query);
  <NoUISlider>global.noUiSlider.create(slider, {
    start: [range.min, range.max],
    connect: true,
    range,
  });
  updateMinMaxFilter(query, range.min, range.max);
};

const updateMinMaxFilter = (query: string, min: number, max: number): void => {
  const minEl: HTMLElement = getHtmlElement(`${query}-min`);
  const maxEl: HTMLElement = getHtmlElement(`${query}-max`);
  minEl.textContent = String(Math.trunc(min));
  maxEl.textContent = String(Math.trunc(max));
};

const listenQuantityFilter = (controller: AppController, view: AppView): void => {
  const query = '.quantity-toys';
  const quantity: HTMLInputElement = getHtmlInputElement(query);
  quantity.noUiSlider.on('change', () => {
    let [min, max] = quantity.noUiSlider.get();
    updateMinMaxFilter(query, min, max);
    controller.filterByCount(Math.trunc(min), Math.trunc(max));
    view.drawDecorations(controller);
  });
};

const listenYearFilter = (controller: AppController, view: AppView): void => {
  const query = '.year-toys';
  const year: HTMLInputElement = getHtmlInputElement(query);
  year.noUiSlider.on('change', () => {
    let [min, max] = year.noUiSlider.get();
    updateMinMaxFilter(query, min, max);
    controller.filterByYear(Math.trunc(min), Math.trunc(max));
    view.drawDecorations(controller);
  });
};

const listenShapeFilter = (form: ShapeForm, controller: AppController, view: AppView): void => {
  const parentDiv = getHtmlElement(`.${form}`);
  getHtmlElement(`#${form}-checkbox`).addEventListener('change', (event: Event) => {
    const checked: boolean = (<HTMLInputElement>event.target).checked;
    if (checked) {
      parentDiv.classList.add('filter-selected');
    } else {
      parentDiv.classList.remove('filter-selected');
    }
    controller.filterByShapeForm(form, checked);
    view.drawDecorations(controller);
  });
};

const listenColorFilter = (color: ToyColor, controller: AppController, view: AppView): void => {
  const parentDiv = getHtmlElement(`.${color}`);
  getHtmlElement(`#${color}-checkbox`).addEventListener('change', (event: Event) => {
    const checked: boolean = (<HTMLInputElement>event.target).checked;
    if (checked) {
      parentDiv.classList.add('filter-selected');
    } else {
      parentDiv.classList.remove('filter-selected');
    }
    controller.filterByColor(color, checked);
    view.drawDecorations(controller);
  });
};

const listenSizeFilter = (size: ToySize, controller: AppController, view: AppView): void => {
  const parentDiv = getHtmlElement(`.${size}`);
  getHtmlElement(`#${size}-checkbox`).addEventListener('change', (event: Event) => {
    const checked: boolean = (<HTMLInputElement>event.target).checked;
    if (checked) {
      parentDiv.classList.add('filter-selected');
    } else {
      parentDiv.classList.remove('filter-selected');
    }
    controller.filterBySize(size, checked);
    view.drawDecorations(controller);
  });
};

const resetShapeFilter = (form: ShapeForm): void => {
  const checkBox = <HTMLInputElement>getHtmlElement(`#${form}-checkbox`);
  if (checkBox.checked) checkBox.click();
};

const resetToySizeFilter = (size: ToySize): void => {
  const checkBox = <HTMLInputElement>getHtmlElement(`#${size}-checkbox`);
  if (checkBox.checked) checkBox.click();
};

const resetColorFilter = (color: ToyColor): void => {
  const checkBox = <HTMLInputElement>getHtmlElement(`#${color}-checkbox`);
  if (checkBox.checked) checkBox.click();
};

const resetRangeSlider = (query: string, min: number, max: number): [number, number] => {
  const year: HTMLInputElement = getHtmlInputElement(query);
  year.noUiSlider.set([min, max]);
  updateMinMaxFilter(query, min, max);
  return [Math.trunc(min), Math.trunc(max)];
};

const updateFilter = (type: ToyColor | ToySize | ShapeForm, store: AppStorage): void => {
  const checkbox = <HTMLInputElement>getHtmlElement(`#${type}-checkbox`);
  store.filter[`${type}Filter`] && !checkbox.checked && checkbox.click();
};

const filterApplier = (store: AppStorage, controller: AppController) => {
  return {
    sortFilter: () => {
      const el = getHtmlInputElement('.sorting-type');
      el.value = <string>store.filter.sortFilter;
      el.dispatchEvent(new Event('change'));
    },
    countFilter: () => {
      const [min, max] = <[number, number]>store.filter.countFilter;
      controller.filterByCount(...resetRangeSlider('.quantity-toys', min, max));
    },
    yearFilter: () => {
      const [min, max] = <[number, number]>store.filter.yearFilter;
      controller.filterByYear(...resetRangeSlider('.year-toys', min, max));
    },
    favoriteFilter: () => {
      const checkbox = getHtmlInputElement('#filter-checkbox');
      store.filter.favoriteFilter && !checkbox.checked && checkbox.click();
    },
    searchFilter: () => {
      const el = getHtmlInputElement('#site-search');
      el.value = <string>store.filter.searchFilter;
      el.dispatchEvent(new Event('keyup'));
    },
    circleFilter: () => {
      updateFilter(ShapeForm.CIRCLE, store);
    },
    bellFilter: () => {
      updateFilter(ShapeForm.BELL, store);
    },
    coneFilter: () => {
      updateFilter(ShapeForm.CONE, store);
    },
    snowflakeFilter: () => {
      updateFilter(ShapeForm.SNOWFLAKE, store);
    },
    bearFilter: () => {
      updateFilter(ShapeForm.BEAR, store);
    },
    whiteFilter: () => {
      updateFilter(ToyColor.WHITE, store);
    },
    redFilter: () => {
      updateFilter(ToyColor.RED, store);
    },
    blueFilter: () => {
      updateFilter(ToyColor.BLUE, store);
    },
    greenFilter: () => {
      updateFilter(ToyColor.GREEN, store);
    },
    yellowFilter: () => {
      updateFilter(ToyColor.YELLOW, store);
    },
    littleFilter: () => {
      updateFilter(ToySize.SMALL, store);
    },
    bigFilter: () => {
      updateFilter(ToySize.BIG, store);
    },
    middleFilter: () => {
      updateFilter(ToySize.MIDDLE, store);
    },
  };
};

const applyFilters = (store: AppStorage, controller: AppController) => {
  const applier = filterApplier(store, controller);
  Object.keys(store.filter).forEach((key) => {
    applier[key]();
  });
};

const resetFilters = (controller: AppController): void => {
  resetShapeFilter(ShapeForm.CIRCLE);
  resetShapeFilter(ShapeForm.SNOWFLAKE);
  resetShapeFilter(ShapeForm.BEAR);
  resetShapeFilter(ShapeForm.CONE);
  resetShapeFilter(ShapeForm.BELL);
  resetColorFilter(ToyColor.RED);
  resetColorFilter(ToyColor.GREEN);
  resetColorFilter(ToyColor.BLUE);
  resetColorFilter(ToyColor.WHITE);
  resetColorFilter(ToyColor.YELLOW);
  resetToySizeFilter(ToySize.BIG);
  resetToySizeFilter(ToySize.MIDDLE);
  resetToySizeFilter(ToySize.SMALL);
  const search = getHtmlInputElement('#site-search');
  search.value = '';
  search.dispatchEvent(new Event('keyup'));
  const checkbox = getHtmlInputElement('#filter-checkbox');
  checkbox.checked && checkbox.click();
  controller.filterByYear(...resetRangeSlider('.year-toys', controller.minYear(), controller.maxYear()));
  controller.filterByCount(...resetRangeSlider('.quantity-toys', 1, controller.maxCount()));
  localStorage.removeItem('christmasTreeStore');
};

const listenResetButton = (controller: AppController, view: AppView): void => {
  getHtmlElement('.reset-filters').addEventListener('click', () => {
    resetFilters(controller);
    view.drawDecorations(controller, true);
  });
};

const initListeners = (controller: AppController, view: AppView, ctx: CanvasRenderingContext2D) => {
  listenSpruceButton(view, controller);
  listenGarlandColorsButtons(ctx, controller);
  listenToysButton();
  listenLogoButton();
  listenResetTreeButton(controller);
  listenGenSpruce(controller);
  listenBackgroundButtons(controller);
  listenMainSpruceButton(controller);
  listenSnowflakeButton(controller);
  listenSoundButton(controller);

  listenSearch(controller, view);
  listenFavoriteFilter(controller, view);
  listenSort(controller, view);
  initTwoPointSlider('.quantity-toys', { min: 1, max: controller.maxCount() });
  listenQuantityFilter(controller, view);
  initTwoPointSlider('.year-toys', { min: controller.minYear(), max: controller.maxYear() });
  listenYearFilter(controller, view);

  listenShapeFilter(ShapeForm.CIRCLE, controller, view);
  listenShapeFilter(ShapeForm.SNOWFLAKE, controller, view);
  listenShapeFilter(ShapeForm.BEAR, controller, view);
  listenShapeFilter(ShapeForm.CONE, controller, view);
  listenShapeFilter(ShapeForm.BELL, controller, view);

  listenColorFilter(ToyColor.RED, controller, view);
  listenColorFilter(ToyColor.GREEN, controller, view);
  listenColorFilter(ToyColor.BLUE, controller, view);
  listenColorFilter(ToyColor.WHITE, controller, view);
  listenColorFilter(ToyColor.YELLOW, controller, view);

  listenSizeFilter(ToySize.BIG, controller, view);
  listenSizeFilter(ToySize.MIDDLE, controller, view);
  listenSizeFilter(ToySize.SMALL, controller, view);

  listenResetButton(controller, view);
};

export const listenSpruceButton = (view: AppView, controller: AppController): void => {
  (<HTMLElement>document.querySelector('.spruce')).addEventListener('click', () => {
    (<HTMLElement>document.querySelector('.toys')).style.display = 'none';
    (<HTMLElement>document.querySelector('.control-panel')).style.display = 'none';
    (<HTMLElement>document.querySelector('.spruce-screen')).style.display = 'flex';
    (<HTMLElement>document.querySelector('.spruce-toys')).style.display = 'flex';
    (<HTMLElement>document.querySelector('.snowflake')).style.display = 'block';
    (<HTMLElement>document.querySelector('.search-container')).style.display = 'none';
    view.drawSpruceToys(controller);
  });
};

const listenToysButton = (): void => {
  (<HTMLElement>document.querySelector('.nav-toy')).addEventListener('click', () => {
    (<HTMLElement>document.querySelector('.spruce-screen')).style.display = 'none';
    (<HTMLElement>document.querySelector('.control-panel')).style.display = 'flex';
    (<HTMLElement>document.querySelector('.toys')).style.display = 'flex';
    (<HTMLElement>document.querySelector('header')).style.display = 'flex';
    (<HTMLElement>document.querySelector('main')).style.display = 'flex';
    (<HTMLElement>document.querySelector('.spruce-toys')).style.display = 'none';
    (<HTMLElement>document.querySelector('.snowflake')).style.display = 'none';
    (<HTMLElement>document.querySelector('.search-container')).style.display = 'flex';
  });
};

const listenLogoButton = (): void => {
  (<HTMLElement>document.querySelector('.logo')).addEventListener('click', () => {
    (<HTMLElement>document.querySelector('.start-caption')).style.display = 'flex';
    (<HTMLElement>document.querySelector('.spruce-screen')).style.display = 'none';
    (<HTMLElement>document.querySelector('.control-panel')).style.display = 'none';
    (<HTMLElement>document.querySelector('.toys')).style.display = 'none';
    (<HTMLElement>document.querySelector('header')).style.display = 'none';
    (<HTMLElement>document.querySelector('main')).style.display = 'none';
    (<HTMLElement>document.querySelector('.spruce-toys')).style.display = 'none';
    (<HTMLElement>document.querySelector('.snowflake')).style.display = 'none';
    (<HTMLElement>document.querySelector('.search-container')).style.display = 'flex';
  });
};

const listenStartGameButton = (app: App) => {
  (<HTMLElement>document.querySelector('.start-game')).addEventListener('click', () => {
    (<HTMLElement>document.querySelector('header')).style.display = 'flex';
    (<HTMLElement>document.querySelector('main')).style.display = 'flex';
    (<HTMLElement>document.querySelector('.toys')).style.display = 'flex';
    (<HTMLElement>document.querySelector('.control-panel')).style.display = 'flex';
    (<HTMLElement>document.querySelector('.start-caption')).style.display = 'none';
    (<HTMLElement>document.querySelector('.spruce-toys')).style.display = 'none';
    (<HTMLElement>document.querySelector('.snowflake')).style.display = 'none';
    app.init();
    setTimeout(() => {
      const input = <HTMLInputElement>document.querySelector('#site-search');
      input.focus();
      input.select();
    }, 200);
  });
};

const listenResetTreeButton = (controller: AppController) => {
  (<HTMLElement>document.querySelector('.reset-tree')).addEventListener('click', () => {
    resetSpruce(controller);
  });
};

export {
  listenToysButton,
  listenResetTreeButton,
  listenLogoButton,
  listenStartGameButton,
  initListeners,
  getHtmlInputElement,
  listenSearch,
  listenYearFilter,
  listenQuantityFilter,
  listenSort,
  listenShapeFilter,
  listenFavoriteFilter,
  initTwoPointSlider,
  listenColorFilter,
  listenSizeFilter,
  listenResetButton,
  applyFilters,
};
