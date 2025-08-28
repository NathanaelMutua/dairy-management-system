import { Request, Response } from "express";
import { initiateStkPush } from "../services/stkPush";

interface USSDRequest {
  sessionId: string;
  serviceCode: string;
  phoneNumber: string;
  text: string;
}

export const ussdImplementation = async (req: Request, res: Response) => {
  // Read the variables sent via POST from our API

  const { sessionId, phoneNumber, text }: USSDRequest = req.body;

  const phone = phoneNumber.slice(1);

  let response = "";

  // parts and levels to control the USSD flow
  const parts = text?.trim() ? text.split("*") : [];
  let level = parts.length;

  if (level === 0) {
    // First request
    response = `CON What would you like to DO?
        1. Register
        2. Choose Payment Frequency
        3. My Account`;
  } else if (parts[0] === "1") {
    // Register flow
    if (level === 1) {
      response = `CON Enter your national ID number`;
    } else if (level === 2) {
      const id = parts[1];
      if (!/^\d{5,10}$/.test(id)) {
        response = `CON Invalid ID. Enter a valid national ID number`;
      } else {
        response = `CON Confirm your national ID is ${id}
        1. Continue to pay fee
        2. Change ID
        #. Home`;
      }
    } else if (level === 3) {
      const id = parts[1];
      if (parts[2] === "1") {
        try {
          await initiateStkPush({
            amount: 1,
            phone,
            accountReference: "Dairy System",
            transactionDesc: `Registration for ID ${id}`,
          });
          response = `END Payment initiated. Enter your M-Pesa PIN to complete.`;
        } catch (err) {
          console.error(err);
          response = `END Failed to initiate payment. Please try again later`;
        }
      } else if (parts[2] === "2") {
        response = `CON Enter your national ID number`;
      } else {
        response = `END Invalid option`;
      }
    }
  } else if (parts[0] === "2") {
    // Payment frequency flow
    if (level === 1) {
      response = `CON Choose your payment frequency
        1. Daily
        2. Weekly
        3. Monthly
        #. Home`;
    } else if (parts[parts.length - 1] === "#") {
      level = 0;
      response = `CON What would you like to DO?
        1. Register
        2. Choose Payment Frequency
        3. My Account`;
    }
  } else {
    response = `END Invalid option`;
  }

  // Send the response back to the API
  res.set("Content-Type: text/plain");
  res.send(response);
};
