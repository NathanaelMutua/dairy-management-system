import express, { Express, Request, Response } from "express";
import bodyParser from "body-parser";

const app: Express = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req_: Request, res: Response) => {
  res.send('<h1 style="text-align: center;">Dairy Management System</h1>');
});

app.post("/ussd", (req: Request, res: Response) => {
  // Read the variables sent via POST from our API

  const { sessionId, networkCode, phoneNumber, text } = req.body;

  let response = "";

  console.log(sessionId);

  if (text == "") {
    // This is the first request. Note how we start the response with CON
    response = `CON What would you like to DO?
        1. My account
        2. Make Payment`;
  } else if (text == "1") {
    // Business logic for first level response
    response = `CON Choose account information you want to view
        1. Account number`;
  } else if (text == "2") {
    // Business logic for first level response
    // This is a terminal request. Note how we start the response with END
    response = `END Your phone number is ${phoneNumber}`;
  } else if (text == "1*1") {
    // This is a second level response where the user selected 1 in the first instance
    const accountNumber = "ACC100101";
    // This is a terminal request. Note how we start the response with END
    response = `END Your account number is ${accountNumber}`;
  }

  // Send the response back to the API
  res.set("Content-Type: text/plain");
  res.send(response);
});

const port = process.env.PORT || 3000;

app.listen(port, () =>
  console.log(`Dairy Management System is listening on port ${port}`)
);
