import { prisma } from "./prisma";

/**
 * Notification utility functions
 */

export type NotificationType =
    | "SESSION_SCHEDULED"
    | "SESSION_REMINDER"
    | "SESSION_STARTED"
    | "SESSION_COMPLETED"
    | "POINTS_EARNED"
    | "POINTS_SPENT"
    | "SKILL_VERIFIED"
    | "NEW_MESSAGE"
    | "RATING_RECEIVED";

interface CreateNotificationParams {
    userId: string;
    type: NotificationType;
    title: string;
    message: string;
    link?: string;
}

/**
 * Create a notification for a user
 */
export async function createNotification(params: CreateNotificationParams) {
    return await prisma.notification.create({
        data: {
            userId: params.userId,
            type: params.type,
            title: params.title,
            message: params.message,
            link: params.link,
        },
    });
}

/**
 * Create session scheduled notification
 */
export async function notifySessionScheduled(
    studentId: string,
    teacherId: string,
    skillName: string,
    scheduledTime: Date
) {
    const formattedTime = scheduledTime.toLocaleString();

    // Notify student
    await createNotification({
        userId: studentId,
        type: "SESSION_SCHEDULED",
        title: "Session Scheduled",
        message: `Your ${skillName} session is scheduled for ${formattedTime}`,
        link: "/dashboard/sessions",
    });

    // Notify teacher
    await createNotification({
        userId: teacherId,
        type: "SESSION_SCHEDULED",
        title: "New Session Scheduled",
        message: `You have a new ${skillName} session scheduled for ${formattedTime}`,
        link: "/dashboard/sessions",
    });
}

/**
 * Create session reminder notification (15 minutes before)
 */
export async function notifySessionReminder(
    userId: string,
    sessionId: string,
    skillName: string
) {
    await createNotification({
        userId,
        type: "SESSION_REMINDER",
        title: "Session Starting Soon",
        message: `Your ${skillName} session starts in 15 minutes`,
        link: `/dashboard/room/${sessionId}`,
    });
}

/**
 * Create points earned notification
 */
export async function notifyPointsEarned(userId: string, amount: number, reason: string) {
    await createNotification({
        userId,
        type: "POINTS_EARNED",
        title: "Points Earned!",
        message: `You earned ${amount} points for ${reason}`,
        link: "/dashboard/points",
    });
}

/**
 * Create skill verified notification
 */
export async function notifySkillVerified(userId: string, skillName: string) {
    await createNotification({
        userId,
        type: "SKILL_VERIFIED",
        title: "Skill Verified!",
        message: `Your ${skillName} skill has been verified. You can now teach this skill!`,
        link: "/dashboard/skills",
    });
}

/**
 * Mark notification as read
 */
export async function markNotificationRead(notificationId: string) {
    return await prisma.notification.update({
        where: { id: notificationId },
        data: { read: true },
    });
}

/**
 * Mark all notifications as read for a user
 */
export async function markAllNotificationsRead(userId: string) {
    return await prisma.notification.updateMany({
        where: { userId, read: false },
        data: { read: true },
    });
}

/**
 * Get unread notification count
 */
export async function getUnreadCount(userId: string): Promise<number> {
    return await prisma.notification.count({
        where: { userId, read: false },
    });
}
