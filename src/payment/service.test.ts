import { describe, expect, it } from "vitest";
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
});
