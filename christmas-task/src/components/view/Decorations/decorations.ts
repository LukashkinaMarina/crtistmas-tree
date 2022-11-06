import { ChristmasToy } from 'src/types/app.types';
import { createSpruceToy, getHtmlElement, getToysForSpruce, setValues } from './decorations.service';
import './decorations.css';
import AppController from 'src/components/controller/controller';

const SLOT_LIMIT = 20;
class Decorations {
  public update(controller: AppController): void {
    const toys = controller.getToys();
    const toysRaw = controller.getToysRaw();
    const noItems = <HTMLElement>document.querySelector('.no-items-container');
    if (toys.length === 0) {
      noItems.style.display = 'flex';
    } else {
      noItems.style.display = 'none';
    }
    for (let i = 0; i < toysRaw.length; i++) {
      const container = <HTMLElement>document.getElementById(`toy-item-id-${toysRaw[i].num}`);
      if (container) {
        if (toys.find((t) => t.num === toysRaw[i].num)) {
          container.style.display = 'flex';
          container.style.opacity = '1';
          container.style.width = '304px';
        } else {
          container.style.opacity = '0';
          container.style.width = '0px';
          container.style.overflow = 'hidden';
          setTimeout(() => {
            container.style.display = 'none';
          }, 300);
        }
      }
    }
  }

  public drawSpruceToys(controller: AppController) {
    const toys = getToysForSpruce(controller);
    const fragment: DocumentFragment = document.createDocumentFragment();
    const toysItemTemp: HTMLTemplateElement = <HTMLTemplateElement>document.querySelector('#spruceToyTemp');
    toys.forEach((toy: ChristmasToy): void => {
      const toyContainer = createSpruceToy(toy, toysItemTemp, controller);
      fragment.append(toyContainer);
    });
    const toysContainer: HTMLElement = <HTMLElement>document.querySelector('.spruce-toys');
    if (toysContainer && toys.length > 0) {
      toysContainer.innerHTML = '';
      toysContainer.appendChild(fragment);
    }
  }

  public draw(controller: AppController): void {
    const toys = controller.getToysRaw();
    const fragment: DocumentFragment = document.createDocumentFragment();
    const toysItemTemp: HTMLTemplateElement = <HTMLTemplateElement>document.querySelector('#toysItemTemp');
    const noItems = <HTMLElement>document.querySelector('.no-items-container');
    noItems.style.display = 'none';
    toys.forEach((toy: ChristmasToy): void => {
      const toyContainer = <HTMLElement>toysItemTemp?.content.cloneNode(true);
      toyContainer.children[0].id = `toy-item-id-${toy.num}`;
      setValues(
        {
          name: getHtmlElement(toyContainer, '.toy-name'),
          count: getHtmlElement(toyContainer, '.toy-count'),
          year: getHtmlElement(toyContainer, '.toy-year'),
          shape: getHtmlElement(toyContainer, '.toy-shape'),
          color: getHtmlElement(toyContainer, '.toy-color'),
          size: getHtmlElement(toyContainer, '.toy-size'),
          favorite: getHtmlElement(toyContainer, '.toy-favorite'),
          img: getHtmlElement(toyContainer, '.toy-img'),
        },
        toy
      );

      getHtmlElement(toyContainer, '.download').addEventListener('click', (event: Event) => {
        event.stopPropagation();
        const container = <HTMLElement>document.getElementById(`toy-item-id-${toy.num}`);
        window.open((<HTMLImageElement>getHtmlElement(container, '.toy-img')).src, '_blank');
      });

      const checkbox = <HTMLInputElement>toyContainer.querySelector('.arrow-checkbox');
      const checkboxContainer = <HTMLInputElement>toyContainer.querySelector('.arrow');
      if (toy.favorite) {
        (<HTMLElement>toyContainer.querySelector('.arrow-middle')).classList.add('favorite-selected');
        (<HTMLElement>toyContainer.querySelector('.arrow-end')).classList.add('arrow-end-selected');
        checkbox.checked = true;
      }
      toyContainer.children[0].addEventListener('click', () => {
        const container = <HTMLElement>document.getElementById(`toy-item-id-${toy.num}`);
        container.classList.add('selected-card');
        const close = <HTMLElement>container.querySelector('.close');
        close.style.display = 'flex';
      });
      const close = <HTMLElement>toyContainer.children[0].querySelector('.close');
      close.addEventListener('click', (event: Event) => {
        event.stopPropagation();
        const container = <HTMLElement>document.getElementById(`toy-item-id-${toy.num}`);
        container.classList.remove('selected-card');
        (<HTMLElement>container.querySelector('.close')).style.display = 'none';
      });

      checkboxContainer.addEventListener('click', (event) => {
        event.stopPropagation();
        const container = <HTMLElement>document.getElementById(`toy-item-id-${toy.num}`);
        const input = <HTMLInputElement>container.querySelector('.arrow-checkbox');
        input.checked = !input.checked;
        const checked = input.checked;
        const favoriteFilter = <HTMLInputElement>document.querySelector('#filter-checkbox');
        const arrowMiddle = <HTMLElement>container.querySelector('.arrow-middle');
        const arrowEnd = <HTMLElement>container.querySelector('.arrow-end');
        const favoritesCount = controller.countFavorite();
        if (checked) {
          if (favoritesCount < SLOT_LIMIT) {
            toy.favorite = true;
            arrowMiddle.classList.add('favorite-selected');
            arrowEnd.classList.add('arrow-end-selected');
          } else {
            const popup = <HTMLElement>document.querySelector('.favorite-caption');
            popup.style.display = 'block';
            setTimeout(() => (popup.style.display = 'none'), 2000);
          }
        } else {
          toy.favorite = false;
          arrowMiddle.classList.remove('favorite-selected');
          arrowEnd.classList.remove('arrow-end-selected');
        }
        (<HTMLElement>document.querySelector(`.favorite-counter`)).textContent = String(controller.countFavorite());
        getHtmlElement(container, '.toy-favorite').textContent = 'Любимая: ' + (toy.favorite ? 'да' : 'нет');
        controller.checkboxSearch(favoriteFilter.checked);
        this.update(controller);
      });
      fragment.append(toyContainer);
    });
    const toysContainer: HTMLElement = <HTMLElement>document.querySelector('.toys');
    if (toysContainer && toys.length > 0) {
      toysContainer.innerHTML = '';
      toysContainer.appendChild(fragment);
    } else {
      noItems.style.display = 'none';
    }
  }
}

export default Decorations;
