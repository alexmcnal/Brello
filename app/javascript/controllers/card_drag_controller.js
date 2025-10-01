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
        draggable: this.draggableClass, // .card
        handle: this.handleClass,       // .card or drag handle
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

  // --- Handlers ---
  handleCardStop(event) {
    const { newContainer, newIndex, oldContainer, oldIndex } = event;
    if (newContainer === oldContainer && newIndex === oldIndex) return;

    const form = document.getElementById("cards-form");
    if (!form) return;

    const source = event.dragEvent.source;
    const updateUrl = source.dataset.updateUrl;

    form.action = updateUrl;

    // Column ID
    let statusInput = form.querySelector('input[name="card[column_id]"]');
    if (!statusInput) {
      statusInput = document.createElement("input");
      statusInput.type = "hidden";
      statusInput.name = "card[column_id]";
      form.appendChild(statusInput);
    }
    statusInput.value = newContainer.dataset.columnId;

    // Position
    let positionInput = form.querySelector('input[name="card[position]"]');
    if (!positionInput) {
      positionInput = document.createElement("input");
      positionInput.type = "hidden";
      positionInput.name = "card[position]";
      form.appendChild(positionInput);
    }
    positionInput.value = newIndex + 1;

    this.addCsrfToken(form);
    form.submit();
  }

  // --- Shared helpers ---
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

  addCsrfToken(form) {
    const csrfToken = document.querySelector('meta[name="csrf-token"]').content;
    let csrfInput = form.querySelector('input[name="authenticity_token"]');
    if (!csrfInput) {
      csrfInput = document.createElement("input");
      csrfInput.type = "hidden";
      csrfInput.name = "authenticity_token";
      form.appendChild(csrfInput);
    }
    csrfInput.value = csrfToken;
  }
}
