import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  connect() {
    this.handleCardUpdated = this.handleCardUpdated.bind(this)
    
    document.addEventListener('cardUpdated', this.handleCardUpdated)
  }

  disconnect() {
    document.removeEventListener('cardUpdated', this.handleCardUpdated)
  }

  handleCardUpdated(event) {
    const { dom_id, card } = event.detail
    const columnId = parseInt(this.element.dataset.columnId);

    if (card.column_id === columnId) {
      const turboFrame = this.element.closest('turbo-frame');
      if (turboFrame) {
        turboFrame.reload();
      }
    } else {
      const cardElement = this.element.querySelector(`#${dom_id}`);
      if (cardElement) {
        cardElement.remove();
      }
    }
  }
}
