import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="drawer"
export default class extends Controller {

  static targets = [ 'content' ]
  static classes = [ 'open']

  open(e) {
    e.preventDefault()
    const openDialogEvent = new CustomEvent("openDialog", {
      bubbles: true,
      detail: {
        url: this.element.href
      },
    })

    this.element.dispatchEvent(openDialogEvent)
  }

  close() {
    const closeDialogEvent = new CustomEvent("closeDialog", {
      bubbles: true,
      detail: {
        name: "close dialog",
      },
    })

    this.element.dispatchEvent(closeDialogEvent)
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
