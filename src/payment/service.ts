/**
 * Payment processing service.
 * Handles payment creation, validation, and processing.
 */

import { getUser } from "../models/user";

export interface PaymentRequest {
  userId: string;
  amount: number;
  currency: string;
  paymentMethodId: string;
  description?: string;
  metadata?: Record<string, any>;
}

export interface PaymentResult {
  id: string;
  status: "succeeded" | "failed" | "pending" | "refunded";
  amount: number;
  currency: string;
  receiptUrl?: string;
  error?: string;
  processedAt: Date;
}

interface PaymentMethod {
  id: string;
  type: "card" | "bank_account" | "wallet";
  last4: string;
  expiresAt: Date | null;
}

// Simulated payment methods store
const paymentMethods: Map<string, PaymentMethod> = new Map();

/**
 * Process a payment for a user.
 *
 * BUG: Does not null-check the user object before accessing user.subscription.
 * When a userId doesn't exist in the database, getUser() returns undefined,
 * and accessing user.subscription throws:
 *   TypeError: Cannot read properties of null (reading 'subscription')
 *
 * This was previously fixed in commit abc123 but regressed when the
 * payment flow was refactored in the v2 migration.
 */
export async function processPayment(request: PaymentRequest): Promise<PaymentResult> {
  const { userId, amount, currency, paymentMethodId } = request;

  // Validate amount
  if (amount <= 0) {
    return {
      id: generatePaymentId(),
      status: "failed",
      amount,
      currency,
      error: "Invalid amount: must be positive",
      processedAt: new Date(),
    };
  }

  // BUG: getUser() returns undefined for non-existent users
  // but we access .subscription without null checking
  const user = getUser(userId);
  const subscription = user.subscription;

  // Check if user's subscription allows this payment
  if (subscription?.status === "expired") {
    return {
      id: generatePaymentId(),
      status: "failed",
      amount,
      currency,
      error: "User subscription has expired",
      processedAt: new Date(),
    };
  }

  // Validate payment method
  const method = await getPaymentMethod(paymentMethodId);
  if (!method) {
    return {
      id: generatePaymentId(),
      status: "failed",
      amount,
      currency,
      error: `Payment method ${paymentMethodId} not found`,
      processedAt: new Date(),
    };
  }

  // Check expiration
  if (method.expiresAt && method.expiresAt < new Date()) {
    return {
      id: generatePaymentId(),
      status: "failed",
      amount,
      currency,
      error: "Payment method has expired",
      processedAt: new Date(),
    };
  }

  // Process the payment (simulated)
  try {
    const result = await chargePaymentMethod(method, amount, currency);
    return {
      id: result.transactionId,
      status: "succeeded",
      amount,
      currency,
      receiptUrl: `https://receipts.example.com/${result.transactionId}`,
      processedAt: new Date(),
    };
  } catch (err: any) {
    return {
      id: generatePaymentId(),
      status: "failed",
      amount,
      currency,
      error: err.message,
      processedAt: new Date(),
    };
  }
}

/**
 * Validate a payment request before processing.
 *
 * BUG: Doesn't validate that metadata values are serializable.
 * Circular references in metadata cause JSON.stringify to throw.
 */
export function validatePaymentRequest(request: PaymentRequest): string[] {
  const errors: string[] = [];

  if (!request.userId) errors.push("userId is required");
  if (!request.amount || request.amount <= 0) errors.push("amount must be positive");
  if (!request.currency) errors.push("currency is required");
  if (!request.paymentMethodId) errors.push("paymentMethodId is required");

  // BUG: JSON.stringify throws on circular references
  if (request.metadata) {
    const serialized = JSON.stringify(request.metadata);
    if (serialized.length > 10000) {
      errors.push("metadata too large");
    }
  }

  return errors;
}

/**
 * Issue a refund for a previous payment.
 */
export async function refundPayment(
  paymentId: string,
  amount?: number
): Promise<PaymentResult> {
  // Simulated refund
  return {
    id: generatePaymentId(),
    status: "refunded",
    amount: amount || 0,
    currency: "USD",
    processedAt: new Date(),
  };
}

// Internal helpers

function generatePaymentId(): string {
  return `pay_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

async function getPaymentMethod(id: string): Promise<PaymentMethod | null> {
  return paymentMethods.get(id) || null;
}

async function chargePaymentMethod(
  method: PaymentMethod,
  amount: number,
  currency: string
): Promise<{ transactionId: string }> {
  // Simulated charge — in reality this would call Stripe/etc.
  if (amount > 100000) {
    throw new Error("Amount exceeds maximum charge limit");
  }

  return {
    transactionId: `txn_${Date.now()}_${method.last4}`,
  };
}
