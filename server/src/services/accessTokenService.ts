import axios from "axios";

type AccessTokenResponse = { access_token: string };

async function getAccessToken(): Promise<string> {
  const consumerKey = process.env.CONSUMER_KEY;
  const consumerSecret = process.env.CONSUMER_SECRET;
  const access_token_url =
    "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials";

  if (!consumerKey || !consumerSecret) {
    throw new Error("Missing CONSUMER_KEY or CONSUMER_SECRET");
  }

  const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString(
    "base64"
  );
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Basic ${auth}`,
  };

  const { data } = await axios.get<AccessTokenResponse>(access_token_url, {
    headers,
  });

  if (!data?.access_token) {
    throw new Error("Failed to obtain access token");
  }

  return data.access_token as string;
}

export default getAccessToken;
