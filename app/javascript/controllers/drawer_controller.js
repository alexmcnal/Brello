import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="drawer"
export default class extends Controller {

  static targets = [ 'content' ]
  static classes = [ 'open']

  open(e) {
    console.log("Drawer Open")
    e.preventDefault()
    const openDrawerEvent = new CustomEvent("openDrawer", {
      bubbles: true,
      detail: {
        url: this.element.href
      },
    })

    this.element.dispatchEvent(openDrawerEvent)
  }

  close() {
    const closeDrawerEvent = new CustomEvent("closeDrawer", {
      bubbles: true,
      detail: {
        name: "close drawer",
      },
    })

    this.element.dispatchEvent(closeDrawerEvent)
  }

  contentTargetConnected() {
    console.log("contentTargetConnected")
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
    console.log("Handle drawer open")
    this.element.classList.add(this.openClass)
    requestAnimationFrame(() => { 
      this.contentTarget.src = event.detail.url
    })
  }

  handleCloseDrawer() {
    this.element.classList.remove(this.openClass)
  }

  handleEscape(event) {
    if (event.key === "Escape") {
      this.close()
    }
  }
}
