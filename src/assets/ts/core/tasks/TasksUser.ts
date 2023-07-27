import HTMLTasksUser from './HTMLTasksUser';
import DataTasksUser from './DataTasksUser';
import { Task } from './interface/task';

class TasksUser {
  // eslint-disable-next-line
  private readyResolver: any;

  private readyPromise: Promise<void>;

  private userId: string | null;

  private dataTask: DataTasksUser;

  private tasksList: HTMLElement | null;

  private taskItems: NodeListOf<HTMLElement> | null;

  private taskDetails: HTMLElement | null;

  private taskDetailsWrap: HTMLElement | null;

  private formCreateTask: HTMLElement | null;

  constructor(userId) {
    this.userId = userId;

    this.dataTask = new DataTasksUser(this.userId);

    this.tasksList = document.getElementById('tasks-list-js');
    this.formCreateTask = document.getElementById('create-task-js');
    this.taskDetailsWrap = document.getElementById('details-wrap-js');
    this.taskDetails = document.getElementById('details');
  }

  public async run() {
    this.readyPromise = new Promise((resolve) => {
      this.readyResolver = resolve;
    });
    // ================================================================

    await this.renderTasksList();
    this.handleRouteChange();

    this.formCreateTask.addEventListener('submit', (e) => this.createTask(e));

    // ================================================================
    this.readyResolver();
  }

  public isReadyTasks() {
    return this.readyPromise;
  }

  public async renderTasksList() {
    const allItems = await this.dataTask.getAllItems();

    const htmlListTasks = allItems
      .map((task) => HTMLTasksUser.getHtmlListTask(task))
      .join('');

    this.tasksList.innerHTML = HTMLTasksUser.getHtmlBlockTask(
      'Inbox',
      this.dataTask.getCountAllItems(),
      htmlListTasks
    );

    this.handleClickTask();
  }

  private handleClickTask() {
    this.taskItems = document.querySelectorAll('.task-item-js');

    this.taskItems.forEach((item: Element) => {
      item.addEventListener('click', async (e) => {
        const targetElement = e.target as HTMLElement;

        const itemId = item.getAttribute('data-id');
        const isButton = targetElement.closest('button');

        if (isButton) {
          const oneItem: Task = this.dataTask.getOneItem(itemId);

          const isCheckbox = isButton.classList.contains('checkbox-task-js');
          const isDelete = isButton.classList.contains('delete-task-js');

          if (isCheckbox) {
            const newOneItem: Task = {
              ...oneItem,
              completed: !oneItem.completed,
            };

            await this.dataTask.updateItem(newOneItem);
          }

          if (isDelete) {
            const newOneItem: Task = {
              ...oneItem,
              trash: !oneItem.trash,
            };
            await this.dataTask.updateItem(newOneItem);
          }
          await this.renderTasksList();
        } else {
          this.clearActiveTasks();
          item.classList.add('active');

          const newPath = `?taskId=${itemId}`;

          window.history.pushState(null, '', newPath);
          this.taskDetails.classList.add('active');
        }

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
    const itemId = urlParams.get('taskId');
    const oneItem: Task = this.dataTask.getOneItem(itemId);

    this.taskDetailsWrap.innerHTML = oneItem
      ? HTMLTasksUser.getHtmlDetails(oneItem)
      : HTMLTasksUser.getHtmlEmptyDetails();

    this.handleDetailsClick(oneItem);
  }

  private handleDetailsClick(oneItem: Task): void {
    const checkboxDetails = document.querySelector('.checkbox-details-task-js');
    if (checkboxDetails) {
      checkboxDetails.addEventListener('click', async () => {
        const newOneItem: Task = {
          ...oneItem,
          completed: !oneItem.completed,
        };

        await this.dataTask.updateItem(newOneItem);
        await this.renderTasksList();
        this.handleRouteChange();
      });
    }

    const closeDetails = document.getElementById('close-details-js');
    if (closeDetails) {
      closeDetails.addEventListener('click', async () => {
        this.clearActiveTasks();
        this.taskDetails.classList.remove('active');
      });

      window.addEventListener('resize', () => {
        this.clearActiveTasks();
        this.taskDetails.classList.remove('active');
      });
    }
  }

  private async createTask(e: SubmitEvent): Promise<void> {
    e.preventDefault();
    const target = e.target as HTMLFormElement;
    const title = target.querySelector(
      '.create-task-title-js'
    ) as HTMLInputElement;

    const addedItems = await this.dataTask.createItem({
      createdAt: new Date(),
      title: title.value,
      description: null,
      completed: null,
      trash: null,
      list: null,
      dueDate: null,
      priority: 'none',
    });

    if (addedItems) {
      title.value = '';
      this.renderTasksList();
    }
  }
}

export default TasksUser;
