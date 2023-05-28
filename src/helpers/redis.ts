const upstashRedisRestUrl = process.env.UPSTASH_REDIS_REST_URL;
const authToken = process.env.UPSTASH_REDIS_REST_TOKEN;

type Command = "zrange" | "sismember" | "get" | "smembers";

export async function fetchRedis(
  command: Command,
  ...args: (string | number)[]
) {
  // making request to upstash rest api this is the format in how you can make a request to the endpoint
  const commandUrl = `${upstashRedisRestUrl}/${command}/${args.join("/")}`;
  const response = await fetch(commandUrl, {
    headers: {
      // will authorize for us to make a query to our own db
      Authorization: `Bearer ${authToken}`,
    },
    // always delivering fresh data, + nextjs has the weird stuff with cache
    cache: "no-store",
  });

  if (!response.ok) throw new Error(`Error executing Redis command: ${response.statusText}`);

  const data = await response.json();
  return data.result;
}
