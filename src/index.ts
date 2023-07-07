import './assets/styles/index.scss';

import AuthUser from './assets/ts/core/auth';
import TasksUser from './assets/ts/core/tasks';

import accordion from './assets/ts/components/accordion';
import DraggerLayout from './assets/ts/components/dragger';
import Sidebar from './assets/ts/components/sidebar';
import closePreloader from './assets/ts/components/loader';

document.addEventListener('DOMContentLoaded', async (event) => {

console.log(1)

  const userHandler = new AuthUser();
  await userHandler.isReadyUser();

  if (userHandler.isAuth()) {
    const tasksHandler = new TasksUser(userHandler.getUser().uid);
         await tasksHandler.isReadyTasks();

    accordion();
    new Sidebar();
    new DraggerLayout()
  }

  closePreloader();
});
