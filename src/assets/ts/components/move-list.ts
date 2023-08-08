import ListUser from '../core/list/ListUser';
import { List } from '../entity/list';

function hideAllMoveList() {
  const moveList = document.querySelectorAll('.move-list-js');
  moveList.forEach((item) => {
    item.classList.remove('active');
  });
}

function setMoveList(moveList: HTMLElement, activeList: List | null) {
  const moveListInput = moveList.querySelector(
    '.move-list-input-js'
  ) as HTMLInputElement;
  moveListInput.value = activeList?.id || null;

  const moveListBtn = moveList.querySelector(
    '.move-list-show-js'
  ) as HTMLInputElement;
  moveListBtn.style.color = activeList?.color || null;

  const moveListTite = moveList.querySelector(
    '.move-list-title-js'
  ) as HTMLInputElement;

  if (moveListTite) {
    moveListTite.textContent = activeList?.title || 'Inbox';
  }

  hideAllMoveList();
}

function renderItem(list: List): string {
  return `<button
    type='button'
    class='move-list__item move-list-btn-js'
    data-list='${list.id}'>
      ${list.title}
    </button>`;
}

function renderLists(listWrap: HTMLElement, listsData: Array<List>) {
  const inboxItem = renderItem({ id: null, title: 'Inbox', color: null });
  const otherListItems = listsData.map((list) => renderItem(list)).join('');

  const htmlList = inboxItem + otherListItems;
  listWrap.innerHTML = htmlList; // eslint-disable-line
}

export default (listHandler: ListUser) => {
  document.addEventListener('click', (e) => {
    const targetElement = e.target as HTMLElement;

    if (targetElement.closest('.move-list-js')) {
      const moveList = targetElement.closest('.move-list-js') as HTMLElement;
      const listWrap = moveList.querySelector(
        '.move-list__lists-js'
      ) as HTMLElement;

      const listData = ListUser.getLists(listHandler);
      renderLists(listWrap, listData);

      hideAllMoveList();
      moveList.classList.add('active');

      if (targetElement.closest('.move-list-btn-js')) {
        const listId = targetElement
          .closest('.move-list-btn-js')
          .getAttribute('data-list');
        const newValue = listData.find((item) => item.id === listId) || null;
        setMoveList(moveList, newValue);
      }
    } else {
      hideAllMoveList();
    }
  });

  document.addEventListener('resetMainForm', () => {
    const moveListMainForm = document.querySelector(
      '#create-task-js .move-list-js'
    ) as HTMLElement;
    setMoveList(moveListMainForm, null);
  });
};
