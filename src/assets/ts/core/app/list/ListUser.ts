import {
  getDatabase,
  ref,
  onValue,
  Database,
  set,
  get,
  child,
} from 'firebase/database';

import EventEmitter from '../../EventEmitter';

import ListUserModal from './ListUserModal';
import DataTasksUser from '../tasks/DataTasksUser';

import { List } from '../../../entity/list';

import { getParamforUrl } from '../../../utils/updateUrl';

class ListUser extends EventEmitter {
  private readonly db: Database;

  private userId: string | null;

  public listsData: Array<List> = [];

  private readonly dataTask: DataTasksUser;

  private readonly modalAddList: ListUserModal;

  private readonly listBlock: HTMLElement | null;

  constructor(userId: string) {
    super();

    this.userId = userId;
    this.db = getDatabase();

    this.dataTask = new DataTasksUser(this.userId);

    this.modalAddList = new ListUserModal(this.userId, this.db, this.listsData);

    this.listBlock = document.getElementById('lists-js');
  }

  public async run() {
    const starCountRef = ref(this.db, `${this.userId}/lists`);

    await this.getOnceDataList();

    onValue(starCountRef, (snapshot) => {
      const dataFirebase = snapshot.val() || [];

      this.prepareDataList(dataFirebase);
    });
  }

  public async getOnceDataList() {
    try {
      const snapshot = await get(child(ref(this.db), `${this.userId}/lists`));
      const dataFirebase = snapshot.val() || [];
      await this.prepareDataList(dataFirebase);
    } catch (error) {
      console.error(error);
    }
  }

  private async prepareDataList(dataFirebase: List[]) {
    this.listsData = await Promise.all(
      dataFirebase.map(async (list) => ({
        ...list,
        count: await this.dataTask.getTasksByList(list.id),
      }))
    );

    const htmlList = this.listsData
      .map((list) => this.renderLists(list))
      .join('');

    this.listBlock.innerHTML = htmlList;
    this.handleClickListItem();

    this.modalAddList.updateListsData(this.listsData);
    this.emit('changedList', this.listsData);
  }

  private handleClickListItem() {
    const listItems = this.listBlock?.querySelectorAll('.list-item-js');

    listItems?.forEach((item: Element) => {
      item.addEventListener('click', async (e) => {
        const targetElement = e.target as HTMLElement;
        const listId = item.getAttribute('data-id');

        const isEdit = targetElement.closest('.sidebar__lists-edit');
        if (isEdit) {
          e.stopPropagation();
          this.editListItem(listId);
          return;
        }

        const isDelete = targetElement.closest('.sidebar__lists-delete');
        if (isDelete) {
          e.stopPropagation();
          this.deleteListItem(listId);
        }
      });
    });
  }

  private editListItem(listId: string) {
    const listToUpdate = this.listsData.find((elem) => elem.id === listId);
    if (listToUpdate) {
      this.modalAddList.setStatusModal('update');
      this.modalAddList.setupDataModal(listToUpdate);
      this.modalAddList.showAddModal();
    }
  }

  private async deleteListItem(listId: string) {
    const newListsData = this.listsData.filter(
      (item) => item !== null && item.id !== listId
    );

    try {
      await set(ref(this.db, `${this.userId}/lists`), newListsData);

      if (getParamforUrl('listId') === listId) {
        this.emit('needResetAllFilter', this.listsData);
      }

      this.emit('changedList', newListsData);
    } catch (error) {
      console.error(error);
    }
  }

  private renderLists(list: List): string {
    /* eslint-disable */
    return `<li class="sidebar__lists-item list-item-js" data-id="${list.id}" >
      <div class="sidebar__lists-button  make-filter-js ${
        list.id === getParamforUrl('listId') ? 'active' : ''
      }" data-filter="listId">
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

  public getLists(): Array<List> {
    return this.listsData;
  }
}

export default ListUser;
