import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  connect() {
    const Sortable = window.Draggable.Sortable;

    this.sortable = new Sortable(
      this.element.querySelectorAll(".card-container"),
      {
        draggable: ".card",
        mirror: {
          constrainDimensions: true,
        },
        // This is key: allows cross-container dragging
        appendTo: "body",
        swapAnimation: {
          duration: 150,
          easingFunction: 'ease-in-out',
        }
      }
    );
  }

  disconnect() {
    if (this.sortable) {
      this.sortable.destroy();
    }
  }
}
