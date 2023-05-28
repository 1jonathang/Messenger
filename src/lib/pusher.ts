// a service for real time communication
// npm i pusher pusher-js

import PusherServer from "pusher";
import PusherClient from "pusher-js";

// from client side everytime we send message or friend request we make a post request to the server containing message content
// server will put info into db and send message back to client and chat partner
// need server and chatpartner to subscribe to changes

export const pusherServer = new PusherServer({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY!,
  secret: process.env.PUSHER_APP_SECRET!,
  cluster: 'us2',
  useTLS: true,
})

export const pusherClient = new PusherClient(
  process.env.NEXT_PUBLIC_PUSHER_APP_KEY!,
  {
    cluster: 'us2',
  }
)


