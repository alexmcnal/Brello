import { Controller } from "@hotwired/stimulus";

export default class extends Controller {

  static targets = ["form", "status"];

  connect() {
    const Sortable = window.Draggable.Sortable;

    this.sortable = new Sortable(
      this.element.querySelectorAll(".card-container"), // use board__column as containers
      {
        draggable: ".card", // draggable cards inside columns
        mirror: {
          constrainDimensions: true
        }
      }
    );

    this.sortable.on('mirror:create', (event) => {
      // event.mirror.classList.add('card--mirror'); // style mirror
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

    this.sortable.on('sortable:stop', (event) => {
      const { newContainer, newIndex, oldContainer, oldIndex } = event;

      if (newContainer === oldContainer && newIndex === oldIndex) {
        return;
      }

      if (this.hasFormTarget) {
        const updateUrl = event.data.dragEvent.data.source.dataset.updateUrl;
        this.formTarget.action = updateUrl;
        
        // Update hidden fields for status and position
        this.statusTarget.value = newContainer.dataset.columnId;

        // Add a hidden input for position if it doesn't exist
        let positionInput = this.formTarget.querySelector('input[name="position"]');
        if (!positionInput) {
          positionInput = document.createElement('input');
          positionInput.type = 'hidden';
          positionInput.name = 'position';
          this.formTarget.appendChild(positionInput);
        }
        positionInput.value = newIndex + 1; // acts_as_list is 1-based

        // CSRF setup
        const csrfToken = document.querySelector('meta[name="csrf-token"]').content;
        let csrfInput = this.formTarget.querySelector('input[name="authenticity_token"]');
        if (!csrfInput) {
          csrfInput = document.createElement('input');
          csrfInput.type = 'hidden';
          csrfInput.name = 'authenticity_token';
          this.formTarget.appendChild(csrfInput);
        }
        csrfInput.value = csrfToken;

        this.formTarget.submit();
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
