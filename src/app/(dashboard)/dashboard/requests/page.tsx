import FriendRequests from "@/components/FriendRequests";
import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import { FC } from "react";

const page = async () => {
  // getting session
  const session = await getServerSession(authOptions);
  if (!session) notFound();

  // ids of friend requests
  const incomingSenderIds = (await fetchRedis(
    "smembers",
    `user:${session.user.id}:incoming_friend_requests`
  )) as string[];

  // lets us await an array of promise simultaneously, each incoming friend request will be fetched at the same time and not one after another
  // allows for better and faster performance
  const incomingFriendRequests = await Promise.all(
    incomingSenderIds.map(async (senderId) => {
        const sender = await fetchRedis('get', `user:${senderId}`) as string;
        const senderParsed = JSON.parse(sender) as User;
        console.log("sender", sender)
        return {
            senderId,
            senderEmail: senderParsed.email,
        }
    })
  );

  console.log("incomingFriendRequests", incomingFriendRequests)
  return (
    <main className="pt-8 pl-8">
        <h1 className="font-bold text-5xl mb-8">Add a friend</h1>
        <div className="flex flex-col gap-4">
            <FriendRequests incomingFriendRequests={incomingFriendRequests} sessionId={session.user.id}/>
        </div>
    </main>
  );
};

export default page;
