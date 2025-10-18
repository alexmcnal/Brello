import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="send-event"
export default class extends Controller {

  static values = {
    url: String,
  }

  connect() {
    console.log('SendEvent controller connected')
  }

  openDrawer(e) {
    console.log("openDrawer")
    e.preventDefault()

    const openDrawerEvent = new CustomEvent("openDrawer", {
      bubbles: true,
      detail: {
        url: this.urlValue
      },
    })

    this.element.dispatchEvent(openDrawerEvent)
  }

  closeDrawer(e) {
    console.log("closeDrawer")
    e.preventDefault()

    const closeDrawerEvent = new CustomEvent("closeDrawer", {
      bubbles: true,
      detail: {
        name: "close drawer",
      },
    })

    this.element.dispatchEvent(closeDrawerEvent)
  }
}
