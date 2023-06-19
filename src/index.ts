import './assets/styles/index.scss';

import removeMainPreloader from './assets/ts/loader';
import DraggerLayout from './assets/ts/dragger';

document.addEventListener('DOMContentLoaded', (event) => {
  removeMainPreloader();
  new DraggerLayout();
});
