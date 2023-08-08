import { List } from '../../entity/list';

type PossibleNewValues = string | number | List | null;

abstract class BaseHandler {
  public block: string | null;

  constructor() {
    this.handlerResetItemInMainForm();
  }

  hideAllDropdown() {
    const elements = document.querySelectorAll(this.block);
    elements.forEach((item) => {
      item.classList.remove('active');
    });
  }

  handlerResetItemInMainForm() {
    document.addEventListener('resetMainForm', () => {
      const elementInMainForm = document.querySelector(
        `#create-task-js ${this.block}`
      ) as HTMLElement;
      this.setBlock(elementInMainForm, null);
    });
  }

  abstract setBlock(
    element: HTMLElement | null,
    newValue: PossibleNewValues
  ): void;
}

export default BaseHandler;
