import { fetchRedis } from "./redis";

// function to get all the friends from a specified user
export const getFriendsByUserId = async (userId: string) => {
  // retrieve friends for current user from the users set of friends
  const friendIds = (await fetchRedis(
    "smembers",
    `user:${userId}:friends`
  )) as string[];

  // calls every user from the array simultaneously because they don't depend on eachother
  const friends = await Promise.all(
    friendIds.map(async (friendId) => {
      // fetching all the info that is linked to this certain friend
      const friend = await fetchRedis("get", `user:${friendId}`) as string;
      const parsedFriend = JSON.parse(friend) as User;
      return parsedFriend;
    })
  );

  return friends;
};
