import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["column"]

  connect() {
    const Sortable = window.Draggable.Sortable

    this.sortable = new Sortable(this.element, {
      draggable: ".board__column",
      handle: ".drag-handle",
      mirror: {
        constrainDimensions: true
      }
    })

    this.sortable.on("sortable:stop", (event) => {
      const { source, newIndex } = event
      const boardColumnId = source.dataset.boardColumnId

      const form = document.createElement("form")
      form.action = `/board_columns/${boardColumnId}`
      form.method = "post"
      form.innerHTML = `
        <input type="hidden" name="_method" value="patch" />
        <input type="hidden" name="position" value="${newIndex + 1}" />
        <input type="hidden" name="authenticity_token" value="${document.querySelector('meta[name=csrf-token]').content}" />
      `
      document.body.appendChild(form)
      form.submit()
    })
  }

  disconnect() {
    if (this.sortable) this.sortable.destroy()
  }
}
