import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="send-event"
export default class extends Controller {
  connect() {
    console.log('SendEvent controller connected')
  }

  openDrawer(e) {
      console.log("openDrawer")
      e.preventDefault()

      const openDrawerEvent = new CustomEvent("openDrawer", {
        bubbles: true,
        detail: {
          name: "open drawer",
        },
      })

      this.element.dispatchEvent(openDrawerEvent)
  }
}

// const element = document.createElement("div");

// element.addEventListener("drawerinteraction", (e)=> console.log(e.detail.name));

// element.dispatchEvent(openDrawer)