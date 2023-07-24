import HTMLTasksUser from './HTMLTasksUser';
import DataTasksUser from './DataTasksUser';

class TasksUser {
  // eslint-disable-next-line
  private readyResolver: any;

  private readyPromise: Promise<void>;

  private userId: string | null;

  private dataTask: DataTasksUser;

  private tasksList: HTMLElement | null;

  private taskItems: NodeListOf<HTMLElement> | null;

  private taskDetails: HTMLElement | null;

  private formCreateTask: HTMLElement | null;

  constructor(userId) {
    this.userId = userId;

    this.dataTask = new DataTasksUser(this.userId);

    this.tasksList = document.getElementById('tasks-list-js');
    this.formCreateTask = document.getElementById('create-task-js');
    this.taskDetails = document.getElementById('details-content-js');
  }

  public async run() {
    this.readyPromise = new Promise((resolve) => {
      this.readyResolver = resolve;
    });
    // ================================================================

    await this.prepareContent();
    this.handleRouteChange();
    this.handleClickTask();

    this.formCreateTask.addEventListener('submit', (e) => this.createTask(e));

    // ================================================================
    this.readyResolver();
  }

  public isReadyTasks() {
    return this.readyPromise;
  }

  public async prepareContent() {
    const allItems = await this.dataTask.getAllItems();

    const htmlListTasks = allItems
      .map((task) => HTMLTasksUser.getHtmlListTask(task.id, task.title))
      .join('');

    this.tasksList.innerHTML = HTMLTasksUser.getHtmlBlockTask(
      'Inbox',
      this.dataTask.getCountAllItems(),
      htmlListTasks
    );
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
      ? HTMLTasksUser.getHtmlDetails(taskId)
      : HTMLTasksUser.getHtmlEmptyDetails();
  }

  private async createTask(e: SubmitEvent): Promise<void> {
    e.preventDefault();

    const target = e.target as HTMLFormElement;
    const title = target.querySelector(
      '.create-task-title-js'
    ) as HTMLInputElement;

    const addedItems = await this.dataTask.createItem({
      title: title.value,
      description: null,
      completed: null,
      trash: null,
      list: null,
      created: null,
      dueDate: null,
      priority: 'none',
    });

    console.log(addedItems);

    if (addedItems) {
      title.value = '';
      this.prepareContent();
    }
  }
}

export default TasksUser;
