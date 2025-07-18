"use server";

import { currentUser } from "@clerk/nextjs/server";
import { StreamClient, UserRequest } from "@stream-io/node-sdk";

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY!;
const apiSecret = process.env.STREAM_SECRET_KEY!;

export const tokenProvider = async () => {
  const user = await currentUser();

  if (!user) throw new Error("User not logged in");
  if (!apiKey) throw new Error("No API key");
  if (!apiSecret) throw new Error("No API secret");

  const client = new StreamClient(apiKey, apiSecret);
  
  const streamUser: UserRequest = {
    id: user.id,
    role: "user",
    name: user.username ?? user.firstName ?? "Anonymous",
    image: user.imageUrl ?? undefined,
  };

  await client.upsertUsers([streamUser]);

  const oneHour = 60 * 60;
  const token = client.generateUserToken({
    user_id: user.id,
    validity_in_seconds: oneHour,
  });

  return token;
};
