import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// functions to help make everything easier

// cn(class names)
// npm install clsx tailwind-merge
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// constructs the link pathway of the chat, "/dashboard/chat/user1--user2"
export function chatHrefConstructor(id1: string, id2: string) {
  const sortedIds = [id1, id2].sort();

  return `${sortedIds[0]}--${sortedIds[1]}`;
}

// pusher doesn't allow colons but we need that to fethc info from redis api, so we create this helper
export function toPusherKey(key: string) {
    return key.replace(/:/g, '__');
}