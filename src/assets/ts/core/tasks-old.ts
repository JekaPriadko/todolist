import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  Firestore,
} from 'firebase/firestore';
import firebase from '../firebase';

class TasksUser {
  // eslint-disable-next-line
  private readyResolver: any;

  private readyPromise: Promise<void>;

  private db: Firestore;

  private userId: string | null;

  private formCreateTask: HTMLElement | null;

  private tasksList: HTMLElement | null;

  private taskItems: NodeListOf<HTMLElement> | null;

  private taskDetails: HTMLElement | null;

  constructor(userId) {
    this.readyPromise = new Promise((resolve) => {
      this.readyResolver = resolve;
    });
    this.userId = userId;

    this.db = getFirestore(firebase);

    this.tasksList = document.getElementById('tasks-list-js');
    this.prepareContent();

    this.formCreateTask = document.getElementById('create-task-js');
    this.formCreateTask.addEventListener('submit', (e) => this.createTask(e));

    // =================================================================
    this.taskDetails = document.getElementById('details-content-js');

    this.handleRouteChange();
    window.addEventListener('popstate', () => this.handleRouteChange);

    // =================================================================
    this.readyResolver();
  }

  public isReadyTasks() {
    return this.readyPromise;
  }

  private async prepareContent() {
    const querySnapshot = await getDocs(collection(this.db, this.userId));

    const htmlListTasks = querySnapshot.docs
      .map((task) => this.getHtmlListTasks(task.id, task.data().title))
      .join('');

    const countTasks = querySnapshot.docs.length;

    this.tasksList.innerHTML = this.getHtmlBlockTask(
      'Inbox',
      countTasks,
      htmlListTasks
    );

    this.handleClickTask();
  }

  private async createTask(e: SubmitEvent): Promise<void> {
    e.preventDefault();

    const target = e.target as HTMLFormElement;
    const title = target.querySelector(
      '.create-task-title-js'
    ) as HTMLInputElement;

    try {
      await addDoc(collection(this.db, this.userId), {
        title: title.value,
      });
      title.value = '';
      this.prepareContent();
    } catch (event) {
      console.error('Error adding task: ', event);
    }
  }

  private handleClickTask() {
    this.taskItems = document.querySelectorAll('.task-item-js');
    this.taskItems.forEach((item: Element) => {
      item.addEventListener('click', () => {
        this.clearActiveTasks();
        item.classList.add('active');

        const itemId = item.getAttribute('data-id');
        const newPath = `?taskId=${itemId}`;

        window.history.pushState(null, '', newPath);

        this.handleRouteChange();
      });
    });
  }

  private clearActiveTasks() {
    this.taskItems.forEach((item: Element) => {
      item.classList.remove('active');
    });
  }

  private handleRouteChange() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const taskId = urlParams.get('taskId');

    this.taskDetails.innerHTML = taskId
      ? this.getHtmlDetails(taskId)
      : this.getHtmlEmptyDetails();
  }

  private getHtmlBlockTask(
    title: string,
    count: number,
    htmlListTasks: string
  ): string {
    return `<div class="main__tasks-block accordion-js">
      <div class="main__tasks-header accordion-toggler-js">
        <button class="button button--icon button--sm-icon main__tasks-toggler">
          <svg class="icon button__icon button__prepend-icon" aria-hidden="true">
            <use xlink:href="/src/assets/images/sprite.svg#thin-triangle-down"></use>
          </svg>
        </button>
        <span class="main__tasks-title">${title}</span>
        <div class="divider divider--vertical"></div>
        <span class="main__tasks-count">${count}</span>
      </div>
      <div class="main__tasks-list accordion-content-js">
        ${htmlListTasks}
      </div>
    </div>`;
  }

  private getHtmlListTasks(id: string, title: string): string {
    return `<div class="main__tasks-item task-item-js" data-id="${id}">
      <div class="checkbox main__tasks-checkbox">
        <svg class="icon checkbox__item checkbox__main " aria-hidden="true">
          <use xlink:href="/src/assets/images/sprite.svg#checkbox"></use>
        </svg>
        <svg class="icon checkbox__item checkbox__completed" aria-hidden="true">
          <use xlink:href="/src/assets/images/sprite.svg#completed-detail"></use>
        </svg>
      </div>
      <span class="main__tasks-name">${title}</span>

      <button class="button button--icon button--big-icon main__tasks-delete">
        <svg class="icon button__icon button__prepend-icon" aria-hidden="true">
          <use xlink:href="/src/assets/images/sprite.svg#delete"></use>
        </svg>
      </button>
    </div>`;
  }

  private getHtmlDetails(content: string): string {
    return `<div class="details__main">
        <div class="details__header">
          <div class="checkbox details__header-checkbox">
            <svg class="icon checkbox__item checkbox__main" aria-hidden="true">
              <use xlink:href="/src/assets/images/sprite.svg#checkbox"></use>
            </svg>
            <svg class="icon checkbox__item checkbox__completed" aria-hidden="true">
              <use xlink:href="/src/assets/images/sprite.svg#completed-detail"></use>
            </svg>
          </div>
          <div class="divider divider--vertical"></div>
          <button type="button" class="button details__header-date">
            <svg class="icon button__icon button__prepend-icon" aria-hidden="true">
              <use xlink:href="/src/assets/images/sprite.svg#date-unselected"></use>
            </svg>
            <span class="button__text">Due Date</span>
          </button>
          <div class="priority details__header-priority">
            <svg class="icon priority__icon" aria-hidden="true">
              <use xlink:href="/src/assets/images/sprite.svg#priority-0"></use>
            </svg>
          </div>
        </div>
        <div class="details__content">
          <input class="details__content-title" value="${content}" placeholder="What needs dooing?" />
          <textarea name="details" class="details__content-input" placeholder="Description"></textarea>
        </div>
        <div class="details__footer">
          <button type="button" class="button details__footer-list">
            <svg class="icon button__icon button__prepend-icon" aria-hidden="true">
              <use xlink:href="/src/assets/images/sprite.svg#move-list"></use>
            </svg>
            <span class="button__text">Inbox</span>
          </button>
          <button type="button" class="button button--save">
            <span class="button__text">Save</span>
          </button>
        </div>
      </div>`;
  }

  private getHtmlEmptyDetails(): string {
    return `<div class="details__empty">
          <div class="details__empty-img">
            <svg>
              <use xlink:href="/src/assets/images/sprite.svg#dark-empty-task-detail"></use>
            </svg>
            <svg>
              <use xlink:href="/src/assets/images/sprite.svg#empty-task-detail-pointer"></use>
            </svg>
          </div>
          <span class="details__empty-title">Click task title to view the detail</span>
        </div>`;
  }
}

export default TasksUser;
