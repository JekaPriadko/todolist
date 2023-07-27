import './assets/styles/index.scss';

import { getDatabase, ref, child, get } from 'firebase/database';

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

const dbRef = ref(getDatabase());
get(child(dbRef, '/Test'))
  .then((snapshot) => {
    if (snapshot.exists()) {
      console.log(snapshot.val());
    } else {
      console.log('No data available');
    }
  })
  .catch((error) => {
    console.error(error);
  });
