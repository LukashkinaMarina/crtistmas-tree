import AppController from '../controller/controller';
import AppStore from '../store/app-store';
import { AppView } from '../view/appView';
import { applyFilters, listenStartGameButton, initListeners } from './app.service';
import { initCanvas } from './canvas.serivce';
import { comment } from './comment';
import { restoreSpruceData } from './spruce.service';

export default class App {
  private controller: AppController;
  private view: AppView;
  private appStore: AppStore;
  private ctx: CanvasRenderingContext2D;
  constructor() {
    this.ctx = initCanvas();
    this.controller = new AppController();
    this.view = new AppView();
    this.appStore = new AppStore();
  }

  public init(): void {
    this.controller.appStore = this.appStore;
    this.view.drawDecorations(this.controller);
    this.view.drawSpruceToys(this.controller);
    initListeners(this.controller, this.view, this.ctx);
    restoreSpruceData(this.controller);
    applyFilters(this.appStore.store, this.controller);
  }

  public start(): void {
    document.addEventListener('dragover', (e) => e.preventDefault(), true);
    listenStartGameButton(this);
    comment();
  }
}
