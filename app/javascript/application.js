// Configure your import map in config/importmap.rb. Read more: https://github.com/rails/importmap-rails
import "@hotwired/turbo-rails"
import "controllers"
import "channels"

window.App ||= {}

// A stable ID per browser tab (or use sessionStorage for per-session)
App.cableClientId = sessionStorage.cableClientId ||= crypto.randomUUID()

// Add this header automatically to all fetch requests Turbo makes
document.addEventListener("turbo:before-fetch-request", (event) => {
  event.detail.fetchOptions.headers["X-Cable-Client-Id"] = App.cableClientId
})
