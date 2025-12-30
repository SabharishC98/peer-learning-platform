import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateSessionSummary } from "@/lib/ai-summary";
import { notifyPointsEarned } from "@/lib/notifications";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { sessionId } = body;

        if (!sessionId) {
            return NextResponse.json({ error: "Session ID is required" }, { status: 400 });
        }

        // Get session details
        const session = await prisma.session.findUnique({
            where: { id: sessionId },
            include: {
                teacher: true,
                student: true,
                messages: {
                    select: {
                        sender: { select: { name: true } },
                        content: true,
                    },
                },
            },
        });

        if (!session) {
            return NextResponse.json({ error: "Session not found" }, { status: 404 });
        }

        if (session.status === "COMPLETED") {
            return NextResponse.json({ error: "Session already completed" }, { status: 400 });
        }

        // Calculate session duration
        const startTime = session.startTime || session.scheduledTime;
        const endTime = new Date();
        const durationMinutes = Math.floor((endTime.getTime() - startTime.getTime()) / (1000 * 60));

        // Generate AI summary
        const summary = await generateSessionSummary({
            skillName: session.skillName,
            duration: durationMinutes,
            teacherName: session.teacher.name || "Teacher",
            studentName: session.student.name || "Student",
            messages: session.messages.map((m: any) => ({
                sender: m.sender.name || "Unknown",
                content: m.content,
            })),
        });

        // Update session and transfer points in a transaction
        const result = await prisma.$transaction(async (tx: any) => {
            // Update session
            const updatedSession = await tx.session.update({
                where: { id: sessionId },
                data: {
                    status: "COMPLETED",
                    endTime,
                },
            });

            // Add points to teacher
            await tx.user.update({
                where: { id: session.teacherId },
                data: { points: { increment: session.pointsCost } },
            });

            // Create transaction record for teacher
            await tx.transaction.create({
                data: {
                    userId: session.teacherId,
                    type: "EARN",
                    amount: session.pointsCost,
                    description: `Completed session: ${session.skillName}`,
                    sessionId: session.id,
                },
            });

            // Create session summary
            await tx.sessionSummary.create({
                data: {
                    sessionId: session.id,
                    content: summary.content,
                    keyPoints: JSON.stringify(summary.keyPoints),
                    nextSteps: summary.nextSteps,
                },
            });

            return updatedSession;
        });

        // Send notification to teacher
        await notifyPointsEarned(
            session.teacherId,
            session.pointsCost,
            `completing ${session.skillName} session`
        );

        return NextResponse.json({
            success: true,
            session: result,
            summary,
            message: "Session completed successfully!",
        });
    } catch (error) {
        console.error("Error ending session:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
