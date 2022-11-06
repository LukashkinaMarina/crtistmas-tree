import { bgs, ChristmasToy, garlands, SpruceData, spruces } from 'src/types/app.types';
import AppController from '../controller/controller';
import { getToysForSpruce, isPointInTriangle, listenSpruceToyImage } from '../view/Decorations/decorations.service';
import { CANVAS_X, CANVAS_Y, clearCanvas, flashGarland } from './canvas.serivce';

export const listenGarlandColorsButtons = (ctx: CanvasRenderingContext2D, controller: AppController): void => {
  (<HTMLElement>document.querySelector('.garland-color-buttons')).addEventListener('click', (event: Event) => {
    const container = <HTMLElement>document.querySelector('.garland-color-buttons');
    const className = (<HTMLElement>event.target).className;
    if (!garlands.includes(className)) return;
    const oldId = container.dataset.intervalId;
    if (oldId) {
      clearInterval(Number(oldId));
    }
    controller.appStore.store.spruce.garland = className;
    if (className === 'garland-off') {
      clearCanvas(ctx);
      return;
    }
    const id = flashGarland(ctx, className);
    container.dataset.intervalId = String(id);
  });
};

export const listenBackgroundButtons = (controller: AppController): void => {
  (<HTMLElement>document.querySelector('.menu-background')).addEventListener('click', (event: Event) => {
    const container = <HTMLElement>document.querySelector('.background-main-spruce');
    const selected = container.dataset.selected;
    const className = (<HTMLElement>event.target).className;
    if (!bgs.includes(className)) return;
    if (selected) {
      container.classList.remove(selected);
    }
    container.classList.add(className);
    container.dataset.selected = className;
    controller.appStore.store.spruce.bg = className;
  });
};

export const listenMainSpruceButton = (controller: AppController): void => {
  (<HTMLElement>document.querySelector('.choice-tree')).addEventListener('click', (event: Event) => {
    const container = <HTMLElement>document.querySelector('.main-spruce');
    const selected = container.dataset.selected;
    const className = (<HTMLElement>event.target).className;
    if (!spruces.includes(className)) return;
    if (selected) {
      container.classList.remove(selected);
    }
    container.classList.add(className);
    container.dataset.selected = className;
    controller.appStore.store.spruce.tree = className;
  });
};

export const listenSnowflakeButton = (controller: AppController): void => {
  (<HTMLElement>document.querySelector('.snowflake-button')).addEventListener('click', () => {
    const container = <HTMLElement>document.querySelector('.snowflake-button');
    const snowflakes = <HTMLElement>document.querySelector('.snowflakes');
    if (snowflakes.style.display !== 'none') {
      container.classList.add('button-selected');
      snowflakes.style.display = 'none';
      controller.appStore.store.spruce.snowflakes = true;
      return;
    }
    container.classList.remove('button-selected');
    snowflakes.style.display = 'block';
    controller.appStore.store.spruce.snowflakes = false;
  });
};

export const listenSoundButton = (controller: AppController): void => {
  (<HTMLElement>document.querySelector('.sound-button')).addEventListener('click', () => {
    const container = <HTMLElement>document.querySelector('.sound-button');
    const audio = <HTMLAudioElement>document.querySelector('#audio-id');
    if (audio.paused) {
      audio.play();
      audio.loop = true;
      container.classList.remove('button-selected');
      controller.appStore.store.spruce.audio = true;
    } else {
      audio.pause();

      container.classList.add('button-selected');
      controller.appStore.store.spruce.audio = false;
    }
  });
};

