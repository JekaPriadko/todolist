import './assets/styles/index.scss';

import AuthUser from './assets/ts/core/auth/AuthUser';
import TasksUser from './assets/ts/core/tasks/TasksUser';
import ListUser from './assets/ts/core/list/ListUser';

import ListHandler from './assets/ts/components/task/List';
import PriorityHandler from './assets/ts/components/task/Priority';
import DueDate from './assets/ts/components/task/DueDate';

import SidebarHandler from './assets/ts/components/SidebarHandler';
import DraggerHandler from './assets/ts/components/DraggerHandler';
import { hidePreloader, showPreloader } from './assets/ts/components/preloader';

async function runApp(userHandler: AuthUser): Promise<void> {
  showPreloader();
  if (userHandler.isAuth()) {
    const listHandler = new ListUser(userHandler.getUser().uid);
    await listHandler.run();

    const tasksHandler = new TasksUser(userHandler.getUser().uid, listHandler);
    await tasksHandler.run();

    new SidebarHandler().run();
    new DraggerHandler().run();

    new ListHandler(listHandler).run();
    new PriorityHandler().run();
    new DueDate().run();
  }
  hidePreloader();
}

document.addEventListener('DOMContentLoaded', async () => {
  const userHandler = new AuthUser();
  await userHandler.isReadyUser();

  await runApp(userHandler);

  document.addEventListener('changeAuthState', async () => {
    await runApp(userHandler);
  });
});
