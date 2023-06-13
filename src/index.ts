import './assets/styles/index.scss';

// interface User {
//   name: string;
//   id: number;
// }

// const user: User = {
//   name: 'Hayes',
//   id: 0,
// };

const mainPreloader = document.getElementById('main-preloader');
const root = document.getElementById('root');
setTimeout(() => {
  mainPreloader.classList.add('hide');
  root.style.display = 'flex';
}, 1000);
