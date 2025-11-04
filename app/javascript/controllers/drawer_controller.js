// Drawer controller for managing slide-out drawer UI component
//
// Usage:
//   <div data-controller="drawer" data-drawer-open-class="drawer--open">
//     <div data-drawer-target="content"></div>
//   </div>
//
//   <!-- Trigger drawer open with a link -->
//   <a href="/path/to/content" data-action="click->drawer#open">Open Drawer</a>
//
//   <!-- Close drawer -->
//   <button data-action="click->drawer#close">Close</button>
//
// The controller listens for custom 'openDrawer' and 'closeDrawer' events
// dispatched by the drawer helper functions. It manages the drawer's open/closed
// state via CSS classes and loads content via Turbo frames.
//
// Keyboard support: ESC key closes the drawer when open.

import { Controller } from "@hotwired/stimulus"
import { openDrawer, closeDrawer } from "helpers/drawer_helper"

export default class extends Controller {

  static targets = [ 'content' ]
  static classes = [ 'open']

  open(e) {
    e.preventDefault()
    openDrawer(e.target.href)
  }

  close() {
    closeDrawer()
  }

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
