import AppController from '../controller/controller';
import Decorations from './Decorations/decorations';

export class AppView {
  private decorations: Decorations;
  private drown = false;
  constructor() {
    this.decorations = new Decorations();
  }

  public drawSpruceToys = (controller: AppController) => {
    this.decorations.drawSpruceToys(controller);
  };

  public drawDecorations(controller: AppController, refresh?: boolean): void {
    if (!this.drown || refresh) {
      this.drown = true;
      this.decorations.draw(controller);
    }
    this.decorations.update(controller);
  }
}

export default AppView;
