import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { pusherServer } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";
import { addFriendValidator } from "@/lib/validations/add-friend";
import { getServerSession } from "next-auth";
import { z } from "zod";

// want to handle post requests by the client
export async function POST(req: Request) {
  // handling async function interacting with our db
  try {
    // getting access to the body content of the post request
    const body = await req.json();

    // validate input again just to double check
    const { email: emailToAdd } = addFriendValidator.parse(body.email);

    // getting response from rest api, we see this naming convention on upstash's dashboard/data browser
    const RESTResponse = await fetch(
      `${process.env.UPSTASH_REDIS_REST_URL}/get/user:email:${emailToAdd}`,
      {
        headers: {
          // will authorize for us to make a query to our own db
          Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`,
        },
        // always delivering fresh data, + nextjs has the weird stuff with cache
        cache: "no-store",
      }
    );

    const data = (await RESTResponse.json()) as { result: string | null };

    const idToAdd = data.result;
    if (!idToAdd)
      return new Response("This person does not exist.", { status: 400 });

    const session = await getServerSession(authOptions);
    if (!session) return new Response("Unauthorized", { status: 401 });

    if (idToAdd === session.user.id)
      return new Response("You cannot add yourself!", { status: 400 });

    // check if user is already added
    const isAlreadyAdded = (await fetchRedis(
      "sismember",
      `user:${idToAdd}:incoming_friend_requests`,
      session.user.id
    )) as 0 | 1;

    if (isAlreadyAdded)
      return new Response("You have already added this user", { status: 400 });

    // check if user is already a friend
    const isAlreadyFriend = (await fetchRedis(
      "sismember",
      `user:${session.user.id}:friends`,
      idToAdd
    )) as 0 | 1;

    if (isAlreadyFriend) {
      return new Response("This user is already your friend", { status: 400 });
    }

    // pusher function to notify user in real time when someone sends a friend request
    console.log("trigger pusher");
    // npm i encoding
    pusherServer.trigger(
      toPusherKey(`user:${idToAdd}:incoming_friend_requests`),
      "incoming_friend_requests",
      {
        senderId: session.user.id,
        senderEmail: session.user.email,
      }
    );

    await db.sadd(`user:${idToAdd}:incoming_friend_requests`, session.user.id);

    return new Response("OK");
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response("Invalid request payload", { status: 422 });
    }

    return new Response("Invalid request", { status: 400 });
  }
}
