// Dialog controller for managing modal dialog UI component
//
// Usage:
//   <dialog data-controller="dialog" data-dialog-open-class="dialog--open">
//     <div data-dialog-target="content"></div>
//   </dialog>
//
//   <!-- Trigger dialog open with a link -->
//   <a href="/path/to/content" data-action="click->dialog#open">Open Dialog</a>
//
//   <!-- Close dialog -->
//   <button data-action="click->dialog#close">Close</button>
//
// The controller listens for custom 'openDialog' and 'closeDialog' events
// dispatched by the dialog helper functions. It manages the dialog's open/closed
// state via CSS classes and loads content via Turbo frames.
//
// Keyboard support: ESC key closes the dialog when open.

import { Controller } from "@hotwired/stimulus"
import { openDialog, closeDialog } from "helpers/dialog_helper"

export default class extends Controller {

  static targets = [ 'content' ]
  static classes = [ 'open']

  open(e) {
    e.preventDefault()
    openDialog(this.element.href)
  }

  close() {
    closeDialog()
  }

  contentTargetConnected() {
    console.log("dialogcontentTargetConnected")
    this.handleOpenDialog = this.handleOpenDialog.bind(this)
    this.handleCloseDialog = this.handleCloseDialog.bind(this)
    this.handleEscape = this.handleEscape.bind(this)

    document.addEventListener('openDialog', this.handleOpenDialog)
    document.addEventListener('closeDialog', this.handleCloseDialog)
    document.addEventListener('keydown', this.handleEscape)
  }

  contentTargetDisconnected() {
    document.removeEventListener('openDialog', this.handleOpenDialog)
    document.removeEventListener('closeDialog', this.handleCloseDialog)
    document.removeEventListener('keydown', this.handleEscape)
  }

  handleOpenDialog(event) {
    // this.element.openDialog
    // Read the mdn dialog page and it will tell you what function to call to open the dialog
    console.log('handle open dialog')
    
    requestAnimationFrame(() => { 
      this.contentTarget.src = event.detail.url
    })
    this.element.showModal()
  }

  handleCloseDialog() {
    this.element.close()
  }

  handleEscape(event) {
    if (event.key === "Escape") {
      this.close()
    }
  }
}
