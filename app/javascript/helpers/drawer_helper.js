// Drawer helper functions for managing drawer state across the application
// 
// Usage:
//   import { openDrawer, closeDrawer } from "helpers/drawer_helper"
//   
//   // Open a drawer with content from a URL
//   openDrawer('/path/to/content')
//   
//   // Close the currently open drawer
//   closeDrawer()
//
// These functions dispatch custom events that are handled by the drawer_controller
// to manage the drawer's open/closed state and content loading.

export function openDrawer(url) {
  const openDrawerEvent = new CustomEvent("openDrawer", {
    bubbles: true,
    detail: {
      url: url
    },
  })

  document.dispatchEvent(openDrawerEvent)
}

export function closeDrawer() {
  const closeDrawerEvent = new CustomEvent("closeDrawer", {
    bubbles: true,
    detail: {
      name: "close drawer",
    },
  })

  document.dispatchEvent(closeDrawerEvent)
}
