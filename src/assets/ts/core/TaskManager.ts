import AuthUser from './auth/AuthUser';

import ListUser from './app/list/ListUser';
// import TasksUser from './app/tasks/TasksUser';
// import FilterTask from './app/filter/FilterTask';

import ListHandler from '../components/task/List';
import PriorityHandler from '../components/task/Priority';
import DueDate from '../components/task/DueDate';

class TaskManager {
  private readonly userHandler: AuthUser;

  private readonly listUser: ListUser;

  // private readonly filterTask: FilterTask;

  // private readonly tasksUser: TasksUser;

  constructor(userHandler: AuthUser) {
    this.userHandler = userHandler;

    this.listUser = new ListUser(this.userHandler.getUser().uid);
    // this.filterTask = new FilterTask(this.userHandler.getUser().uid);
    // this.tasksUser = new TasksUser(
    //   this.userHandler.getUser().uid,
    //   this.listUser
    // );
  }

  async initialize() {
    await this.listUser.run();
    console.log(this.listUser.getOneLists('291e4c6619f'));
    // await this.filterTask.run(this.listUser.listsData);
    // await this.tasksUser.run(this.filterTask.getFilterFromUrl());

    new ListHandler(this.listUser).run();
    new PriorityHandler().run();
    new DueDate().run();

    // ================================================
    // eslint-disable-next-line
    this.listUser.subscribe('changedList', async (listsData) => {
      // this.filterTask.updateListsData(listsData);
      // await this.tasksUser.renderTasksList();
      // this.tasksUser.handleRouteChange();
    });

    this.listUser.subscribe('needResetAllFilter', async () => {
      // this.filterTask.resetAllFilter();
    });

    // this.tasksUser.subscribe('changedTask', () => {
    //   this.listUser.getOnceDataList();
    // });

    // this.filterTask.subscribe('changedFilter', async (newFilter) => {
    //   this.tasksUser.updateFilter(newFilter);
    //   await this.tasksUser.renderTasksList();
    //   this.tasksUser.handleRouteChange();
    // });
  }
}

export default TaskManager;
