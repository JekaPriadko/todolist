import {
  getFirestore,
  collection,
  query,
  onSnapshot,
} from 'firebase/firestore';
import firebase from '../../firebase';

import { setParamToUrl, getParamforUrl } from '../../utils/updateUrl';
import { List } from '../../entity/list';

import { filterInfo, filterMapForCount } from '../../const/filter';

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
  private readonly filterBtnClass: string;

  private readonly pageTitle: HTMLElement;

  private listsData: Array<List>;

  constructor(listsData: Array<List>) {
    this.listsData = listsData;
    this.filterBtnClass = '.make-filter-js';
    this.pageTitle = document.querySelector('.main-title-js');
  }

  public init() {
    this.addEventListeners();
  }

  public updateListsData(listsData: Array<List>) {
    this.listsData = listsData;
    this.setupActiveFilterFromUrl();
  }

  public static getActiveFilter(): FilterData {
    return {
      filter: (getParamforUrl('filter') as PossibleFilterStatus) || 'inbox',
      listId: getParamforUrl('listId'),
    };
  }

  public resetAllFilter() {
    setParamToUrl({ filter: 'inbox' });
    this.setFilteredData({ filter: 'inbox' });
  }

  private addEventListeners() {
    document.addEventListener('click', (e) => {
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
    });
  }

  public static listenChangesCounFilter(user: string) {
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

  private setupActiveFilterFromUrl() {
    const filter = {
      filter: (getParamforUrl('filter') as PossibleFilterStatus) || 'inbox',
      listId: getParamforUrl('listId'),
    };

    this.setFilteredData(filter);
  }

  private setActiveFilterBtn(btn: HTMLElement) {
    btn.classList.add('active');
  }

  private clearAllActiveFilterBtn() {
    const filterBtn = Array.from(
      document.querySelectorAll(this.filterBtnClass)
    ) as Array<HTMLElement>;

    filterBtn.forEach((item: Element) => {
      item.classList.remove('active');
    });
  }

  private setFilteredData(fiter: FilterData) {
    const typeFilter = fiter.filter;
    this.clearAllActiveFilterBtn();

    let newTitle: string;
    let inboxFilterBtn: HTMLElement;

    if (typeFilter !== 'listId') {
      newTitle = filterInfo[typeFilter].title;
      inboxFilterBtn = document.querySelector(
        `.make-filter-js[data-filter="${typeFilter}"]`
      ) as HTMLElement;
    } else {
      const { listId } = fiter;
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
