export function moveCard(cardId, toColumnId, toPosition) {
  const moveCardEvent = new CustomEvent("moveCard", {
    bubbles: true,
    detail: {
      cardId: cardId,
      toColumnId: toColumnId,
      toPosition: toPosition
    }
  })

  document.dispatchEvent(moveCardEvent)
}

export function cardUpdated(dom_id, card) {
  const cardUpdatedEvent = new CustomEvent("cardUpdated", {
    bubbles: false,
    detail: {
      dom_id: dom_id,
      card: card
    }
  })

  document.dispatchEvent(cardUpdatedEvent)
}