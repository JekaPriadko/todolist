import EventEmitter from '../../EventEmitter';

import HTMLTasksUser from './HTMLTasksUser';
import DataTasksUser from './DataTasksUser';

import { Task, Priority } from '../../../entity/task';
import { List } from '../../../entity/list';
import { FilterData } from '../../../entity/filter';

import {
  setParamToUrl,
  getParamforUrl,
  deleteParamFromUrl,
} from '../../../utils/updateUrl';

class TasksUser extends EventEmitter {
  private readonly userId: string | null;

  private filter: FilterData | null;

  private list: Array<List>;

  private readonly dataTask: DataTasksUser;

  private readonly tasksList: HTMLElement | null;

  private taskItems: NodeListOf<HTMLElement> | null;

  private taskDetails: HTMLElement | null;

  private taskDetailsWrap: HTMLElement | null;

  private formCreateTask: HTMLElement | null;

  private formDetailsTask: HTMLElement | null;

  constructor(userId: string) {
    super();

    this.userId = userId;

    this.filter = null;
    this.list = null;

    this.dataTask = new DataTasksUser(this.userId);

    this.tasksList = document.getElementById('tasks-list-js');
    this.formCreateTask = document.getElementById('create-task-js');
    this.taskDetailsWrap = document.getElementById('details-wrap-js');
    this.taskDetails = document.getElementById('details');

    this.addEventListeners();
  }

  public async run(filter: FilterData, list: Array<List>) {
    this.filter = filter;
    this.list = list;

    await this.renderTasksList();
    this.handleRouteChange();
  }

  public async updateFilter(filter: FilterData): Promise<void> {
    this.filter = filter;
    await this.renderTasksList();
    this.handleRouteChange();
  }

  public async updateListsData(list: Array<List>): Promise<void> {
    this.list = list;
    await this.renderTasksList();
    this.handleRouteChange();
  }

  private addEventListeners() {
    this.formCreateTask.addEventListener('submit', (e) => this.createTask(e));
  }

  public async renderTasksList() {
    const allItems = await this.dataTask.getAllItems(this.filter);

    if (allItems.length <= 0) {
      this.tasksList.innerHTML = HTMLTasksUser.getEmptyHtmlBlockTask();
      return;
    }

    const htmlListTasks = allItems
      .map((task) =>
        HTMLTasksUser.getHtmlListTask(
          task,
          this.list.find((item) => item.id === task.list) || null
        )
      )
      .join('');

    this.tasksList.innerHTML = HTMLTasksUser.getHtmlBlockTask(htmlListTasks);

    this.handleClickTask();
  }

  handleClickTask() {
    this.taskItems = document.querySelectorAll('.task-item-js');

    this.taskItems.forEach((item) => {
      item.addEventListener('click', (e) => this.handleTaskClick(e));
    });
  }

  async handleTaskClick(e: Event) {
    const targetElement = e.target as HTMLElement;
    const item = targetElement.closest('.task-item-js');
    const itemId = item.getAttribute('data-id');
    const isActionButton = targetElement.closest(
      '.action-btn-js'
    ) as HTMLElement;

    if (isActionButton) {
      await this.handleActionButtonClick(itemId, isActionButton);
    } else {
      await this.handleTaskItemClick(itemId);
    }

    this.handleRouteChange();
  }

  async handleActionButtonClick(itemId: string, targetElement: HTMLElement) {
    const oneItem = this.dataTask.getOneItem(itemId);
    const isCheckbox = targetElement.classList.contains('checkbox-task-js');
    const isDelete = targetElement.classList.contains('delete-task-js');

    if (isCheckbox) {
      const newOneItem = {
        ...oneItem,
        completed: !oneItem.completed,
      };
      await this.dataTask.updateItem(newOneItem);
    }

    if (isDelete) {
      const newOneItem = {
        ...oneItem,
        trash: !oneItem.trash,
      };
      await this.dataTask.updateItem(newOneItem);
      this.emit('changedTask');
    }

    await this.renderTasksList();
  }

  async handleTaskItemClick(itemId: string) {
    const taskItem = document.querySelector(
      `.task-item-js[data-id="${itemId}"]`
    );
    if (taskItem.classList.contains('active')) return;

    this.clearActiveTasks();
    setParamToUrl({ taskId: itemId });

    this.taskDetails.classList.add('active');
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
    const detailsHtml = oneItem
      ? HTMLTasksUser.getHtmlDetails(
          oneItem,
          this.list.find((item) => item.id === oneItem.list) || null
        )
      : HTMLTasksUser.getHtmlEmptyDetails();

    this.taskDetailsWrap.innerHTML = detailsHtml;
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
