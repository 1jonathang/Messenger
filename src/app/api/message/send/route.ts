// all sending message logic via post request

import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { pusherServer } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";
import { Message, messageSchema } from "@/lib/validations/message";
import { nanoid } from "nanoid";
import { getServerSession } from "next-auth";

export async function POST(req: Request) {
  try {
    const { text, chatId }: { text: string; chatId: string } = await req.json();
    const session = await getServerSession(authOptions);

    if (!session) return new Response("Unauthorized", { status: 401 });

    // getting the users from url, splitting them from the 'user1--user2' format
    const [userId1, userId2] = chatId.split("--");

    // if unauthorized user
    if (session.user.id !== userId1 && session.user.id !== userId2) {
      return new Response("Unauthorized", { status: 401 });
    }

    // getting the friends id
    const friendId = session.user.id === userId1 ? userId2 : userId1;
    

    // checking if user is in friends list, good to have this checkpoint
    // if not in friend list then can't send message
    const friendList = (await fetchRedis(
      "smembers",
      `user:${session.user.id}:friends`
    )) as string[];
    const isFriend = friendList.includes(friendId);

    if (!isFriend) {
      return new Response("Unauthorized", { status: 401 });
    }

    // the redis api returs the sender as a json string so we have to parse it
    const rawSender = (await fetchRedis(
      "get",
      `user:${session.user.id}`
    )) as string;
    const sender = JSON.parse(rawSender) as User;

    // at this point everything is valid so we send the message

    const timestamp = Date.now();
    const messageData: Message = {
      id: nanoid(),
      senderId: session.user.id,
      text,
      timestamp,
    };

    const message = messageSchema.parse(messageData);

    // notify all connected chat room clients
    pusherServer.trigger(toPusherKey(`chat:${chatId}`), "incoming-message", message)

    pusherServer.trigger(toPusherKey(`user:${friendId}:chats`), 'new_message', {
      ...message,
      senderImg: sender.image,
      senderName: sender.name
    });

    // add  message to db
    await db.zadd(`chat:${chatId}:messages`, {
      // making timestamp the score so we know the order in which the messages were
      score: timestamp,
      member: JSON.stringify(message),
    });

    return new Response("OK");
  } catch (error) {
    if (error instanceof Error) {
      return new Response(error.message, { status: 500 });
    }

    return new Response("Internal server error", { status: 500 });
  }
}

