import AuthUser from './auth/AuthUser';

import ListUser from './app/list/ListUser';
import FilterTask from './app/filter/FilterTask';
import TasksUser from './app/tasks/TasksUser';

import ListHandler from '../components/task/List';
import PriorityHandler from '../components/task/Priority';
import DueDate from '../components/task/DueDate';

class TaskManager {
  private readonly userHandler: AuthUser;

  private readonly listUser: ListUser;

  private readonly filterTask: FilterTask;

  private readonly tasksUser: TasksUser;

  private readonly listComponent: ListHandler;

  private readonly priorityComponent: PriorityHandler;

  private readonly DateComponent: DueDate;

  constructor(userHandler: AuthUser) {
    this.userHandler = userHandler;
    const userId = this.userHandler.getUser().uid;

    this.listUser = new ListUser(userId);
    this.filterTask = new FilterTask(userId);
    this.tasksUser = new TasksUser(userId);

    this.listComponent = new ListHandler();
    this.priorityComponent = new PriorityHandler();
    this.DateComponent = new DueDate();
  }

  async initialize() {
    await this.listUser.run();
    const userList = this.listUser.getLists();

    this.filterTask.run(userList);

    await this.tasksUser.run(this.filterTask.getFilterFromUrl(), userList);

    this.listComponent.run();
    this.priorityComponent.run();
    this.DateComponent.run();

    // ================================================
    this.listUser.subscribe('changedList', async (listsData) => {
      this.listComponent.updateListData(listsData);
      this.filterTask.updateListsData(listsData);
      await this.tasksUser.updateListsData(listsData);
    });

    this.listUser.subscribe('needResetAllFilter', async () => {
      this.filterTask.resetAllFilter();
    });

    // eslint-disable-next-line
    this.filterTask.subscribe('changedFilter', async (newFilter) => {
      await this.tasksUser.updateFilter(newFilter);
    });

    this.tasksUser.subscribe('changedTask', () => {
      this.listUser.getOnceDataList();
    });
  }
}

export default TaskManager;
