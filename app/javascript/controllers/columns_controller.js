// app/javascript/controllers/columns_controller.js
import { Controller } from "@hotwired/stimulus";
import { Sortable } from "@shopify/draggable";

export default class extends Controller {
  static targets = ["column"];

  connect() {
    this.sortable = new Sortable(this.element, {
      draggable: ".board__column",
      handle: "[data-drag-handle]",
      mirror: { constrainDimensions: true }
    });

    this.sortable.on("sortable:stop", () => {
      this.updateColumnPositions();
    });
  }

  disconnect() {
    if (this.sortable) {
      this.sortable.destroy();
    }
  }

  updateColumnPositions() {
    this.columnTargets.forEach((col, index) => {
      const id = col.dataset.boardColumnId;
      const newPosition = index + 1; // acts_as_list is 1-based

      fetch(`/board_columns/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": document.querySelector('meta[name="csrf-token"]').content
        },
        body: JSON.stringify({
          board_column: { position: newPosition }
        })
      })
      .then((response) => {
        if (!response.ok) throw new Error(`Failed to update column ${id}`);
      })
      .catch((error) => {
        console.error(error);
      });
    });
  }
}
