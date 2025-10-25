// Dialog helper functions for managing dialog state across the application
// 
// Usage:
//   import { openDialog, closeDialog } from "helpers/dialog_helper"
//   
//   // Open a dialog with content from a URL
//   openDialog('/path/to/content')
//   
//   // Close the currently open dialog
//   closeDialog()
//
// These functions dispatch custom events that are handled by the dialog_controller
// to manage the dialog's open/closed state and content loading.

export function openDialog(url) {
  const openDialogEvent = new CustomEvent("openDialog", {
    bubbles: true,
    detail: {
      url: url
    },
  })

  document.dispatchEvent(openDialogEvent)
}

export function closeDialog() {
  const closeDialogEvent = new CustomEvent("closeDialog", {
    bubbles: true,
    detail: {
      name: "close dialog",
    },
  })

  document.dispatchEvent(closeDialogEvent)
}
