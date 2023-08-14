import EventEmitter from '../../EventEmitter';

import HTMLTasksUser from './HTMLTasksUser';
import DataTasksUser from './DataTasksUser';

import ListUser from '../list/ListUser';

import { Task, Priority } from '../../../entity/task';

import { FilterTask, FilterData } from '../filter/FilterTask';

import {
  setParamToUrl,
  getParamforUrl,
  deleteParamFromUrl,
} from '../../../utils/updateUrl';

class TasksUser extends EventEmitter {
  private readonly userId: string | null;

  private filter: FilterData;

  private readonly dataTask: DataTasksUser;

  private readonly tasksList: HTMLElement | null;

  private taskItems: NodeListOf<HTMLElement> | null;

  private listHandler: ListUser;

  private taskDetails: HTMLElement | null;

  private taskDetailsWrap: HTMLElement | null;

  private formCreateTask: HTMLElement | null;

  private formDetailsTask: HTMLElement | null;

  constructor(userId: string, listHandler: ListUser) {
    super();

    this.userId = userId;

    this.listHandler = listHandler;

    this.dataTask = new DataTasksUser(this.userId);

    this.tasksList = document.getElementById('tasks-list-js');
    this.formCreateTask = document.getElementById('create-task-js');
    this.taskDetailsWrap = document.getElementById('details-wrap-js');
    this.taskDetails = document.getElementById('details');
  }

  public async run() {
    await this.renderTasksList();
    this.handleRouteChange();
    this.addEventListeners();

    FilterTask.listenChangesCountFilter(this.userId);
  }

  private addEventListeners() {
    this.formCreateTask.addEventListener('submit', (e) => this.createTask(e));

    document.addEventListener('changedFilter', async () => {
      await this.renderTasksList();
      this.handleRouteChange();
    });
  }

  public async renderTasksList() {
    this.filter = FilterTask.getActiveFilterFromUrl();

    const allItems = await this.dataTask.getAllItems(this.filter);
    if (allItems.length <= 0) {
      this.tasksList.innerHTML = HTMLTasksUser.getEmptyHtmlBlockTask();
      return;
    }

    const htmlListTasks = allItems
      .map((task) =>
        HTMLTasksUser.getHtmlListTask(
          task,
          ListUser.getOneLists(this.listHandler, task.list)
        )
      )
      .join('');

    this.tasksList.innerHTML = HTMLTasksUser.getHtmlBlockTask(htmlListTasks);

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
            this.emit('changedTask');
          }
          await this.renderTasksList();
        } else {
          const taskItem = targetElement.closest('.task-item-js');
          if (taskItem.classList.contains('active')) return;

          this.clearActiveTasks();
          setParamToUrl({ taskId: itemId });

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

  public handleRouteChange() {
    const itemId = getParamforUrl('taskId');
    const oneItem: Task = this.dataTask.getOneItem(itemId);

    if (!oneItem) {
      deleteParamFromUrl('taskId');
    }

    this.setActiveClassForTask();

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

  private setActiveClassForTask() {
    const itemId = getParamforUrl('taskId');
    const taskItem = document.querySelector(
      `.task-item-js[data-id="${itemId}"]`
    );
    if (taskItem) {
      taskItem.classList.add('active');
    }
  }

  private async updateTask(e: SubmitEvent, oneItem: Task): Promise<void> {
    e.preventDefault();
    const newOneItem = this.extractFormData(
      e.target as HTMLFormElement,
      oneItem
    );

    const resUpdate = await this.dataTask.updateItem(newOneItem);

    if (resUpdate) {
      this.performTasksUpdate();
    }
  }

  private async createTask(e: SubmitEvent): Promise<void> {
    e.preventDefault();
    const newOneItem = this.extractFormData(e.target as HTMLFormElement);

    const addedItems = await this.dataTask.createItem(newOneItem);

    if (addedItems) {
      this.performTasksAdd(e.target as HTMLFormElement);
    }
  }

  private extractFormData(target: HTMLFormElement, oneItem?: Task): Task {
    const formData = new FormData(target);

    const dueDateValue = formData.get('due-date') as string;
    const dueDate = dueDateValue ? new Date(dueDateValue) : null;

    return {
      ...oneItem,
      createdAt: oneItem ? oneItem.createdAt : new Date(),
      title: formData.get('title') as string,
      description: (formData.get('description') as string) || '',
      completed: formData.get('completed') === 'on',
      trash: false,
      list: (formData.get('move-list') as string) || null,
      priority: Number(formData.get('priority')) as Priority,
      dueDate,
    };
  }

  private async performTasksUpdate() {
    deleteParamFromUrl('taskId');
    await this.renderTasksList();
    this.handleRouteChange();
    this.emit('changedTask');
  }

  private async performTasksAdd(form: HTMLFormElement) {
    form.reset();
    await this.renderTasksList();
    document.dispatchEvent(new Event('resetMainForm'));
    this.emit('changedTask');
  }
}

export default TasksUser;
