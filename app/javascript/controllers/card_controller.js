// Card controller for handling card interactions
// 
// Emits an 'openCard' custom event when a card is clicked. A parent controller
// (such as board_controller) must listen for this event to handle the actual
// card opening behavior.
//
// Usage:
//   <button data-controller="card" data-action="card#open">
//     Card Title
//   </button>

import { Controller } from "@hotwired/stimulus"

export default class extends Controller {

  open(event) {
    const target = event.currentTarget
    const cardId = target.closest('[data-card-id]').dataset.cardId

    const openCardEvent = new CustomEvent("openCard", {
      bubbles: true,
      detail: {
        cardId: cardId
      }
    })

    this.element.dispatchEvent(openCardEvent)
  }

}
