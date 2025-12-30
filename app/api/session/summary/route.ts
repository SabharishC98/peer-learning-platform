import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const { searchParams } = new URL(request.url);
        const studentId = searchParams.get("studentId");

        if (!studentId) {
            return NextResponse.json({ error: "Student ID is required" }, { status: 400 });
        }

        // Get all completed sessions for this student
        const sessions = await prisma.session.findMany({
            where: {
                studentId,
                status: "COMPLETED",
            },
            include: {
                summaries: true,
                teacher: {
                    select: {
                        name: true,
                    },
                },
            },
            orderBy: {
                endTime: "desc",
            },
        });

        // Format summaries
        const formattedSummaries = sessions.map((session) => ({
            sessionId: session.id,
            skillName: session.skillName,
            teacherName: session.teacher.name,
            date: session.endTime,
            summaries: session.summaries.map((summary) => ({
                content: summary.content,
                keyPoints: JSON.parse(summary.keyPoints),
                nextSteps: summary.nextSteps,
                createdAt: summary.createdAt,
            })),
        }));

        return NextResponse.json({
            summaries: formattedSummaries,
            totalSessions: sessions.length,
        });
    } catch (error) {
        console.error("Error fetching summaries:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
