import { setParamToUrl, getParamforUrl } from '../../utils/updateUrl';
import filterInfo from '../../const/filter';
import { List } from '../../entity/list';

type PossibleFilterStatus =
  | 'inbox'
  | 'today'
  | 'tommorow'
  | 'week'
  | 'completed'
  | 'trash'
  | 'listId';

type FilterData = {
  filter: PossibleFilterStatus;
  listId?: string;
};

class FilterTask {
  private filterBtnClass: string;

  private pageTitle: HTMLElement;

  private listsData: Array<List>;

  constructor(listsData: Array<List>) {
    this.listsData = listsData;
    this.filterBtnClass = '.make-filrer-js';
    this.pageTitle = document.querySelector('.main-title-js');
  }

  public init() {
    this.addEventListeners();
    this.setupActiveFilterFromUrl();
  }

  public updateListsData(listsData: Array<List>) {
    this.listsData = listsData;
    this.setupActiveFilterFromUrl();
  }

  private addEventListeners() {
    document.addEventListener('click', (e) => {
      const targetElement = e.target as HTMLElement;

      if (targetElement.closest(this.filterBtnClass)) {
        const filterBtn = targetElement.closest(
          this.filterBtnClass
        ) as HTMLElement;
        this.clearActiveFilterBtn();
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

  private clearActiveFilterBtn() {
    const filterBtn = Array.from(
      document.querySelectorAll(this.filterBtnClass)
    ) as Array<HTMLElement>;

    filterBtn.forEach((item: Element) => {
      item.classList.remove('active');
    });
  }

  public resetAllFilter() {
    setParamToUrl({ filter: 'inbox' });
    this.setFilteredData({ filter: 'inbox' });
  }

  private setFilteredData(fiter: FilterData) {
    const typeFilter = fiter.filter;
    this.clearActiveFilterBtn();

    let newTitle: string;
    let inboxFilterBtn: HTMLElement;

    if (typeFilter !== 'listId') {
      newTitle = filterInfo[typeFilter].title;
      inboxFilterBtn = document.querySelector(
        `.make-filrer-js[data-filter="${typeFilter}"]`
      ) as HTMLElement;
    } else {
      const { listId } = fiter;
      inboxFilterBtn = document.querySelector(
        `.list-item-js[data-id="${listId}"] .make-filrer-js`
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
  }
}
export default FilterTask;
