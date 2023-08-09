import {
  getDatabase,
  ref,
  onValue,
  Database,
  set,
  get,
  child,
} from 'firebase/database';

import ListUserModal from './ListUserModal';
import DataTasksUser from '../tasks/DataTasksUser';
import { List } from '../../entity/list';

class ListUser {
  // eslint-disable-next-line
  private readyResolver: any;

  private readyPromise: Promise<void>;

  private db: Database;

  private userId: string | null;

  private listsData: Array<List> = [];

  private dataTask: DataTasksUser;

  private modalAddList: ListUserModal;

  private listBlock: HTMLElement | null;

  constructor(userId) {
    this.userId = userId;
    this.db = getDatabase();

    this.dataTask = new DataTasksUser(this.userId);

    this.modalAddList = new ListUserModal(this.userId, this.db, this.listsData);

    this.listBlock = document.getElementById('lists-js');

    this.setupListeners();
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
  }

  private setupListeners() {
    document.addEventListener('changedTask', async () => {
      this.getOnceDataList();
    });
  }

  public isReadyList() {
    return this.readyPromise;
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

    this.listBlock.innerHTML = htmlList;
    this.handleClickListItem();

    this.modalAddList.updateListsData(this.listsData);
  }

  private handleClickListItem() {
    const listItems: NodeListOf<HTMLElement> | null =
      this.listBlock.querySelectorAll('.list-item-js');

    listItems.forEach((item: Element) => {
      item.addEventListener('click', async (e) => {
        const targetElement = e.target as HTMLElement;
        const listId = item.getAttribute('data-id');

        const isEdit = targetElement.closest('.sidebar__lists-edit');
        if (isEdit) {
          this.modalAddList.setStatusModal('update');
          this.modalAddList.setupDataModal(
            this.listsData.find((elem) => elem.id === listId)
          );
          this.modalAddList.showAddModal();
          return;
        }

        const isDelete = targetElement.closest('.sidebar__lists-delete');
        if (isDelete) {
          this.deleteListItem(listId);
          return;
        }

        console.log('make filter');
      });
    });
  }

  private deleteListItem(listId: string) {
    set(
      ref(this.db, `${this.userId}/lists`),
      this.listsData.filter((item) => item !== null && item.id !== listId)
    );

    document.dispatchEvent(new Event('changedList'));
  }

  private renderLists(list: List): string {
    /* eslint-disable */
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
    /* eslint-enable */
  }

  public static getLists(listUserInstance): Array<List> {
    return listUserInstance.listsData;
  }

  public static getOneLists(listUserInstance: ListUser, listId: string): List {
    return (
      listUserInstance.listsData.find((item) => item.id === listId) || null
    );
  }
}

export default ListUser;
