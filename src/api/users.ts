/**
 * User API routes.
 */

import { Router, type Request, type Response } from "express";
import { createUser, getUser, updateUser, deleteUser, listUsers } from "../models/user";
import { truncate } from "../utils/formatters";

export const userRouter = Router();

// GET /api/users
userRouter.get("/", (_req: Request, res: Response) => {
  const users = listUsers();
  res.json({ users, count: users.length });
});

// GET /api/users/:id
userRouter.get("/:id", (req: Request, res: Response) => {
  const user = getUser(req.params.id);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  res.json({ user });
});

// POST /api/users
userRouter.post("/", (req: Request, res: Response) => {
  const { email, name, role } = req.body;

  if (!email || !name) {
    return res.status(400).json({ error: "email and name are required" });
  }

  const user = createUser({ email, name, role: role || "user" });
  res.status(201).json({ user });
});

// PATCH /api/users/:id
userRouter.patch("/:id", (req: Request, res: Response) => {
  const updated = updateUser(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ error: "User not found" });
  }
  res.json({ user: updated });
});

// DELETE /api/users/:id
userRouter.delete("/:id", (req: Request, res: Response) => {
  const deleted = deleteUser(req.params.id);
  if (!deleted) {
    return res.status(404).json({ error: "User not found" });
  }
  res.status(204).send();
});

/**
 * GET /api/users/:id/summary
 *
 * BUG: Calls truncate() on user.preferences?.language which can be undefined.
 * truncate(undefined) throws: TypeError: Cannot read properties of undefined (reading 'length')
 */
userRouter.get("/:id/summary", (req: Request, res: Response) => {
  const user = getUser(req.params.id);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  const languageDisplay = truncate(user.preferences?.language ?? "", 20);

  res.json({
    id: user.id,
    name: user.name,
    email: user.email,
    language: languageDisplay,
    memberSince: user.createdAt,
  });
});
