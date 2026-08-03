import { TwitterApi } from "twitter-api-v2";

// Build an X client from the four env vars. Names match .env.example and the
// Vercel project settings: X_API_KEY, X_API_SECRET, X_ACCESS_TOKEN, X_ACCESS_SECRET.
export function getXClient(): TwitterApi {
  const appKey = process.env.X_API_KEY;
  const appSecret = process.env.X_API_SECRET;
  const accessToken = process.env.X_ACCESS_TOKEN;
  const accessSecret = process.env.X_ACCESS_SECRET;

  if (!appKey || !appSecret || !accessToken || !accessSecret) {
    throw new Error(
      "X keys are not all set. Check X_API_KEY, X_API_SECRET, X_ACCESS_TOKEN, and X_ACCESS_SECRET in Vercel."
    );
  }

  return new TwitterApi({ appKey, appSecret, accessToken, accessSecret });
}

// Confirm the keys work and return the handle they post as.
export async function verifyX(): Promise<string> {
  const client = getXClient();
  const me = await client.v2.me();
  return me.data.username;
}

// Post a single tweet. Returns the new tweet id.
export async function postToX(text: string): Promise<string> {
  const client = getXClient();
  const res = await client.v2.tweet(text.slice(0, 280));
  return res.data.id;
}
