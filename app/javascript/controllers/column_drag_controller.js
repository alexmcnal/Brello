import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static classes = ["draggable", "dragging", "handle"];

  connect() {
    const Sortable = window.Draggable.Sortable;

    // Target all .board containers
    const boards = this.element.querySelectorAll(".board");

    this.columnSortable = new Sortable(boards, {
      draggable: ".board__column",
      handle: ".drag-icon",
      mirror: { constrainDimensions: true },
    });

    this.columnSortable.on("drag:start", (event) => {
      event.source.classList.add(this.draggingClass || "board__column--dragging");
    });

    this.columnSortable.on("drag:stop", (event) => {
      event.source.classList.remove(this.draggingClass || "board__column--dragging");
    });

    this.columnSortable.on("sortable:stop", this.handleColumnStop.bind(this));
  }

  disconnect() {
    this.columnSortable?.destroy();
  }

  findForm() {
    const formId = this.element.dataset.dragFormId;
    if (!formId) return null;
    return document.getElementById(formId);
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
