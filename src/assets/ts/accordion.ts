export default () => {
  const accordionBlock = document.querySelectorAll('.accordion-js');
  accordionBlock.forEach((item) => {
    const accordionToggler = item.querySelector('.accordion-toggler-js');
    const accordionContent = item.querySelector('.accordion-content-js');

    accordionToggler.addEventListener('click', () => {
      if (item.classList.contains('hide')) {
        item.classList.remove('hide');
      } else {
        item.classList.add('hide');
      }
    });
  });
};
