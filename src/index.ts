import './assets/styles/index.scss';

import AuthUser from './assets/ts/core/auth';
import TasksUser from './assets/ts/core/tasks/TasksUser';

import accordion from './assets/ts/components/accordion';
import DraggerLayout from './assets/ts/components/dragger';
import Sidebar from './assets/ts/components/sidebar';
import closePreloader from './assets/ts/components/loader';

document.addEventListener('DOMContentLoaded', async () => {
  const userHandler = new AuthUser();
  await userHandler.isReadyUser();

  if (userHandler.isAuth()) {
    const tasksHandler = new TasksUser(userHandler.getUser().uid);
    tasksHandler.run();
    await tasksHandler.isReadyTasks();

    accordion();
    // eslint-disable-next-line
    new Sidebar();
    // eslint-disable-next-line
    new DraggerLayout();
  }
  closePreloader();
});
