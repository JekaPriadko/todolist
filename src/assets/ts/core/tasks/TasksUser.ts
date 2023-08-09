import HTMLTasksUser from './HTMLTasksUser';
import DataTasksUser from './DataTasksUser';
import ListUser from '../list/ListUser';

import { Task, Priority } from '../../entity/task';

class TasksUser {
  // eslint-disable-next-line
  private readyResolver: any;

  private readyPromise: Promise<void>;

  private userId: string | null;

  private dataTask: DataTasksUser;

  private tasksList: HTMLElement | null;

  private taskItems: NodeListOf<HTMLElement> | null;

  private listHandler: ListUser;

  private taskDetails: HTMLElement | null;

  private taskDetailsWrap: HTMLElement | null;

  private formCreateTask: HTMLElement | null;

  private formDetailsTask: HTMLElement | null;

  constructor(userId, listHandler: ListUser) {
    this.userId = userId;

    this.listHandler = listHandler;

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

    // ================================================================
    this.readyResolver();
    // ================================================================
    this.formCreateTask.addEventListener('submit', (e) => this.createTask(e));

    document.addEventListener('changedList', async () => {
      await this.renderTasksList();
      this.handleRouteChange();
    });
  }

  public isReadyTasks() {
    return this.readyPromise;
  }

  public async renderTasksList() {
    const allItems = await this.dataTask.getAllItems();

    const htmlListTasks = allItems
      .map((task) =>
        HTMLTasksUser.getHtmlListTask(
          task,
          ListUser.getOneLists(this.listHandler, task.list)
        )
      )
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
        const isActionButton = targetElement.closest('.action-btn-js');
        if (isActionButton) {
          const oneItem: Task = this.dataTask.getOneItem(itemId);

          const isCheckbox =
            isActionButton.classList.contains('checkbox-task-js');
          const isDelete = isActionButton.classList.contains('delete-task-js');

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
            document.dispatchEvent(new Event('changedTask'));
          }
          await this.renderTasksList();
        } else {
          this.clearActiveTasks();

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

  private setActiveTask() {
    const itemId = this.getItemIdFromUrl();
    const taskItem = document.querySelector(
      `.task-item-js[data-id="${itemId}"]`
    );
    if (taskItem) {
      taskItem.classList.add('active');
    }
  }

  private getItemIdFromUrl(): string | null {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    return urlParams.get('taskId') || null;
  }

  private handleRouteChange() {
    const itemId = this.getItemIdFromUrl();
    const oneItem: Task = this.dataTask.getOneItem(itemId);
    this.setActiveTask();

    /* eslint-disable */
    this.taskDetailsWrap.innerHTML = oneItem
      ? HTMLTasksUser.getHtmlDetails(
          oneItem,
          ListUser.getOneLists(this.listHandler, oneItem.list)
        )
      : HTMLTasksUser.getHtmlEmptyDetails();
    /* eslint-enable */

    this.handleDetailsClick();
    this.formDetailsTask = document.getElementById('details-form-js');
    if (this.formDetailsTask) {
      this.formDetailsTask.addEventListener('submit', (e) =>
        this.updateTask(e, oneItem)
      );
    }
  }

  private handleDetailsClick(): void {
    const checkboxDetails = document.querySelector('.checkbox-details-task-js');
    if (checkboxDetails) {
      checkboxDetails.addEventListener('click', async () => {
        checkboxDetails.classList.toggle('completed');
        const statusCheckbox = checkboxDetails.querySelector('input');
        statusCheckbox.checked = !statusCheckbox.checked;
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
  /* eslint-disable */
  private async updateTask(e: SubmitEvent, oneItem: Task): Promise<void> {
    e.preventDefault();
    const target = e.target as HTMLFormElement;
    const formData = new FormData(target);

    const dueDateValue = formData.get('due-date') as string;
    const dueDate = dueDateValue ? new Date(dueDateValue) : null;

    const newOneItem: Task = {
      ...oneItem,
      title: formData.get('title') as string,
      description: (formData.get('description') as string) || '',
      priority: Number(formData.get('priority')) as Priority,
      completed: formData.get('completed') === 'on',
      list: (formData.get('move-list') as string) || null,
      dueDate: dueDate,
    };

    const resUpdate = await this.dataTask.updateItem(newOneItem);

    if (resUpdate) {
      const currentUrl = window.location.href;
      const urlWithoutParams = currentUrl.split('?')[0];
      window.history.replaceState({}, document.title, urlWithoutParams);
      await this.renderTasksList();
      this.handleRouteChange();

      document.dispatchEvent(new Event('changedTask'));
    }
  }

  private async createTask(e: SubmitEvent): Promise<void> {
    e.preventDefault();
    const target = e.target as HTMLFormElement;
    const formData = new FormData(target);

    const dueDateValue = formData.get('due-date') as string
    const dueDate = dueDateValue ? new Date(dueDateValue) : null;

    const newOneItem: Task = {
      createdAt: new Date(),
      title: formData.get('title') as string,
      description: null,
      completed: false,
      trash: false,
      list: (formData.get('move-list') as string) || null,
      dueDate: dueDate,
      priority: Number(formData.get('priority')) as Priority,
    };

    const addedItems = await this.dataTask.createItem(newOneItem);

    if (addedItems) {
      target.reset();
      this.renderTasksList();
      document.dispatchEvent(new Event('resetMainForm'));
      document.dispatchEvent(new Event('changedTask'));
    }
  }
}

export default TasksUser;
