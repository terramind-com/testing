import express from "express";
import { userRouter } from "./api/users";
import { paymentRouter } from "./api/payments";
import { productRouter } from "./api/products";
import { errorHandler } from "./middleware/error-handler";
import { requestLogger } from "./middleware/request-logger";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(requestLogger);

// Routes
app.use("/api/users", userRouter);
app.use("/api/payments", paymentRouter);
app.use("/api/products", productRouter);

// Health check
app.get("/health", (_req, res) => {
  res.json({ status: "ok", uptime: process.uptime() });
});

// Error handler (must be last)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
