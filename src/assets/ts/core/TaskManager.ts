import AuthUser from './auth/AuthUser';

import TasksUser from './app/tasks/TasksUser';
import ListUser from './app/list/ListUser';

import ListHandler from '../components/task/List';
import PriorityHandler from '../components/task/Priority';
import DueDate from '../components/task/DueDate';

class TaskManager {
  private readonly userHandler: AuthUser;

  private readonly tasksUser: TasksUser;

  private readonly listUser: ListUser;

  constructor(userHandler: AuthUser) {
    this.userHandler = userHandler;

    this.listUser = new ListUser(this.userHandler.getUser().uid);
    this.tasksUser = new TasksUser(
      this.userHandler.getUser().uid,
      this.listUser
    );
  }

  async initialize() {
    await this.listUser.run();
    await this.tasksUser.run();

    new ListHandler(this.listUser).run();
    new PriorityHandler().run();
    new DueDate().run();

    // ================================================

    this.listUser.subscribe('changedList', async () => {
      await this.tasksUser.renderTasksList();
      this.tasksUser.handleRouteChange();
    });

    this.tasksUser.subscribe('changedTask', () => {
      this.listUser.getOnceDataList();
    });
  }
}

export default TaskManager;
