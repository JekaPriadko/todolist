import {
  getFirestore,
  collection,
  query,
  onSnapshot,
} from 'firebase/firestore';
import firebase from '../../../firebase';

import { List } from '../../../entity/list';
import { setParamToUrl, getParamforUrl } from '../../../utils/updateUrl';
import { filterInfo, filterMapForCount } from '../../../const/filter';

type PossibleFilterStatus =
  | 'inbox'
  | 'today'
  | 'tomorrow'
  | 'week'
  | 'completed'
  | 'trash'
  | 'listId';

export type FilterData = {
  filter: PossibleFilterStatus;
  listId?: string;
};

export class FilterTask {
  private static instance: FilterTask;

  private listsData: Array<List>;

  private filterBtnClass: string;

  private pageTitle: HTMLElement;

  public constructor(listsData: Array<List>) {
    this.listsData = listsData;
    this.filterBtnClass = '.make-filter-js';
    this.pageTitle = document.querySelector('.main-title-js');
  }

  public static getInstance(listsData: Array<List>): FilterTask {
    if (!FilterTask.instance) {
      FilterTask.instance = new FilterTask(listsData);
    }
    return FilterTask.instance;
  }

  public init(): void {
    this.setupActiveFilterFromUrl();
    this.addEventListeners();
  }

  public updateListsData(listsData: Array<List>): void {
    this.listsData = listsData;
    this.setupActiveFilterFromUrl();
  }

  public resetAllFilter(): void {
    setParamToUrl({ filter: 'inbox' });
    this.setFilteredData({ filter: 'inbox' });
  }

  private addEventListeners(): void {
    document.addEventListener('click', this.handleFilterButtonClick.bind(this));
  }

  private handleFilterButtonClick(e: Event): void {
    const targetElement = e.target as HTMLElement;

    if (targetElement.closest(this.filterBtnClass)) {
      const filterBtn = targetElement.closest(
        this.filterBtnClass
      ) as HTMLElement;

      if (filterBtn.classList.contains('active')) return;

      this.clearAllActiveFilterBtn();
      this.setActiveFilterBtn(filterBtn);

      const statusFilter = filterBtn.getAttribute(
        'data-filter'
      ) as PossibleFilterStatus;

      const filter: FilterData = {
        filter: statusFilter,
      };

      if (statusFilter === 'listId') {
        const listId = filterBtn
          .closest('.list-item-js')
          .getAttribute('data-id');
        if (listId) {
          filter.listId = listId;
        }
      }

      setParamToUrl(filter);
      this.setFilteredData(filter);
    }
  }

  public static listenChangesCountFilter(user: string): void {
    const db = getFirestore(firebase);

    Object.keys(filterMapForCount).forEach((filterKey) => {
      const filterConditions = filterMapForCount[filterKey];
      const q = query(collection(db, user), ...filterConditions);

      onSnapshot(q, (querySnapshot) => {
        const filterItem = document
          .querySelector(`.make-filter-js[data-filter=${filterKey}]`)
          .closest('.filter-item-js')
          .querySelector('.filter-count-js') as HTMLElement;
        filterItem.textContent = querySnapshot.size.toString();
      });
    });
  }

  private setupActiveFilterFromUrl(): void {
    const filter = FilterTask.getActiveFilterFromUrl();
    this.setFilteredData(filter);
  }

  public static getActiveFilterFromUrl(): FilterData {
    return {
      filter: (getParamforUrl('filter') as PossibleFilterStatus) || 'inbox',
      listId: getParamforUrl('listId'),
    };
  }

  private setActiveFilterBtn(btn: HTMLElement): void {
    btn.classList.add('active');
  }

  private clearAllActiveFilterBtn(): void {
    const filterBtn = Array.from(
      document.querySelectorAll(this.filterBtnClass)
    ) as Array<HTMLElement>;

    filterBtn.forEach((item: Element) => {
      item.classList.remove('active');
    });
  }

  private setFilteredData(filter: FilterData): void {
    const typeFilter = filter.filter;
    this.clearAllActiveFilterBtn();

    let newTitle: string;
    let inboxFilterBtn: HTMLElement;

    if (typeFilter !== 'listId') {
      newTitle = filterInfo[typeFilter].title;
      inboxFilterBtn = document.querySelector(
        `.make-filter-js[data-filter="${typeFilter}"]`
      ) as HTMLElement;
    } else {
      const { listId } = filter;
      inboxFilterBtn = document.querySelector(
        `.list-item-js[data-id="${listId}"] .make-filter-js`
      ) as HTMLElement;
      newTitle = this.listsData.find((item) => item.id === listId)?.title;
    }

    if (!inboxFilterBtn) {
      setParamToUrl({ filter: 'inbox' });
      this.setFilteredData({ filter: 'inbox' });
      return;
    }

    this.setActiveFilterBtn(inboxFilterBtn);
    this.pageTitle.textContent = newTitle;

    document.dispatchEvent(new Event('changedFilter'));
  }
}
