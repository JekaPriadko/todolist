import BaseTaskComponent from './BaseTaskComponent';

class PriorityHandler extends BaseTaskComponent {
  private blockSetBtn: string;

  private blockInput: string;

  private blockRenderListPlace: string;

  constructor() {
    super();
    this.block = '.priority-js';
    this.blockSetBtn = '.priority-set-js';
    this.blockInput = '.priority-input-js';
    this.blockRenderListPlace = '.priority-list-js';
  }

  public run(): void {
    this.initListeners();
  }

  private initListeners(): void {
    document.addEventListener('click', (e) => {
      const targetElement = e.target as HTMLElement;

      if (targetElement.closest(this.block)) {
        const priorityBlock = targetElement.closest(this.block) as HTMLElement;

        const listWrap = priorityBlock.querySelector(
          this.blockRenderListPlace
        ) as HTMLElement;
        listWrap.innerHTML = this.renderPriotityList();

        this.hideAllDropdown();
        priorityBlock.classList.add('active');

        if (targetElement.closest(this.blockSetBtn)) {
          const newValue = targetElement
            .closest(this.blockSetBtn)
            .getAttribute('data-priority');

          this.setBlock(priorityBlock, newValue);
        }
      } else {
        this.hideAllDropdown();
      }
    });
  }

  public setBlock(element, newValue): void {
    const prepareNewValue = newValue || '0';

    const priorityInput = element.querySelector(
      this.blockInput
    ) as HTMLInputElement;
    priorityInput.value = prepareNewValue;

    const priorityShowBtnSvg = element.querySelector('.priority-show-js use');

    priorityShowBtnSvg.setAttribute(
      'xlink:href',
      `/src/assets/images/sprite.svg#priority-${prepareNewValue}`
    );

    this.hideAllDropdown();
  }

  private renderPriotityList(): string {
    return `<button type="button" class="priority__item priority-set-js" data-priority="3">
      <svg class="icon button__icon button__prepend-icon" aria-hidden="true">
        <use xlink:href="/src/assets/images/sprite.svg#priority-3"></use>
      </svg>
    </button>
    <button type="button" class="priority__item priority-set-js" data-priority="2">
      <svg class="icon button__icon button__prepend-icon" aria-hidden="true">
        <use xlink:href="/src/assets/images/sprite.svg#priority-2"></use>
      </svg>
    </button>
    <button type="button" class="priority__item priority-set-js" data-priority="1">
      <svg class="icon button__icon button__prepend-icon" aria-hidden="true">
        <use xlink:href="/src/assets/images/sprite.svg#priority-1"></use>
      </svg>
    </button>
    <button type="button" class="priority__item priority-set-js" data-priority="0">
      <svg class="icon button__icon button__prepend-icon" aria-hidden="true">
        <use xlink:href="/src/assets/images/sprite.svg#priority-0"></use>
      </svg>
    </button>`;
  }
}

export default PriorityHandler;
