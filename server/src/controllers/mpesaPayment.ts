// to be converted from tiny pesa to Daraja API

import { Request, Response } from "express";

export async function makePayment(
  amount: number,
  phone: string,
  sessionId: string
): Promise<any> {
  const url = "https://tinypesa.com/api/v1/express/initialize";

  const headers = {
    "Content-Type": "application/x-www-form-urlencoded",
    ApiKey: process.env.TINY_API_KEY as string,
  };

  try {
    const formData = new URLSearchParams();
    formData.append("amount", amount.toString());
    formData.append("msisdn", phone);
    formData.append("account_no", sessionId);

    console.log("Payment request details:", {
      url,
      headers,
      formData: Object.fromEntries(formData),
      apiKey: headers.ApiKey,
    });

    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: formData,
    });

    console.log("Payment response status:", response.status);
    console.log(
      "Payment response headers:",
      Object.fromEntries(response.headers.entries())
    );

    const responseText = await response.text();
    console.log("Payment response body:", responseText);

    if (!response.ok) {
      throw new Error(`Payment API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Payment error:", error);
    throw new Error("Payment processing failed");
  }
}

// Route handler that uses the service
export const processPayment = async (req: Request, res: Response) => {
  try {
    const { amount, phone, sessionId } = req.body;

    // Validate input
    if (!amount || !phone || !sessionId) {
      return res.status(400).json({
        success: false,
        error: "Amount, phone, and sessionId are required",
      });
    }

    // Make payment
    const paymentResult = await makePayment(amount, phone, sessionId);

    // Response
    res.json({
      success: true,
      data: paymentResult,
    });
  } catch (error) {
    console.error("Payment controller error:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Payment failed",
    });
  }
};