export const restoreSpruceData = (controller: AppController): void => {
  const mapping = {
    snowflakes: (value: boolean) => {
      const snowflakes = <HTMLElement>document.querySelector('.snowflakes');
      if (!value && snowflakes.style.display !== 'none') return;
      (<HTMLElement>document.querySelector('.snowflake-button')).click();
    },
    garland: (value: string) => {
      (<HTMLElement>document.querySelector(`.${value}`)).click();
    },
    bg: (value: string) => {
      (<HTMLElement>document.querySelector(`.${value}`)).click();
    },
    tree: (value: string) => {
      (<HTMLElement>document.querySelector(`.${value}`)).click();
    },
    audio: (value: boolean) => {
      if (value) {
        (<HTMLElement>document.querySelector('.sound-button')).classList.remove('button-selected');
      }
      setTimeout(() => {
        const handler = () => {
          (<HTMLElement>document.querySelector('.sound-button')).click();
          document.body.removeEventListener('click', handler);
        };
        if (value) {
          document.body.addEventListener('click', handler);
        }
      }, 500);
    },
  };
  const container = document.querySelector('.canvas-container');
  const toysOnSpruce = controller.appStore.store.spruce.toysOnSpruce;
  Object.keys(toysOnSpruce).forEach((key) => {
    const num = Number(key);
    toysOnSpruce[num].forEach((toy) => {
      const img = document.createElement('img');
      img.className = 'spruce-toy-img';
      img.src = toy.src;
      img.style.zIndex = '1500';
      img.style.left = toy.left;
      img.style.top = toy.top;
      img.style.position = 'absolute';
      container?.append(img);
      listenSpruceToyImage(
        img,
        controller.appStore.store.toys.find((t) => Number(t.num) === num) || ({} as ChristmasToy),
        toy,
        controller
      );
    });
  });
  const spruce: SpruceData = controller.appStore.store.spruce || { snowflakes: true };
  Object.keys(spruce)
    .filter((key) => key !== 'toysOnSpruce')
    .forEach((key) => {
      mapping[key](spruce[key]);
    });
};

export const resetToySprucesCounters = (controller: AppController) => {
  const toys = getToysForSpruce(controller);
  toys.forEach((toy) => {
    (<HTMLElement>document.querySelector(`#spruce-toy-counter-id-${[Number(toy.num)]}`)).textContent = String(
      Number(toy.count)
    );
  });
};

export const resetSpruce = (controller: AppController) => {
  const container = <HTMLElement>document.querySelector('.canvas-container');
  const nodeList = container.querySelectorAll('.spruce-toy-img');
  nodeList.forEach((el) => el.remove());
  controller.appStore.store.spruce = {
    snowflakes: true,
    garland: 'garland-off',
    bg: 'first-background',
    tree: 'first-spruce',
    audio: false,
    toysOnSpruce: {},
  };
  resetToySprucesCounters(controller);
  restoreSpruceData(controller);
};

export const listenGenSpruce = (controller: AppController): void => {
  (<HTMLElement>document.querySelector('.random-tree')).addEventListener('click', () => {
    resetToySprucesCounters(controller);
    const container = <HTMLElement>document.querySelector('.canvas-container');
    const nodeList = container.querySelectorAll('.spruce-toy-img');
    nodeList.forEach((el) => el.remove());
    controller.appStore.store.spruce = {
      snowflakes: true,
      garland: garlands[Math.trunc(Math.random() * (garlands.length - 0.01))],
      bg: bgs[Math.trunc(Math.random() * (bgs.length - 0.01))],
      tree: spruces[Math.trunc(Math.random() * (spruces.length - 0.01))],
      audio: false,
      toysOnSpruce: {},
    };
    const toys = getToysForSpruce(controller);
    toys.forEach((toy) => {
      for (let i = 0; i < Number(toy.count); i++) {
        const x = Math.trunc(Math.random() * CANVAS_X);
        const y = Math.trunc(Math.random() * CANVAS_Y);
        if (isPointInTriangle({ x, y })) {
          const img = {
            top: `${y}px`,
            left: `${x}px`,
            src: `https://raw.githubusercontent.com/LukashkinaMarina/chritmas-task-assests/main/assets/toys/${toy.num}.png`,
          };
          if (controller.appStore.store.spruce.toysOnSpruce[Number(toy.num)]) {
            controller.appStore.store.spruce.toysOnSpruce[Number(toy.num)].push(img);
          } else {
            controller.appStore.store.spruce.toysOnSpruce[Number(toy.num)] = [];
            controller.appStore.store.spruce.toysOnSpruce[Number(toy.num)].push(img);
          }
          (<HTMLElement>document.querySelector(`#spruce-toy-counter-id-${[Number(toy.num)]}`)).textContent = String(
            Number(toy.count) - controller.appStore.store.spruce.toysOnSpruce[Number(toy.num)].length
          );
        }
      }
    });
    restoreSpruceData(controller);
  });
};
