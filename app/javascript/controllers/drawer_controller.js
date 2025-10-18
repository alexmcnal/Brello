import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="drawer"
export default class extends Controller {

  static targets = [ 'message' ]
  static classes = [ 'open']

  connect() {
    document.addEventListener('openDrawer', this.openDrawer.bind(this))
    document.addEventListener('closeDrawer', this.closeDrawer.bind(this))
  }

  openDrawer() {
    this.element.classList.add(this.openClass)
  }

  closeDrawer() {
    this.element.classList.remove(this.openClass)
  }
}
