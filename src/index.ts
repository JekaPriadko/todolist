import './assets/styles/index.scss';

import AuthUser from './assets/ts/core/auth/AuthUser';
import TaskManager from './assets/ts/core/TaskManager';

import SidebarHandler from './assets/ts/components/SidebarHandler';
import DraggerHandler from './assets/ts/components/DraggerHandler';
import { hidePreloader, showPreloader } from './assets/ts/components/preloader';

async function runApp(userHandler: AuthUser): Promise<void> {
  showPreloader();

  if (userHandler.isAuth()) {
    const app = new TaskManager(userHandler);
    await app.initialize();

    new SidebarHandler().run();
    new DraggerHandler().run();
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
