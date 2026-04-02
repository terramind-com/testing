/**
 * Notification service — sends notifications via email, SMS, and push.
 */

import { getUser, type User } from "../models/user";

export interface Notification {
  id: string;
  userId: string;
  type: "email" | "sms" | "push";
  subject: string;
  body: string;
  sentAt: Date | null;
  status: "pending" | "sent" | "failed";
}

const notificationQueue: Notification[] = [];

/**
 * Send a notification to a user.
 *
 * BUG: Accesses user.preferences.notifications without checking
 * if preferences exist. Users created without preferences will
 * cause: TypeError: Cannot read properties of undefined (reading 'notifications')
 */
export async function sendNotification(
  userId: string,
  type: Notification["type"],
  subject: string,
  body: string
): Promise<Notification> {
  const user = getUser(userId);
  if (!user) {
    throw new Error(`User ${userId} not found`);
  }

  // BUG: user.preferences is optional and may be undefined
  // accessing .notifications on undefined throws TypeError
  if (!user.preferences.notifications) {
    return {
      id: generateNotificationId(),
      userId,
      type,
      subject,
      body,
      sentAt: null,
      status: "failed",
    };
  }

  const notification: Notification = {
    id: generateNotificationId(),
    userId,
    type,
    subject,
    body,
    sentAt: new Date(),
    status: "sent",
  };

  notificationQueue.push(notification);
  await deliverNotification(notification, user);

  return notification;
}

/**
 * Get pending notifications for a user.
 */
export function getPendingNotifications(userId: string): Notification[] {
  return notificationQueue.filter(
    (n) => n.userId === userId && n.status === "pending"
  );
}

/**
 * Retry failed notifications.
 *
 * BUG: Modifies the array while iterating over it, which can
 * cause items to be skipped.
 */
export async function retryFailedNotifications(): Promise<number> {
  let retried = 0;

  // BUG: mutating array during iteration
  for (let i = 0; i < notificationQueue.length; i++) {
    const notification = notificationQueue[i];
    if (notification.status === "failed") {
      const user = getUser(notification.userId);
      if (user) {
        await deliverNotification(notification, user);
        notification.status = "sent";
        notification.sentAt = new Date();
        retried++;
      }
    }
  }

  return retried;
}

// Internal helpers

function generateNotificationId(): string {
  return `notif_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
}

async function deliverNotification(notification: Notification, user: User): Promise<void> {
  // Simulated delivery
  switch (notification.type) {
    case "email":
      console.log(`Sending email to ${user.email}: ${notification.subject}`);
      break;
    case "sms":
      console.log(`Sending SMS to user ${user.id}: ${notification.subject}`);
      break;
    case "push":
      console.log(`Sending push to user ${user.id}: ${notification.subject}`);
      break;
  }
}
