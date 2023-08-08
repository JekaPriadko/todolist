import BaseTaskComponent from './BaseTaskComponent';

import ListUser from '../../core/list/ListUser';
import { List } from '../../entity/list';

class ListHandler extends BaseTaskComponent {
  private listHandler: ListUser;

  private blockSetBtn: string;

  private blockInput: string;

  private blockRenderListPlace: string;

  constructor(listHandler: ListUser) {
    super();

    this.listHandler = listHandler;

    this.block = '.move-list-js';
    this.blockSetBtn = '.move-list-set-js';
    this.blockInput = '.move-list-input-js';
    this.blockRenderListPlace = '.move-list__lists-js';
  }

  public run(): void {
    this.initListeners();
  }

  private initListeners() {
    document.addEventListener('click', (e) => {
      const targetElement = e.target as HTMLElement;

      if (targetElement.closest(this.block)) {
        const listBlock = targetElement.closest(this.block) as HTMLElement;

        const listWrap = listBlock.querySelector(
          this.blockRenderListPlace
        ) as HTMLElement;
        const listData = ListUser.getLists(this.listHandler);
        this.renderLists(listWrap, listData);

        this.hideAllDropdown();
        listBlock.classList.add('active');

        if (targetElement.closest(this.blockSetBtn)) {
          const listId = targetElement
            .closest(this.blockSetBtn)
            .getAttribute('data-list');
          const newValue = listData.find((item) => item.id === listId) || null;
          this.setBlock(listBlock, newValue);
        }
      } else {
        this.hideAllDropdown();
      }
    });
  }

  public setBlock(element, newValue): void {
    const listInput = element.querySelector(
      this.blockInput
    ) as HTMLInputElement;
    listInput.value = newValue?.id || null;

    const listBtn = element.querySelector(
      '.move-list-show-js'
    ) as HTMLInputElement;
    listBtn.style.color = newValue?.color || null;

    const listTite = element.querySelector(
      '.move-list-title-js'
    ) as HTMLInputElement;

    if (listTite) {
      listTite.textContent = newValue?.title || 'Inbox';
    }

    this.hideAllDropdown();
  }

  private renderLists(listWrap: HTMLElement, listsData: Array<List>) {
    const inboxItem = this.renderItem({
      id: null,
      title: 'Inbox',
      color: null,
    });
    const otherListItems = listsData
      .map((list) => this.renderItem(list))
      .join('');

    const htmlList = inboxItem + otherListItems;
    listWrap.innerHTML = htmlList; // eslint-disable-line
  }

  private renderItem(list: List): string {
    return `<button
    type='button'
    class='move-list__item move-list-set-js'
    data-list='${list.id}'>
      ${list.title}
    </button>`;
  }
}

export default ListHandler;
