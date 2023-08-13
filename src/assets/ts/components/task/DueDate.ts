import { BaseTaskComponent, PossibleNewValues } from './BaseTaskComponent';

class DueDate extends BaseTaskComponent {
  private blockInput: string;

  constructor() {
    super();
    this.block = '.due-date-js';
    this.blockInput = '.due-date-input-js';
  }

  public run(): void {
    this.initListeners();
  }

  private initListeners(): void {
    this.showDatePicker();
    this.listenChangeDateInput();
  }

  private showDatePicker() {
    document.addEventListener('click', (e) => {
      const targetElement = e.target as HTMLElement;

      if (targetElement.closest(this.block)) {
        const dateBlock = targetElement.closest(this.block) as HTMLElement;

        const dateInput = dateBlock.querySelector(
          this.blockInput
        ) as HTMLInputElement;

        dateInput.showPicker();
      }
    });
  }

  private listenChangeDateInput() {
    document.addEventListener('change', async (e) => {
      const inputDate = e.target as HTMLInputElement;
      const dateBlock = inputDate.closest(this.block) as HTMLElement;

      if (dateBlock) {
        this.setBlock(dateBlock, inputDate.value);
      }
    });
  }

  public setBlock(element: HTMLElement, newValue: PossibleNewValues): void {
    const dateInput = element.querySelector(
      this.blockInput
    ) as HTMLInputElement;
    const dateText = element.querySelector('.due-date-text-js') as HTMLElement;

    if (newValue) {
      element.classList.add('active');
    } else {
      element.classList.remove('active');
      dateInput.value = ''; // eslint-disable-line
    }

    if (dateText) {
      dateText.textContent = newValue as string || 'Due Date';
    }
  }
}

export default DueDate;
