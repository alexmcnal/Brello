// CardMoveController for managing card move operations
//
// Usage:
//   <div data-controller="board--card-move">
//     <!-- content -->
//   </div>

import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = [ 'columnIdInput', 'positionInput' ]

  connect() {
    this.handleMoveCard = this.handleMoveCard.bind(this)
    document.addEventListener('moveCard', this.handleMoveCard)
  }

  disconnect() {
    document.removeEventListener('moveCard', this.handleMoveCard)
  }

  handleMoveCard(event) {
    event.stopPropagation()

    const { cardId, toColumnId, toPosition } = event.detail

    this.columnIdInputTarget.value = toColumnId
    this.positionInputTarget.value = toPosition
    this.element.action = `/cards/${cardId}`

    Turbo.navigator.submitForm(this.element)
  }
}
