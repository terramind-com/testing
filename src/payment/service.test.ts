import { describe, expect, it } from "vitest";
import { createUser } from "../models/user";
import { processPayment } from "./service";

describe("processPayment", () => {
  it("returns a failed result when the user does not exist", async () => {
    const result = await processPayment({
      userId: "missing-user",
      amount: 100,
      currency: "USD",
      paymentMethodId: "pm_missing",
    });

    expect(result.status).toBe("failed");
    expect(result.error).toBe("User missing-user not found");
  });

  it("returns a failed result when the user has no subscription", async () => {
    const user = createUser({
      email: "nosub@example.com",
      name: "No Subscription",
      role: "user",
    });

    const result = await processPayment({
      userId: user.id,
      amount: 100,
      currency: "USD",
      paymentMethodId: "pm_missing",
    });

    expect(result.status).toBe("failed");
    expect(result.error).toBe(`User ${user.id} does not have an active subscription`);
  });
});
