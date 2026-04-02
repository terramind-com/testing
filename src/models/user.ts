export interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "user" | "guest";
  preferences?: UserPreferences;
  subscription?: Subscription;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserPreferences {
  theme: "light" | "dark";
  notifications: boolean;
  language: string;
  timezone: string;
}

export interface Subscription {
  plan: "free" | "pro" | "enterprise";
  status: "active" | "cancelled" | "expired";
  expiresAt: Date | null;
  paymentMethodId: string | null;
}

// In-memory store (simulates a database)
const users: Map<string, User> = new Map();

export function getUser(id: string): User | undefined {
  return users.get(id);
}

export function createUser(data: Omit<User, "id" | "createdAt" | "updatedAt">): User {
  const user: User = {
    ...data,
    id: `usr_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  users.set(user.id, user);
  return user;
}

export function updateUser(id: string, data: Partial<User>): User | null {
  const user = users.get(id);
  if (!user) return null;

  const updated = { ...user, ...data, updatedAt: new Date() };
  users.set(id, updated);
  return updated;
}

export function deleteUser(id: string): boolean {
  return users.delete(id);
}

export function listUsers(): User[] {
  return Array.from(users.values());
}
