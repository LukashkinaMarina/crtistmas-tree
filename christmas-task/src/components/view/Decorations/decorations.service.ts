import AppController from 'src/components/controller/controller';
import { ChristmasToy, ImgOnSpruce, Point } from 'src/types/app.types';

export const getHtmlElement = (parent: HTMLElement, query: string): HTMLElement =>
  <HTMLElement>parent.querySelector(query);

const getToyPosition = (event: DragEvent): Point => {
  const el = <HTMLElement>document.querySelector('html');
  const wrapper = <HTMLElement>document.querySelector('.decoration-spruce');
  let a = el.scrollTop;
  const offsetX = wrapper.offsetLeft + 40;
  const offsetY = wrapper.offsetTop;
  return { x: event.clientX - offsetX, y: event.clientY + a - offsetY - 100 };
};

export const showToy = (container: HTMLElement): void => {
  container.style.display = 'flex';
  container.style.opacity = '1';
  container.style.width = '304px';
};

export const hideToy = (container: HTMLElement): void => {
  container.style.opacity = '0';
  container.style.width = '0px';
  container.style.overflow = 'hidden';
  setTimeout(() => {
    container.style.display = 'none';
  }, 300);
};

export const setValues = (toyDom: { [x: string]: HTMLElement }, toy: ChristmasToy): void => {
  const { name, count, year, shape, color, size, favorite, img } = toyDom;
  name.textContent = toy.name;
  count.textContent = 'Количество: ' + toy.count;
  year.textContent = 'Год покупки: ' + toy.year;
  shape.textContent = 'Форма: ' + toy.shape;
  color.textContent = 'Цвет: ' + toy.color;
  size.textContent = 'Размер: ' + toy.size;
  favorite.textContent = 'Любимая: ' + (toy.favorite ? 'да' : 'нет');
  img.src = `https://raw.githubusercontent.com/LukashkinaMarina/chritmas-task-assests/main/assets/toys/${toy.num}.png`;
};

export const isPointInTriangle = (point: Point) => {
  const tr = [
    { x: 335, y: 15 },
    { x: 90, y: 605 },
    { x: 570, y: 605 },
  ];
  const { x, y } = point;

  const v0 = [tr[2].x - tr[0].x, tr[2].y - tr[0].y];
  const v1 = [tr[1].x - tr[0].x, tr[1].y - tr[0].y];
  const v2 = [x - tr[0].x, y - tr[0].y];

  const dot00 = v0[0] * v0[0] + v0[1] * v0[1];
  const dot01 = v0[0] * v1[0] + v0[1] * v1[1];
  const dot02 = v0[0] * v2[0] + v0[1] * v2[1];
  const dot11 = v1[0] * v1[0] + v1[1] * v1[1];
  const dot12 = v1[0] * v2[0] + v1[1] * v2[1];

  const invDenom = 1 / (dot00 * dot11 - dot01 * dot01);

  const u = (dot11 * dot02 - dot01 * dot12) * invDenom;
  const v = (dot00 * dot12 - dot01 * dot02) * invDenom;

  return u >= 0 && v >= 0 && u + v < 1;
};

export const createSpruceToy = (
  toy: ChristmasToy,
  toysItemTemp: HTMLTemplateElement,
  controller: AppController
): HTMLElement => {
  const toyContainer = <HTMLElement>toysItemTemp?.content.cloneNode(true);
  const count = controller.appStore.store.spruce.toysOnSpruce[Number(toy.num)]?.length || 0;
  const counter = getHtmlElement(toyContainer, '.spruce-toy-count');
  counter.id = `spruce-toy-counter-id-${toy.num}`;
  getHtmlElement(toyContainer, '.spruce-toy-count').textContent = String(Number(toy.count) - count);
  const img = <HTMLImageElement>getHtmlElement(toyContainer, '.spruce-toy-img');
  listenToyImage(img, toy, controller);
  img.src = `https://raw.githubusercontent.com/LukashkinaMarina/chritmas-task-assests/main/assets/toys/${toy.num}.png`;
  return toyContainer;
};

export const createNewImage = (point: Point, src: string): HTMLImageElement => {
  const newImg = document.createElement('img');
  newImg.className = 'spruce-toy-img';
  newImg.src = src;
  newImg.style.position = 'absolute';
  newImg.style.zIndex = '1500';
  newImg.style.left = `${point.x}px`;
  newImg.style.top = `${point.y}px`;
  return newImg;
};

export const listenSpruceToyImage = (
  img: HTMLImageElement,
  toy: ChristmasToy,
  toSave: ImgOnSpruce,
  controller: AppController
): void => {
  const { num, count } = toy;
  img.addEventListener('dragend', (event: DragEvent) => {
    const point = getToyPosition(event);
    const placed = controller.appStore.store.spruce.toysOnSpruce[Number(num)];
    if (!isPointInTriangle(point)) {
      controller.appStore.store.spruce.toysOnSpruce[Number(num)] = placed.filter((el) => el !== toSave);
      img.remove();
      (<HTMLElement>document.querySelector(`#spruce-toy-counter-id-${[Number(num)]}`)).textContent = String(
        Number(count) - placed.length + 1
      );
      return;
    }
    const currentImg = placed.find((image) => image === toSave);
    (<ImgOnSpruce>currentImg).left = `${point.x}px`;
    (<ImgOnSpruce>currentImg).top = `${point.y}px`;
    img.style.left = (<ImgOnSpruce>currentImg).left;
    img.style.top = (<ImgOnSpruce>currentImg).top;
  });
};

export const listenToyImage = (img: HTMLImageElement, toy: ChristmasToy, controller: AppController): void => {
  const { num, count } = toy;
  img.addEventListener('dragend', (event: DragEvent) => {
    let placed = controller.appStore.store.spruce.toysOnSpruce[Number(num)];
    const point = getToyPosition(event);
    if (Number(count) === placed?.length || !isPointInTriangle(point)) return;
    const newImg = createNewImage(point, img.src);
    const toSave = { left: newImg.style.left, top: newImg.style.top, src: img.src };
    listenSpruceToyImage(newImg, toy, toSave, controller);
    if (!placed) {
      placed = [];
      placed.push(toSave);
      controller.appStore.store.spruce.toysOnSpruce[Number(num)] = placed;
    } else {
      controller.appStore.store.spruce.toysOnSpruce[Number(num)].push(toSave);
    }
    const container = document.querySelector('.canvas-container');

    (<HTMLElement>document.querySelector(`#spruce-toy-counter-id-${[Number(num)]}`)).textContent = String(
      Number(count) - placed.length
    );
    container?.append(newImg);
  });
};

export const getToysForSpruce = (controller: AppController) => {
  const rawToys = controller.getToysRaw();
  const toys = rawToys.filter((t) => t.favorite);
  if (toys.length === 0) {
    return rawToys.slice(0, 20);
  }
  return toys;
};
