import { ref, set, update, Database } from 'firebase/database';

import { uid } from 'uid';

import { List } from '../../entity/list';

type PossibleModalStatus = 'update' | 'create';

class ListUserModal {
  private readonly db: Database;

  private userId: string;

  private listsData: Array<List> = [];

  private readonly modal: HTMLElement | null;

  private readonly modalForm: HTMLFormElement | null;

  private readonly modalFormColorField: HTMLInputElement | null;

  private readonly modalFormTitleField: HTMLInputElement | null;

  private readonly modalCloseBtn: NodeListOf<HTMLElement> | null;

  private isActiveInputColor = false;

  private statusModal: PossibleModalStatus;

  private updateListItemId: string | null;

  constructor(userId: string, db: Database, listsData: Array<List>) {
    this.userId = userId;
    this.db = db;
    this.listsData = listsData;

    this.modal = document.getElementById('add-list-modal');
    this.modalCloseBtn = document.querySelectorAll('.close-add-list-js');

    this.modalForm = document.getElementById(
      'add-list-form'
    ) as HTMLFormElement;
    this.modalFormColorField = this.modalForm.querySelector(
      '.modal__content-color'
    );
    this.modalFormTitleField = this.modalForm.querySelector(
      '.modal__content-title'
    );

    this.setupListeners();
  }

  private setupListeners() {
    this.modalForm.addEventListener('submit', (e) => this.addList(e));
    this.handleActiveInputColor();
    this.handleModalShow();
  }

  public updateListsData(newListsData: Array<List>) {
    this.listsData = newListsData;
  }

  private handleModalShow() {
    const showListBtn = document.getElementById('show-modal-list');

    showListBtn.addEventListener('click', async () => {
      this.statusModal = 'create';
      this.setupDataModal();
      this.showAddModal();
    });

    this.modalCloseBtn.forEach((item: Element) => {
      item.addEventListener('click', async () => {
        this.closeModal();
      });
    });
  }

  private handleActiveInputColor() {
    this.modalFormColorField.addEventListener('focus', () => {
      this.isActiveInputColor = true;
    });
    this.modalFormColorField.addEventListener('blur', () => {
      setTimeout(() => {
        this.isActiveInputColor = false;
      }, 100);
    });
  }

  public showAddModal() {
    this.modal.classList.add('active');
  }

  public closeModal() {
    if (this.isActiveInputColor) return;

    this.modal.classList.remove('active');
  }

  public setupDataModal(list?: List) {
    this.modalFormColorField.value = list ? list.color : '#4772fa';
    this.modalFormTitleField.value = list ? list.title : '';
    this.updateListItemId = list ? list.id : null;
  }

  public setStatusModal(newStatus: PossibleModalStatus) {
    this.statusModal = newStatus;
  }

  private async addList(e: SubmitEvent): Promise<void> {
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

      await set(
        ref(this.db, `${this.userId}/lists`),
        this.listsData.filter((item) => item !== null)
      );
    }

    if (this.statusModal === 'update') {
      newItem.id = this.updateListItemId;
      const itemIndex = this.listsData.findIndex(
        (item) => item.id === this.updateListItemId
      );

      const updates: Record<string, List> = {};
      updates[`${this.userId}/lists/${itemIndex}`] = newItem;

      await update(ref(this.db), updates);
    }

    document.dispatchEvent(new Event('changedList'));
    this.closeModal();
  }
}

export default ListUserModal;
