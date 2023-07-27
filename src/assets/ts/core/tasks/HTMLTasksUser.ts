import { Task } from './interface/task';
/* eslint-disable */
class HTMLTasksUser {
  public static getHtmlBlockTask(
    title: string,
    count: number,
    htmlListTasks: string
  ): string {
    return `<div class="main__tasks-block accordion-js">
      <div class="main__tasks-header accordion-toggler-js">
        <button class="button button--icon button--sm-icon main__tasks-toggler">
          <svg class="icon button__icon button__prepend-icon" aria-hidden="true">
            <use xlink:href="/src/assets/images/sprite.svg#thin-triangle-down"></use>
          </svg>
        </button>
        <span class="main__tasks-title">${title}</span>
        <div class="divider divider--vertical"></div>
        <span class="main__tasks-count">${count}</span>
      </div>
      <div class="main__tasks-list accordion-content-js">
        ${htmlListTasks}
      </div>
    </div>`;
  }

  public static getHtmlListTask(task: Task): string {
    return `<div class="main__tasks-item task-item-js" data-id="${task.id}">
        ${this.renderCheckbox(
          task.completed,
          'main__tasks-checkbox checkbox-task-js'
        )}

      <span class="main__tasks-name">${task.title}</span>

      <button type="button" class="delete button button--icon button--big-icon main__tasks-delete delete-task-js ${
        task.trash ? 'trash' : ''
      }">
        <svg class="icon button__icon delete__main delete__item button__prepend-icon" aria-hidden="true">
          <use xlink:href="/src/assets/images/sprite.svg#delete"></use>
        </svg>
        <svg class="icon button__icon delete__item delete__restore button__prepend-icon" aria-hidden="true">
          <use xlink:href="/src/assets/images/sprite.svg#restore"></use>
        </svg>
      </button>
    </div>`;
  }

  public static getHtmlDetails(task: Task): string {
    return `<div class="details__main">
        <div class="details__header">
          <button type="button" class="button button--icon details__header-close" id="close-details-js">
            <svg class="icon button__icon button__prepend-icon" aria-hidden="true">
              <use xlink:href="/src/assets/images/sprite.svg#close"></use>
            </svg>
          </button>

          ${this.renderCheckbox(
            task.completed,
            'details__header-checkbox checkbox-details-task-js'
          )}

          <div class="divider divider--vertical"></div>
          <button type="button" class="button details__header-date">
            <svg class="icon button__icon button__prepend-icon" aria-hidden="true">
              <use xlink:href="/src/assets/images/sprite.svg#date-unselected"></use>
            </svg>
            <span class="button__text">Due Date</span>
          </button>
          <div class="priority details__header-priority">
            <svg class="icon priority__icon" aria-hidden="true">
              <use xlink:href="/src/assets/images/sprite.svg#priority-0"></use>
            </svg>
          </div>
        </div>
        <div class="details__content">
          <input class="details__content-title" value="${
            task.title
          }" placeholder="What needs dooing?" />
          <textarea name="details" class="details__content-input" placeholder="Description"></textarea>
        </div>
        <div class="details__footer">
          <button type="button" class="button details__footer-list">
            <svg class="icon button__icon button__prepend-icon" aria-hidden="true">
              <use xlink:href="/src/assets/images/sprite.svg#move-list"></use>
            </svg>
            <span class="button__text">Inbox</span>
          </button>
          <button type="button" class="button button--save">
            <span class="button__text">Save</span>
          </button>
        </div>
      </div>`;
  }

  public static getHtmlEmptyDetails(): string {
    return `<div class="details__empty">
          <div class="details__empty-img">
            <svg>
              <use xlink:href="/src/assets/images/sprite.svg#dark-empty-task-detail"></use>
            </svg>
            <svg>
              <use xlink:href="/src/assets/images/sprite.svg#empty-task-detail-pointer"></use>
            </svg>
          </div>
          <span class="details__empty-title">Click task title to view the detail</span>
        </div>`;
  }

  private static renderCheckbox(
    status: boolean,
    additionalClass: string
  ): string {
    return ` <button type="button" class="checkbox ${
      status ? 'completed' : ''
    } ${additionalClass}">
    <svg class="icon checkbox__item checkbox__main" aria-hidden="true">
      <use xlink:href="/src/assets/images/sprite.svg#checkbox"></use>
    </svg>
    <svg class="icon checkbox__item checkbox__completed" aria-hidden="true">
      <use xlink:href="/src/assets/images/sprite.svg#completed-detail"></use>
    </svg>
  </button>`;
  }
}

export default HTMLTasksUser;
