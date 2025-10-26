import consumer from "channels/consumer"
import { cardUpdated } from "helpers/card_helper"

consumer.subscriptions.create("CardsChannel", {
  received(data) {

    if (data.additional_data?.source_id === App.cableClientId) {
      return
    }

    const { action, dom_id, card } = data;
    if (action === 'cardUpdated') {
      cardUpdated(dom_id, card)
    }
  }
});
