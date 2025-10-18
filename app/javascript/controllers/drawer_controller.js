import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="drawer"
export default class extends Controller {

  static targets = [ 'content' ]
  static classes = [ 'open']

  connect() {
    document.addEventListener('openDrawer', this.openDrawer.bind(this))
    document.addEventListener('closeDrawer', this.closeDrawer.bind(this))
    document.addEventListener('keydown', this.handleEscape.bind(this))
  }

  openDrawer(event) {
    this.element.classList.add(this.openClass)
    this.contentTarget.src = event.detail.url
  }

  closeDrawer() {
    this.element.classList.remove(this.openClass)
  }

  handleEscape(event) {
    if (event.key === "Escape") {
      this.closeDrawer()
    }
  }
}
