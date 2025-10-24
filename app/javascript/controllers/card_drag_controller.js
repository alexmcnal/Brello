import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static classes = [
    "dropTarget",
    "draggable",
    "dragging",
    "dropIndicator",
    "handle",
  ];

  connect() {
    const Sortable = window.Draggable.Sortable;

    this.cardSortable = new Sortable(
      this.element.querySelectorAll(this.dropTargetClass), // .card-container
      {
        draggable: this.draggableClass,
        handle: this.handleClass,
        mirror: { constrainDimensions: true },
      }
    );

    this.cardSortable.on("drag:start", (event) => {
      event.source.classList.add(this.draggingClass);
    });

    this.cardSortable.on("drag:stop", (event) => {
      event.source.classList.remove(this.draggingClass);
      this.removeInsertionIndicators();
    });

    this.cardSortable.on("sortable:sort", this.showInsertionIndicator.bind(this));
    this.cardSortable.on("sortable:stop", this.handleCardStop.bind(this));
  }

  disconnect() {
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
    indicator.classList.add(this.dropIndicatorClass);

    const sibling = event.over;
    const parent = sibling?.parentNode;
    if (sibling && parent && parent.contains(sibling)) {
      parent.insertBefore(indicator, sibling);
    }
  }

  removeInsertionIndicators() {
    document.querySelectorAll(`.${this.dropIndicatorClass}`).forEach((el) => el.remove());
  }
}
