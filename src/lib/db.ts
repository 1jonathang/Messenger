import { Redis } from "@upstash/redis"

export const db = new Redis({
    // idk why can't do process.env.UPSTASH_REDIS_REST_URL just paste env vars
    url: 'https://usw2-full-molly-30921.upstash.io',
    token: 'AXjJASQgNDE0N2FjZDgtNDU2My00NjM3LTg0MDItOTIxNzU1MTk5YzI2NjQ0Y2FmNGY1OGI3NDBmOWFiZmI3YmJiNjc5OTBmNzg=',
})

