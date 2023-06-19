import './assets/styles/index.scss';

import removeMainPreloader from './assets/ts/loader';
import DraggerLayout from './assets/ts/dragger';
import Sidebar from './assets/ts/sidebar';

document.addEventListener('DOMContentLoaded', (event) => {
  removeMainPreloader();
  new DraggerLayout();
  new Sidebar();
});
