import './assets/styles/index.scss';

import AuthUser from './assets/ts/core/auth';
import TasksUser from './assets/ts/core/tasks/TasksUser';
import ListUser from './assets/ts/core/list/ListUser';

import ListHandler from './assets/ts/components/task/List';
import PriorityHandler from './assets/ts/components/task/Priority';
import DueDate from './assets/ts/components/task/DueDate';

import Sidebar from './assets/ts/components/sidebar';
import DraggerLayout from './assets/ts/components/dragger';
import closePreloader from './assets/ts/components/loader';

document.addEventListener('DOMContentLoaded', async () => {
  const userHandler = new AuthUser();
  await userHandler.isReadyUser();

  if (userHandler.isAuth()) {
    const listHandler = new ListUser(userHandler.getUser().uid);
    await listHandler.run();

    const tasksHandler = new TasksUser(userHandler.getUser().uid, listHandler);
    await tasksHandler.run();

    // eslint-disable-next-line
    new Sidebar();
    // eslint-disable-next-line
    new DraggerLayout();

    new ListHandler(listHandler).run();
    new PriorityHandler().run();
    new DueDate().run();
  }

  closePreloader();
});
