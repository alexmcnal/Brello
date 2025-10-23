import consumer from "channels/consumer"

consumer.subscriptions.create("ApplicationChannel", {
  connected() {
    console.log("ApplicationChannel connected")
  },

  disconnected() {

  },

  received(data) {
    // Called when there's incoming data on the websocket for this channel
  }
});
