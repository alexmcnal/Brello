// Board controller for managing board behaviour
//
// Usage:
//   <div data-controller="board">
//     <!-- board content -->
//   </div>

import { Controller } from "@hotwired/stimulus"
import { openDrawer } from "helpers/drawer_helper"

export default class extends Controller {


  connect() {
    this.handleOpenCard = this.handleOpenCard.bind(this)
    document.addEventListener('openCard', this.handleOpenCard)
  }

  disconnect() {
    document.removeEventListener('openCard', this.handleOpenCard)
  }

  handleOpenCard(event) {
    event.preventDefault()

    const target = event.target
    const cardId = target.closest('[data-card-id]').dataset.cardId
    const boardId = target.closest('[data-board-id]').dataset.boardId
    const projectId = target.closest('[data-project-id]').dataset.projectId

    const url = `/projects/${projectId}/boards/${boardId}/cards/${cardId}`
    openDrawer(url)
  }
}
