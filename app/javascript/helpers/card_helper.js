// Card helper functions for managing card-related events and operations
//
// This module provides utility functions for:
// - Moving cards between columns and positions
// - Broadcasting card update events via custom events
//
// Usage:
//   import { moveCard, cardUpdated } from "helpers/card_helper"
//
//   // Move a card to a new column and position
//   moveCard(cardId, columnId, position)
//
//   // Broadcast that a card has been updated
//   cardUpdated(dom_id, cardData)

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