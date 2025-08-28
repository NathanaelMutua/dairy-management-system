import express, { Express, Request, Response } from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { ussdRouter } from "./routes/ussdRouter";
import { mpesaRouter } from "./routes/mpesaRouter";

const app: Express = express();

dotenv.config();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// initial Server page
app.get("/", (req_: Request, res: Response) => {
  res.send('<h1 style="text-align: center;">Dairy Management System</h1>');
});

// server endpoints
app.use("/api/ussd", ussdRouter);
app.use("/api/mpesa", mpesaRouter);

const port = process.env.PORT || 3000;

app.listen(port, () =>
  console.log(`Dairy Management System is listening on port ${port}`)
);
