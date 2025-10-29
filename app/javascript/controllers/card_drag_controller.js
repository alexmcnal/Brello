// CardDragController for managing card drag and drop behavior
//
// Usage:
//   <div data-controller="card-drag">
//     <!-- card content -->
//   </div>

import { Controller } from "@hotwired/stimulus";
import { moveCard } from "helpers/card_helper";

const dropTargetSelector = ".card-container";
const draggableSelector = ".card";
const handleSelector = ".card";
const draggingClassName = "card--dragging";
const dropIndicatorClassName = "drop-indicator";

export default class extends Controller {
  static targets = [ 'column' ];


  connect() {
    this.connectSortable();
  }

  columnTargetConnected() {
    this.disconnectSortable();
    this.connectSortable();
  }

  connectSortable() {
    const Sortable = window.Draggable.Sortable;

    this.draggingClassName = draggingClassName;
    this.dropIndicatorClassName = dropIndicatorClassName;

    this.cardSortable = new Sortable(
      this.element.querySelectorAll(dropTargetSelector),
      {
        draggable: draggableSelector,
        handle: handleSelector,
        mirror: { constrainDimensions: true },
      }
    );

    this.cardSortable.on("drag:start", (event) => {
      event.source.classList.add(this.draggingClassName);
    });

    this.cardSortable.on("drag:stop", (event) => {
      event.source.classList.remove(this.draggingClassName);
      this.removeInsertionIndicators();
    });

    this.cardSortable.on("sortable:sort", this.showInsertionIndicator.bind(this));
    this.cardSortable.on("sortable:stop", this.handleCardStop.bind(this));
  }

  disconnectSortable() {
    this.cardSortable?.destroy();
  }

  // This is where the magic happens! When a card drag operation completes,
  // we extract the relevant data and call cardMoved() to keep the save logic
  // completely decoupled from the drag implementation. 
  async handleCardStop(event) {
    const { newContainer, newIndex, oldContainer, oldIndex, dragEvent } = event;
    const source = dragEvent.source;
    if (newContainer === oldContainer && newIndex === oldIndex) return;

    const toColumnId = newContainer.dataset.columnId;
    const toPosition = newIndex + 1;
    const cardId = source.dataset.cardId;

    moveCard(cardId, toColumnId, toPosition)
  }

  showInsertionIndicator(event) {
    this.removeInsertionIndicators();
    const indicator = document.createElement("div");
    indicator.classList.add(this.dropIndicatorClassName);

    const sibling = event.over;
    const parent = sibling?.parentNode;
    if (sibling && parent && parent.contains(sibling)) {
      parent.insertBefore(indicator, sibling);
    }
  }

  removeInsertionIndicators() {
    document.querySelectorAll(`.${this.dropIndicatorClassName}`).forEach((el) => el.remove());
  }
}
