import './assets/styles/index.scss';

import preloader from './assets/ts/loader';
import accordion from './assets/ts/accordion';
import DraggerLayout from './assets/ts/dragger';
import Sidebar from './assets/ts/sidebar';

document.addEventListener('DOMContentLoaded', (event) => {
  preloader();
  accordion();
  new DraggerLayout();
  new Sidebar();
});
