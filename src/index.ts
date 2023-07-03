import './assets/styles/index.scss';

import AuthUser from './assets/ts/auth';
import accordion from './assets/ts/components/accordion';
import DraggerLayout from './assets/ts/components/dragger';
import Sidebar from './assets/ts/components/sidebar';

document.addEventListener('DOMContentLoaded', (event) => {
  new AuthUser();
  accordion();
  new Sidebar();
  new DraggerLayout();
});
