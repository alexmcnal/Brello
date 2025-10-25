import { Controller } from "@hotwired/stimulus";

const draggableSelector = ".board__column";
const handleSelector = ".drag-icon";
const draggingClass = "board__column--dragging";

export default class extends Controller {

  connect() {
    const Sortable = window.Draggable.Sortable;

    // Target all .board containers
    const boards = this.element.querySelectorAll(".board");

    // Use controller-wide constants

    this.columnSortable = new Sortable(boards, {
      draggable: draggableSelector,
      handle: handleSelector,
      mirror: { constrainDimensions: true },
    });

    this.columnSortable.on("drag:start", (event) => {
      event.source.classList.add(draggingClass);
    });

    this.columnSortable.on("drag:stop", (event) => {
      event.source.classList.remove(draggingClass);
    });

    this.columnSortable.on("sortable:stop", this.handleColumnStop.bind(this));
  }

  disconnect() {
    this.columnSortable?.destroy();
  }

  findForm() {
    return document.getElementById('columns-form');
  }

  addCsrfToken(headers) {
    const csrfToken = document.querySelector('meta[name="csrf-token"]').content;
    headers["X-CSRF-Token"] = csrfToken;
  }

  async handleColumnStop(event) {
    const { newIndex, oldIndex, newContainer, oldContainer } = event;
    if (newContainer === oldContainer && newIndex === oldIndex) return;

    const form = this.findForm();
    if (!form) return;

    const source = event.dragEvent.source;
    const columnId = source.dataset.boardColumnId;

    const projectId = this.element.dataset.projectId;
    const boardId = this.element.dataset.boardId;

    const updateUrl = `/projects/${projectId}/boards/${boardId}/board_columns/${columnId}`;

    // Build FormData from the hidden form
    const formData = new FormData(form);

    // Ensure position is set
    formData.set("board_column[position]", newIndex + 1);

    // Fire AJAX request instead of form.submit()
    const headers = {};
    this.addCsrfToken(headers);

    try {
      await fetch(updateUrl, {
        method: "PATCH",
        headers,
        body: formData,
      });
      // No redirect, Rails just responds with head :ok
    } catch (error) {
      console.error("Column update failed", error);
    }
  }
}
