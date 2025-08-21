import axios from "axios";
import getAccessToken from "./accessTokenService";

const DARAJA_URL =
  "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest";

function getTimestamp(): string {
  const date = new Date();
  return date
    .toISOString()
    .replace(/[-T:.Z]/g, "")
    .slice(0, 14);
}

// wanted to configure the variables after import...turns out the business short code was not being assigned
function getConfig() {
  const BUSINESS_SHORT_CODE = process.env.BUSINESS_SHORT_CODE || "";
  const PASSKEY = process.env.DARAJA_PASSKEY || "";
  const CALLBACK_URL = process.env.CALLBACK_URL || "";

  return { BUSINESS_SHORT_CODE, PASSKEY, CALLBACK_URL };
}

function getPassword(
  shortCode: string,
  passkey: string,
  timestamp: string
): string {
  const dataToEncode = shortCode + passkey + timestamp;
  return Buffer.from(dataToEncode).toString("base64");
}

export interface StkPushRequest {
  amount: number;
  phone: string;
  accountReference: string;
  transactionDesc: string;
}

export async function initiateStkPush(request: StkPushRequest) {
  const { BUSINESS_SHORT_CODE, PASSKEY, CALLBACK_URL } = getConfig();
  const accessToken = await getAccessToken();
  const timestamp = getTimestamp();
  const password = getPassword(BUSINESS_SHORT_CODE, PASSKEY, timestamp);

  const payload = {
    BusinessShortCode: BUSINESS_SHORT_CODE,
    Password: password,
    Timestamp: timestamp,
    TransactionType: "CustomerPayBillOnline",
    Amount: request.amount,
    PartyA: request.phone,
    PartyB: BUSINESS_SHORT_CODE,
    PhoneNumber: request.phone,
    CallBackURL: CALLBACK_URL,
    AccountReference: request.accountReference,
    TransactionDesc: request.transactionDesc,
  };

  const response = await axios.post(DARAJA_URL, payload, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  return response.data;
}
