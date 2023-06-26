import './assets/styles/index.scss';

import AuthUser from './assets/ts/auth';
import accordion from './assets/ts/accordion';
import DraggerLayout from './assets/ts/dragger';
import Sidebar from './assets/ts/sidebar';

document.addEventListener('DOMContentLoaded', (event) => {
  new AuthUser();
  accordion();
  new Sidebar();
  new DraggerLayout();
});
