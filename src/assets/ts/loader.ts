export default () => {
  const mainPreloader = document.getElementById('main-preloader');
  const root = document.getElementById('root');
  setTimeout(() => {
    mainPreloader.classList.add('hide');
    root.style.display = 'flex';
  }, 1000);
};
