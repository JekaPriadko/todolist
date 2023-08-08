/* eslint-disable */

import {
  getDatabase,
  ref,
  onValue,
  Database,
  set,
  get,
  update,
  child,
} from 'firebase/database';

import { uid } from 'uid';

import DataTasksUser from '../tasks/DataTasksUser';
import { List } from '../../entity/list';

class ListUser {
  // eslint-disable-next-line
  private readyResolver: any;

  private readyPromise: Promise<void>;

  private db: Database;

  private userId: string | null;

  private listsData: Array<List> = [];

  private listWrap: HTMLElement | null;

  private listItems: NodeListOf<HTMLElement> | null;

  private addListBtn: HTMLElement | null;

  private addListModal: HTMLElement | null;

  private addListForm: HTMLFormElement | null;

  private addListColorField: HTMLInputElement | null;

  private addListTitleInput: HTMLInputElement | null;

  private addListModalClose: NodeListOf<HTMLElement> | null;

  private dataTask: DataTasksUser;

  private activeInputColor = false;

  private statusModal: 'update' | 'create';

  private updateListItemId: string | null;

  constructor(userId) {
    this.userId = userId;
    this.db = getDatabase();

    this.dataTask = new DataTasksUser(this.userId);

    this.listWrap = document.getElementById('lists-js');
    this.addListBtn = document.getElementById('add-list');
    this.addListModal = document.getElementById('add-list-modal');
    this.addListForm = document.getElementById(
      'add-list-form'
    ) as HTMLFormElement;

    this.addListModalClose = document.querySelectorAll('.close-add-list-js');
    this.addListColorField = this.addListModal.querySelector(
      '.modal__content-color'
    );
    this.addListTitleInput = this.addListModal.querySelector(
      '.modal__content-title'
    );

    this.addListForm.addEventListener('submit', (e) => this.addList(e));

    this.handleFocusInputColor();
    this.handleModalAddList();
  }

  public async run() {
    this.readyPromise = new Promise((resolve) => {
      this.readyResolver = resolve;
    });

    // ================================================================

    const starCountRef = ref(this.db, `${this.userId}/lists`);

    await this.getOnceDataList();

    onValue(starCountRef, (snapshot) => {
      const dataFirebase = snapshot.val() || [];

      this.prepareDataList(dataFirebase);
    });

    // ================================================================

    this.readyResolver();

    document.addEventListener('changedTask', async () => {
      this.getOnceDataList();
    });
  }
  private async getOnceDataList() {
    await get(child(ref(this.db), `${this.userId}/lists`))
      .then(async (snapshot) => {
        const dataFirebase = snapshot.val() || [];
        await this.prepareDataList(dataFirebase);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  private async prepareDataList(dataFirebase) {
    this.listsData = dataFirebase;

    const promises = this.listsData.map(async (list) => ({
      ...list,
      count: await this.dataTask.getTasksByList(list.id),
    }));

    this.listsData = await Promise.all(promises);
    const htmlList = this.listsData
      .map((list) => this.renderLists(list))
      .join('');

    this.listWrap.innerHTML = htmlList;
    this.handleClickListItem();
  }

  public isReadyList() {
    return this.readyPromise;
  }

  private handleModalAddList() {
    this.addListBtn.addEventListener('click', async () => {
      this.statusModal = 'create';
      this.setupDataModal();
      this.showAddModal();
    });

    this.addListModalClose.forEach((item: Element) => {
      item.addEventListener('click', async () => {
        this.closeModal();
      });
    });
  }

  private handleFocusInputColor() {
    this.addListColorField.addEventListener('focus', () => {
      this.activeInputColor = true;
    });
    this.addListColorField.addEventListener('blur', () => {
      setTimeout(() => {
        this.activeInputColor = false;
      }, 100);
    });
  }

  private handleClickListItem() {
    this.listItems = this.listWrap.querySelectorAll('.list-item-js');

    this.listItems.forEach((item: Element) => {
      item.addEventListener('click', async (e) => {
        const targetElement = e.target as HTMLElement;
        const listId = item.getAttribute('data-id');

        const isEdit = targetElement.closest('.sidebar__lists-edit');
        if (isEdit) {
          this.statusModal = 'update';
          this.setupDataModal(
            this.listsData.find((elem) => elem.id === listId)
          );
          this.showAddModal();
          return;
        }

        const isDelete = targetElement.closest('.sidebar__lists-delete');
        if (isDelete) {
          this.deleteList(listId);
          return;
        }

        console.log('filter');
      });
    });
  }

  private addList(e: SubmitEvent): void {
    e.preventDefault();
    const target = e.target as HTMLFormElement;
    const formData = new FormData(target);

    const newItem: List = {
      title: formData.get('list-title') as string,
      color: formData.get('list-color') as string,
    };

    if (this.statusModal === 'create') {
      newItem.id = uid();
      this.listsData.push(newItem);

      set(
        ref(this.db, `${this.userId}/lists`),
        this.listsData.filter((item) => item !== null)
      );
    }

    if (this.statusModal === 'update') {
      newItem.id = this.updateListItemId;
      const itemIndex = this.listsData.findIndex(
        (item) => item.id === this.updateListItemId
      );

      const updates = {};
      updates[`${this.userId}/lists/${itemIndex}`] = newItem;

      update(ref(this.db), updates);
    }

    document.dispatchEvent(new Event('changedList'));
    this.closeModal();
  }

  private deleteList(listId: string) {
    set(
      ref(this.db, `${this.userId}/lists`),
      this.listsData.filter((item) => item !== null && item.id !== listId)
    );
  }

  private closeModal() {
    if (this.activeInputColor) return;

    this.addListModal.classList.remove('active');
  }

  private setupDataModal(list?: List) {
    this.addListColorField.value = list ? list.color : '#4772fa';
    this.addListTitleInput.value = list ? list.title : '';
    this.updateListItemId = list ? list.id : null;
  }

  private showAddModal() {
    this.addListModal.classList.add('active');
  }

  private renderLists(list: List): string {
    return `<li class="sidebar__lists-item list-item-js" data-id="${list.id}">
      <div class="sidebar__lists-button">
        <span class="sidebar__lists-name">${list.title}</span>
        <div class="sidebar__lists-info">
          <span class="sidebar__lists-color" style="background-color: ${
            list.color
          }"></span>

          <span class="sidebar__lists-count">${list?.count || 0}</span>
        </div>

        <div class="sidebar__lists-actions">
          <button type="button" class="sidebar__lists-edit">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="/src/assets/images/sprite.svg#edit"></use>
            </svg>
          </button>
          <button type="button" class="sidebar__lists-delete">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="/src/assets/images/sprite.svg#delete"></use>
            </svg>
          </button>
        <div>
      </div>
    </li>`;
  }

  public static getLists(listUserInstance): Array<List> {
    return listUserInstance.listsData;
  }

  public static getOneLists(listUserInstance: ListUser, listId): List {
    return (
      listUserInstance.listsData.find((item) => item.id === listId) || null
    );
  }
}

export default ListUser;
