import express, { Express, Request, Response } from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { makePayment } from "./controllers/mpesaPayment";
import getAccessToken from "./services/accessTokenService";

interface USSDRequest {
  sessionId: string;
  serviceCode: string;
  phoneNumber: string;
  text: string;
}

const app: Express = express();
dotenv.config();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req_: Request, res: Response) => {
  res.send('<h1 style="text-align: center;">Dairy Management System</h1>');
});

getAccessToken();

app.post("/api/ussd", (req: Request, res: Response) => {
  // Read the variables sent via POST from our API

  const { sessionId, serviceCode, phoneNumber, text }: USSDRequest = req.body;

  let response;
  response = "";

  console.log(sessionId);

  if (text == "") {
    // This is the first request. Note how we start the response with CON
    response = `CON What would you like to DO?
        1. Register
        2. Choose Payment Frequency
        3. My Account`;
    // The Logic for the first tier sub-menu
  } else if (text == "1") {
    response = `CON Enter your national ID number`;
  } else if (text == "2") {
    response = `CON Choose your payment frequency
        1. Daily
        2. Weekly
        3. Monthly`;
  } else if (text == "1*1") {
    const userId = "ACC100101";
    response = `CON Confirm your national ID is ${userId}
        1. Continue
        2. Change ID`;
  } else if (text == "1*1*1") {
    const amount = 1;
    response = makePayment(amount, phoneNumber, sessionId);
    response = `Payment has been initiated`;
  } else if (text == "1*1*2") {
  }

  // Send the response back to the API
  res.set("Content-Type: text/plain");
  res.send(response);
});

const port = process.env.PORT || 3000;

app.listen(port, () =>
  console.log(`Dairy Management System is listening on port ${port}`)
);
