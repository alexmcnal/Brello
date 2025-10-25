export function moveCard(cardId, toColumnId, toPosition) {
  const cardMovedEvent = new CustomEvent("moveCard", {
    bubbles: true,
    detail: {
      cardId: cardId,
      toColumnId: toColumnId,
      toPosition: toPosition
    }
  })

  document.dispatchEvent(cardMovedEvent)
}
