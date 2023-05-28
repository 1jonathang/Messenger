// this file will be responsible for all the authentication

import { NextAuthOptions } from "next-auth";
import { UpstashRedisAdapter } from "@next-auth/upstash-redis-adapter";
import { db } from "./db";
import GoogleProvider from "next-auth/providers/google";
import { fetchRedis } from "@/helpers/redis";

// checks if we dont set clientids
function getGoogleCredentials() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || clientId.length === 0) 
    throw new Error("Missing GOOGLE_CLIENT_ID");
  if (!clientSecret || clientSecret.length === 0)
    throw new Error("Missing GOOGLE_CLIENT_SECRET");

  return { clientId, clientSecret };
}

export const authOptions: NextAuthOptions = {
  // everytime someone calls this auth, when they login, a certain action within our db will be taken, user data will be put into the db automatically
  // npm install @next-auth/upstash-redis-adapter
  adapter: UpstashRedisAdapter(db),
  session: {
    // jwt = jason web token, we don't handle the session on the db, so we can verify the session in our middleware later on to protect our routes easier
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    GoogleProvider({
      clientId: getGoogleCredentials().clientId,
      clientSecret: getGoogleCredentials().clientSecret,
    }),
  ],
  // actions that are taken when certain events happen that next-auth detects
  callbacks: {
    async jwt({ token, user }) {
      // check if there's already a user in our db
      const dbUserResult = (await fetchRedis('get', `user:${token.id}`)) as string | null;

      if (!dbUserResult) {
        if (user) {
          token.id = user!.id
        }

        return token
      }

      const dbUser = JSON.parse(dbUserResult) as User

      return {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        picture: dbUser.image,
      };
    },
    // whenever a session is generated
    async session({session, token}) {
        if(token) {
            session.user.id = token.id;
            session.user.name = token.name;
            session.user.email = token.email;
            session.user.image = token.picture;
        }

        return session;
    },
    // if a user has signed in we want to redirect them
    redirect() {
        return '/dashboard'
    },
  },
};
