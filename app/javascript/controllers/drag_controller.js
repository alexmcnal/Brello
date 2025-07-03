import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  connect() {
    const Sortable = window.Draggable.Sortable;

    this.sortable = new Sortable(
      this.element.querySelectorAll(".board__column"), // use board__column as containers
      {
        draggable: ".card", // draggable cards inside columns
        mirror: {
          constrainDimensions: true
        }
      }
    );

    this.sortable.on('mirror:create', (event) => {
      event.mirror.classList.add('card--mirror'); // style mirror
    });

    this.sortable.on('drag:start', (event) => {
      event.source.classList.add('card--dragging'); // style original dragged card
    });

    this.sortable.on('drag:stop', (event) => {
      event.source.classList.remove('card--dragging');
      this.removeInsertionIndicators();
    });

    this.sortable.on('sortable:sort', (event) => {
      this.removeInsertionIndicators();

      const indicator = document.createElement('div');
      indicator.classList.add('drop-indicator');

      const sibling = event.over;
      const parent = sibling?.parentNode;

      if (sibling && parent) {
        parent.insertBefore(indicator, sibling);
      }
    });
  }

  disconnect() {
    if (this.sortable) {
      this.sortable.destroy();
    }
  }

  removeInsertionIndicators() {
    document.querySelectorAll('.drop-indicator').forEach(el => el.remove());
  }
}
