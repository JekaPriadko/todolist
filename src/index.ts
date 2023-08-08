import './assets/styles/index.scss';

import AuthUser from './assets/ts/core/auth';
import TasksUser from './assets/ts/core/tasks/TasksUser';
import ListUser from './assets/ts/core/list/ListUser';

import ListHandler from './assets/ts/components/task/List';
import PriorityHandler from './assets/ts/components/task/Priority';

import accordion from './assets/ts/components/accordion';
import Sidebar from './assets/ts/components/sidebar';
import DraggerLayout from './assets/ts/components/dragger';
import closePreloader from './assets/ts/components/loader';

document.addEventListener('DOMContentLoaded', async () => {
  const userHandler = new AuthUser();
  await userHandler.isReadyUser();

  if (userHandler.isAuth()) {
    const listHandler = new ListUser(userHandler.getUser().uid);
    listHandler.run();
    await listHandler.isReadyList();

    const tasksHandler = new TasksUser(userHandler.getUser().uid, listHandler);
    tasksHandler.run();
    await tasksHandler.isReadyTasks();

    accordion();
    // eslint-disable-next-line
    new Sidebar();
    // eslint-disable-next-line
    new DraggerLayout();

    new ListHandler(listHandler).run();
    new PriorityHandler().run();
  }

  closePreloader();
});
