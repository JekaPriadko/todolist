function hideAllPriorityBlocks() {
  const priorityBlocks = document.querySelectorAll('.priority-js');
  priorityBlocks.forEach((item) => {
    item.classList.remove('active');
  });
}

function setPriority(priorityBlock: HTMLElement, newValue: string) {
  const priorityInput = priorityBlock.querySelector(
    '.priority-input-js'
  ) as HTMLInputElement;
  priorityInput.value = newValue;

  const priorityShowBtnSvg = priorityBlock.querySelector(
    '.priority-show-js use'
  );

  priorityShowBtnSvg.setAttribute(
    'xlink:href',
    `/src/assets/images/sprite.svg#priority-${newValue}`
  );

  hideAllPriorityBlocks();
}

export default () => {
  document.addEventListener('click', (e) => {
    const targetElement = e.target as HTMLElement;

    if (targetElement.closest('.priority-js')) {
      hideAllPriorityBlocks();
      targetElement.closest('.priority-js').classList.add('active');

      if (targetElement.closest('.priority-btn-js')) {
        const priorityBlock = targetElement.closest(
          '.priority-js'
        ) as HTMLElement;

        const newValue = targetElement
          .closest('.priority-btn-js')
          .getAttribute('data-priority');
        setPriority(priorityBlock, newValue);
      }
    } else {
      hideAllPriorityBlocks();
    }
  });

  document.addEventListener('resetPriorityMainForm', () => {
    const priorityMainForm = document.querySelector(
      '#create-task-js .priority-js'
    ) as HTMLElement;
    setPriority(priorityMainForm, '0');
  });
};
