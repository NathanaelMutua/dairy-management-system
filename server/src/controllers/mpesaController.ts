import { Request, Response } from "express";

export const mpesaImplementation = (req: Request, res: Response) => {
  console.log("STK Callback:", JSON.stringify(req.body, null, 2));
  const stk = req.body?.Body?.stkCallback;
  if (stk) {
    const { ResultCode, ResultDesc, CallbackMetadata } = stk;
  }
  res.status(200).send("OK");
};
