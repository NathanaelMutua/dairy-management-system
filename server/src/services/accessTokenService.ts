// accessToken.ts
async function getAccessToken() {
  const consumerKey = process.env.CONSUMER_KEY;
  const consumerSecret = process.env.CONSUMER_SECRET;
  const access_token_url =
    "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials";

  // Create Basic Auth header
  const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString(
    "base64"
  );
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Basic ${auth}`,
  };

  try {
    const response = await fetch(access_token_url, {
      method: "GET",
      headers: headers,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log(result); // just wanted to check...
    const access_token = result.access_token;
    console.log(access_token);
  } catch (error) {
    console.error("Error:", error);
  }
}

export default getAccessToken;
