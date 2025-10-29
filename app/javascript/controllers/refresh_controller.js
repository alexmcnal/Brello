import { Controller } from "@hotwired/stimulus"

export default class extends Controller {

  static values = {
    cacheKey: String,
    fingerprint: String
  }

  connect() {
    this.handleObjectUpdated = this.handleObjectUpdated.bind(this)
    document.addEventListener('objectUpdated', this.handleObjectUpdated)
  }

  disconnect() {
    document.removeEventListener('objectUpdated', this.handleObjectUpdated)
  }

  handleObjectUpdated(event) {
    const { cache_key } = event.detail

    if (this.cacheKeyValue === cache_key) {
      this.element.reload()
    }
  }
}

Turbo.StreamActions.object_updated = function () {
  const cache_key = this.getAttribute("cache_key")
  const fingerprint = this.getAttribute("fingerprint")

  const objectUpdatedEvent = new CustomEvent("objectUpdated", {
    bubbles: false,
    detail: {
      cache_key: cache_key,
      fingerprint: fingerprint
    }
  })
  document.dispatchEvent(objectUpdatedEvent)
}