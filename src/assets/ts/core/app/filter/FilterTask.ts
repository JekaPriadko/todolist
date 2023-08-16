import {
  getFirestore,
  collection,
  query,
  onSnapshot,
} from 'firebase/firestore';
import firebase from '../../../firebase';

import EventEmitter from '../../EventEmitter';

import { setParamToUrl, getParamforUrl } from '../../../utils/updateUrl';
import { filterInfo, filterMapForCount } from '../../../const/filter';

import { List } from '../../../entity/list';
import { PossibleFilterStatus, FilterData } from '../../../entity/filter';

const DEFAULT_FILTER = 'inbox';

class FilterTask extends EventEmitter {
  private readonly userId: string | null;

  private listsData: Array<List>;

  private filterBtnClass: string;

  private pageTitle: HTMLElement;

  public constructor(userId: string) {
    super();

    this.userId = userId;
    this.listsData = [];
    this.filterBtnClass = '.make-filter-js';
    this.pageTitle = document.querySelector('.main-title-js');
    this.initialize();
  }

  private initialize(): void {
    this.listenChangesCountFilter();
    this.setupEventListeners();
  }

  public listenChangesCountFilter(): void {
    const db = getFirestore(firebase);

    Object.keys(filterMapForCount).forEach((filterKey) => {
      const filterConditions = filterMapForCount[filterKey];
      const q = query(collection(db, this.userId), ...filterConditions);

      onSnapshot(q, (querySnapshot) => {
        this.updateFilterCount(filterKey, querySnapshot.size);
      });
    });
  }

  private updateFilterCount(filterKey: string, count: number): void {
    const filterItem = document
      .querySelector(`.make-filter-js[data-filter=${filterKey}]`)
      ?.closest('.filter-item-js')
      ?.querySelector('.filter-count-js') as HTMLElement;
    filterItem.textContent = count.toString();
  }

  private setupEventListeners(): void {
    document.addEventListener('click', (e) => this.handleFilterButtonClick(e));
  }

  public run(listsData: Array<List>): void {
    this.listsData = listsData;

    this.setupActiveFilterFromUrl();
  }

  public updateListsData(listsData: Array<List>): void {
    this.listsData = listsData;
    this.setupActiveFilterFromUrl();
  }

  public resetAllFilter(): void {
    setParamToUrl({ filter: DEFAULT_FILTER });
    this.setFilteredData({ filter: DEFAULT_FILTER });
  }

  private handleFilterButtonClick(e: Event): void {
    const targetElement = e.target as HTMLElement;
    const filterBtn = targetElement.closest(this.filterBtnClass) as HTMLElement;

    if (!filterBtn || filterBtn.classList.contains('active')) {
      return;
    }

    const statusFilter = filterBtn.getAttribute(
      'data-filter'
    ) as PossibleFilterStatus;
    const filter: FilterData = {
      filter: statusFilter,
      listId:
        statusFilter === 'listId'
          ? filterBtn.closest('.list-item-js')?.getAttribute('data-id')
          : undefined,
    };

    setParamToUrl(filter);
    this.setFilteredData(filter);
  }

  private setupActiveFilterFromUrl(): void {
    const filter = this.getFilterFromUrl();
    this.setFilteredData(filter);
  }

  public getFilterFromUrl(): FilterData {
    return {
      filter:
        (getParamforUrl('filter') as PossibleFilterStatus) || DEFAULT_FILTER,
      listId: getParamforUrl('listId'),
    };
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
    let filterBtn: HTMLElement | null;

    if (typeFilter !== 'listId') {
      newTitle = filterInfo[typeFilter].title;
      filterBtn = document.querySelector(
        `.make-filter-js[data-filter="${typeFilter}"]`
      );
    } else {
      const { listId } = filter;
      filterBtn = document.querySelector(
        `.list-item-js[data-id="${listId}"] .make-filter-js`
      );
      newTitle = this.listsData.find((item) => item.id === listId)?.title || '';
    }

    if (!filterBtn) {
      setParamToUrl({ filter: DEFAULT_FILTER });
      this.setFilteredData({ filter: DEFAULT_FILTER });
      return;
    }

    filterBtn.classList.add('active');
    this.pageTitle.textContent = newTitle;
    this.emit('changedFilter', this.getFilterFromUrl());
  }
}
export default FilterTask;
