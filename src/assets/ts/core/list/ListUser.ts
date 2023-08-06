/* eslint-disable */

import { getDatabase, ref, onValue, set, Database } from 'firebase/database';

import { List } from '../../entity/list';

class ListUser {
  private db: Database;

  private userId: string | null;

  private listsData: Array<List> = [];

  private listWrap: HTMLElement | null;

  private addListBtn: HTMLElement | null;

  private addListModal: HTMLElement | null;

  private addListModalClose: NodeListOf<HTMLElement> | null;

  private addListForm: HTMLFormElement | null;

  constructor(userId) {
    this.userId = userId;
    this.db = getDatabase();

    this.listWrap = document.getElementById('lists-js');
    this.addListBtn = document.getElementById('add-list');
    this.addListModal = document.getElementById('add-list-modal');
    this.addListForm = document.getElementById(
      'add-list-form'
    ) as HTMLFormElement;

    this.addListModalClose = document.querySelectorAll('.close-add-list-js');

    this.addListForm.addEventListener('submit', (e) => this.addList(e));

    this.handleModalAddList();
  }

  public async run() {
    const starCountRef = ref(this.db, `${this.userId}/lists`);
    onValue(starCountRef, (snapshot) => {
      this.listsData = snapshot.val() || [];

      const htmlList = this.listsData
        .map((list) => this.renderLists(list))
        .join('');
      this.listWrap.innerHTML = htmlList;
    });
  }

  public getLists(): Array<List> {
    return this.listsData;
  }

  private handleModalAddList() {
    this.addListBtn.addEventListener('click', async () => {
      this.addListModal.classList.add('active');
    });

    this.addListModalClose.forEach((item: Element) => {
      item.addEventListener('click', async () => {
        this.closeModal();
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

    this.listsData.push(newItem);
    set(
      ref(this.db, `${this.userId}/lists`),
      this.listsData.filter((item) => item !== null)
    );

    this.closeModal();
  }

  private closeModal() {
    this.addListModal.classList.remove('active');
  }

  private renderLists(list: List): string {
    return ` <li class="sidebar__lists-item">
      <button class="sidebar__lists-button" type="button">
        <span class="sidebar__lists-name">${list.title}</span>
        <span class="sidebar__lists-color" style="background-color: ${list.color}"></span>
        <span class="sidebar__lists-count">0</span>
      </button>
    </li>`;
  }
}

export default ListUser;
