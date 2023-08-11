import { Task } from '../../entity/task';
import { List } from '../../entity/list';

import formatDateToYYYYMMDD from '../../utils/formatDate';

/* eslint-disable */
class HTMLTasksUser {
  public static getHtmlBlockTask(
    htmlListTasks: string
  ): string {
    return `<div class="main__tasks-block accordion-js">
        ${htmlListTasks}
    </div>`;
  }

  public static getHtmlListTask(task: Task, activeList: List): string {
    return `<div class="main__tasks-item task-item-js" data-id="${
      task.id
    }" style="border-color:${activeList?.color || 'transparent'}">

        ${this.renderCheckbox(
          task.completed,
          `main__tasks-checkbox checkbox-task-js checkbox--priority-${task.priority} action-btn-js`
        )}

      <span class="main__tasks-name">${task.title}</span>

      <button type="button" class="delete button button--icon button--big-icon main__tasks-delete delete-task-js ${
        task.trash ? 'trash' : ''
      } action-btn-js">
        <svg class="icon button__icon delete__main delete__item button__prepend-icon" aria-hidden="true">
          <use xlink:href="/src/assets/images/sprite.svg#delete"></use>
        </svg>
        <svg class="icon button__icon delete__item delete__restore button__prepend-icon" aria-hidden="true">
          <use xlink:href="/src/assets/images/sprite.svg#restore"></use>
        </svg>
      </button>
    </div>`;
  }

  public static getHtmlDetails(task: Task, activeList: List): string {
    return `<form action="#" class="details__main" id="details-form-js">
      <div class="details__header">
        <button type="button" class="button button--icon details__header-close"
          id="close-details-js" >
          <svg class="icon button__icon button__prepend-icon"
            aria-hidden="true" >
            <use xlink:href="/src/assets/images/sprite.svg#close"></use>
          </svg>
        </button>

        <!-- ================================================ -->

        ${this.renderCheckbox(
          task.completed,
          'details__header-checkbox checkbox-details-task-js'
        )}

        <div class="divider divider--vertical"></div>

        <!-- ================================================ -->

        <div class="due-date due-date-js ${task.dueDate && 'active'}">
          <input type="date" class="due-date__input due-date-input-js" name="due-date" value="${
            formatDateToYYYYMMDD(task.dueDate) || ''
          }">
          <button type="button" class="button details__header-date due-date__show due-date-show-js">
            <svg class="icon button__icon button__prepend-icon" aria-hidden="true" >
              <use xlink:href="/src/assets/images/sprite.svg#date-unselected"></use>
            </svg>
            <span class="button__text due-date-text-js"> ${
              formatDateToYYYYMMDD(task.dueDate) || 'Due Date'
            }</span>
          </button>
        </div>

        <!-- ================================================ -->

        <div class="priority details__header-priority priority-js">
          <input
            type="hidden"
            name="priority"
            value="${task.priority}"
            class="priority-input-js"
          />
          <button class="button button--icon button--big-icon priority-btn priority-show-js" type="button">
            <svg class="icon button__icon button__prepend-icon" aria-hidden="true">
              <use xlink:href="/src/assets/images/sprite.svg#priority-${
                task.priority
              }"
              ></use>
            </svg>
          </button>
          <div class="priority__list priority-list-js">
              <!-- Lists here -->
          </div>
        </div>
      </div>

      <div class="details__content">
        <input
          class="details__content-title title-details-js"
          value="${task.title}"
          name="title"
          placeholder="What needs dooing?"
          required
        />
        <textarea
          name="description"
          class="details__content-input"
          placeholder="Description"
        >${task.description || ''}</textarea>
      </div>
      <div class="details__footer">

        <div class="move-list move-list-js">
          <input type="hidden" name="move-list" class="move-list-input-js" value="${
            activeList?.id || null
          }">
          <button class="button details__footer-list move-list__btn move-list-show-js" type="button" style="color:${
            activeList?.color || null
          }">
            <svg class="icon button__icon button__prepend-icon" aria-hidden="true">
              <use xlink:href="/src/assets/images/sprite.svg#move-list"></use>
            </svg>
            <span class="button__text move-list-title-js">${
              activeList?.title || 'Inbox'
            }</span>
          </button>
          <div class="move-list__lists move-list__lists-js top left">
            <!-- Lists here -->
          </div>
        </div>

        <button type="submit" class="button button--save">
          <span class="button__text">Save</span>
        </button>
      </div>
    </form>`;
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
    return `<div class="checkbox ${status && 'completed'} ${additionalClass}">
      <input type="checkbox" name="completed" ${
        status && 'checked'
      } style="display:none">
      <button type="button" class="checkbox__btn">
        <svg class="icon checkbox__item checkbox__main" aria-hidden="true">
          <use xlink:href="/src/assets/images/sprite.svg#checkbox"></use>
        </svg>
        <svg class="icon checkbox__item checkbox__completed" aria-hidden="true">
          <use xlink:href="/src/assets/images/sprite.svg#completed-detail"></use>
        </svg>
      </button>
    </div>`;
  }
}

export default HTMLTasksUser;
