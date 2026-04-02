/**
 * Payment API routes.
 */

import { Router, type Request, type Response } from "express";
import { processPayment, refundPayment, validatePaymentRequest } from "../payment/service";

export const paymentRouter = Router();

// POST /api/payments
paymentRouter.post("/", async (req: Request, res: Response) => {
  const { userId, amount, currency, paymentMethodId, description, metadata } = req.body;

  const request = { userId, amount, currency, paymentMethodId, description, metadata };
  const errors = validatePaymentRequest(request);

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  try {
    const result = await processPayment(request);
    const status = result.status === "succeeded" ? 200 : 402;
    res.status(status).json({ payment: result });
  } catch (err: any) {
    res.status(500).json({ error: "Payment processing failed", message: err.message });
  }
});

// POST /api/payments/:id/refund
paymentRouter.post("/:id/refund", async (req: Request, res: Response) => {
  const { amount } = req.body;

  try {
    const result = await refundPayment(req.params.id, amount);
    res.json({ refund: result });
  } catch (err: any) {
    res.status(500).json({ error: "Refund failed", message: err.message });
  }
});
