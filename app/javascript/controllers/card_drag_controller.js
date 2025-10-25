import { Controller } from "@hotwired/stimulus";

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

  async handleCardStop(event) {
    const { newContainer, newIndex, oldContainer, oldIndex } = event;
    if (newContainer === oldContainer && newIndex === oldIndex) return;

    const source = event.dragEvent.source;
    const updateUrl = source.dataset.updateUrl;

    const csrfToken = document.querySelector('meta[name="csrf-token"]').content;

    const body = new URLSearchParams();
    body.append("card[column_id]", newContainer.dataset.columnId);
    body.append("card[position]", newIndex + 1);

    await fetch(updateUrl, {
      method: "PATCH",
      headers: {
        "X-CSRF-Token": csrfToken,
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      },
      body: body.toString(),
    });
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
