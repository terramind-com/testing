/**
 * Product API routes.
 */

import { Router, type Request, type Response } from "express";
import { getProduct, listProducts, createProduct, updateStock } from "../models/product";
import { parseTags } from "../utils/formatters";

export const productRouter = Router();

// GET /api/products
productRouter.get("/", (req: Request, res: Response) => {
  const { category, active } = req.query;
  const products = listProducts({
    category: category as string | undefined,
    active: active === "true" ? true : active === "false" ? false : undefined,
  });
  res.json({ products, count: products.length });
});

// GET /api/products/:id
productRouter.get("/:id", (req: Request, res: Response) => {
  const product = getProduct(req.params.id);
  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }
  res.json({ product });
});

// POST /api/products
productRouter.post("/", (req: Request, res: Response) => {
  const { name, description, price, currency, stock, category, tags, metadata } = req.body;

  if (!name || !price) {
    return res.status(400).json({ error: "name and price are required" });
  }

  // BUG: parseTags crashes when tags is undefined (not provided in body)
  // because it calls .split() on undefined
  const parsedTags = parseTags(tags);

  const product = createProduct({
    name,
    description: description || "",
    price,
    currency: currency || "USD",
    stock: stock || 0,
    category: category || "uncategorized",
    metadata: { ...metadata, tags: parsedTags },
    isActive: true,
  });

  res.status(201).json({ product });
});

// PATCH /api/products/:id/stock
productRouter.patch("/:id/stock", (req: Request, res: Response) => {
  const { quantity } = req.body;

  if (typeof quantity !== "number") {
    return res.status(400).json({ error: "quantity must be a number" });
  }

  const updated = updateStock(req.params.id, quantity);
  if (!updated) {
    return res.status(404).json({ error: "Product not found" });
  }

  res.json({ product: updated });
});
