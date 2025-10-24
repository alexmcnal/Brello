import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["modal"]

  connect() {
    this.handleEscape = this.handleEscape.bind(this)
  }

  open(event) {
    const url = event.currentTarget.dataset.sideModalUrl
    this.modalTarget.classList.remove("hidden")
    this.modalTarget.classList.add("show")

    const frame = document.getElementById("modal-frame")
    frame.src = url

    document.addEventListener("keydown", this.handleEscape)
  }

  close() {
    this.modalTarget.classList.remove("show")
    setTimeout(() => this.modalTarget.classList.add("hidden"), 300)
    document.removeEventListener("keydown", this.handleEscape)
  }

  handleEscape(event) {
    if (event.key === "Escape") {
      this.close()
    }
  }
}
