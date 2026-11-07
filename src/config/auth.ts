import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { jwt } from "better-auth/plugins";
import { getDB, default as mongoClient } from "./db.js";

export const createAuth = () => {
  return betterAuth({
    database: mongodbAdapter(getDB(), {
      client: mongoClient,
    }),

    baseURL: process.env.BETTER_AUTH_URL,
    secret: process.env.BETTER_AUTH_SECRET,

    emailAndPassword: {
      enabled: true,
      minPasswordLength: 6,
      requireEmailVerification: false,
    },

    socialProviders: {
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID || "",
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      },
    },

    plugins: [jwt()],

    trustedOrigins: [
      process.env.CLIENT_URL || "http://localhost:3000",
    ],
  });
};

export type Auth = ReturnType<typeof createAuth>;
