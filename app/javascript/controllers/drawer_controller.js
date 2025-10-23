import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="drawer"
export default class extends Controller {

  static targets = [ 'content' ]
  static classes = [ 'open']

  contentTargetConnected() {
    this.handleOpenDrawer = this.handleOpenDrawer.bind(this)
    this.handleCloseDrawer = this.handleCloseDrawer.bind(this)
    this.handleEscape = this.handleEscape.bind(this)

    document.addEventListener('openDrawer', this.handleOpenDrawer)
    document.addEventListener('closeDrawer', this.handleCloseDrawer)
    document.addEventListener('keydown', this.handleEscape)
  }

  contentTargetDisconnected() {
    document.removeEventListener('openDrawer', this.handleOpenDrawer)
    document.removeEventListener('closeDrawer', this.handleCloseDrawer)
    document.removeEventListener('keydown', this.handleEscape)
  }

  handleOpenDrawer(event) {
    this.element.classList.add(this.openClass)
    this.contentTarget.src = event.detail.url
  }

  handleCloseDrawer() {
    this.element.classList.remove(this.openClass)
  }

  handleEscape(event) {
    if (event.key === "Escape") {
      this.closeDrawer()
    }
  }
}
