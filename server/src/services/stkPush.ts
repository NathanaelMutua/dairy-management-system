import axios from "axios";
import getAccessToken from "./accessTokenService";

const DARAJA_URL =
  "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest";
const BUSINESS_SHORT_CODE = process.env.BUSINESS_SHORT_CODE || "";
const PASSKEY = process.env.DARAJA_PASSKEY || "";
const CALLBACK_URL = process.env.DARAJA_CALLBACK_URL || "";

function getTimestamp(): string {
  const date = new Date();
  return date
    .toISOString()
    .replace(/[-T:.Z]/g, "")
    .slice(0, 14);
}

function getPassword(timestamp: string): string {
  const dataToEncode = BUSINESS_SHORT_CODE + PASSKEY + timestamp;
  return Buffer.from(dataToEncode).toString("base64");
}

export interface StkPushRequest {
  amount: number;
  phone: string;
  accountReference: string;
  transactionDesc: string;
}

export async function initiateStkPush(request: StkPushRequest) {
  const accessToken = await getAccessToken();
  const timestamp = getTimestamp();
  const password = getPassword(timestamp);

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
