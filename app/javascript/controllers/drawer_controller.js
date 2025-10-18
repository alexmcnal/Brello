import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="drawer"
export default class extends Controller {

  static targets = [ 'message' ]

  connect() {
    console.log('Draw controller connected')
    document.addEventListener('openDrawer', this.openDrawer.bind(this))
  }

  openDrawer() {
    console.log("Drawer opened")
    this.messageTarget.innerHTML = 'TESTING'
  }
}
