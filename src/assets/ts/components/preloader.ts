const mainPreloader = document.getElementById('main-preloader');
const root = document.getElementById('root');

export const hidePreloader = () => {
  mainPreloader.classList.add('hide');
  root.style.display = 'flex';
};

export const showPreloader = () => {
  mainPreloader.classList.remove('hide');
  root.style.display = 'none';
};
