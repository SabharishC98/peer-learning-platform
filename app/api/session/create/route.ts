import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { notifySessionScheduled } from "@/lib/notifications";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { teacherId, skillName, scheduledTime, pointsCost = 10 } = body;

        if (!teacherId || !skillName || !scheduledTime) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Get student (current user)
        const student = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!student) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Check if student has enough points
        if (student.points < pointsCost) {
            return NextResponse.json(
                { error: "Insufficient points. Please purchase more points." },
                { status: 400 }
            );
        }

        // Verify teacher exists and has the skill
        const teacher = await prisma.user.findUnique({
            where: { id: teacherId },
            include: {
                skills: {
                    where: {
                        name: skillName,
                        verified: true,
                    },
                },
            },
        });

        if (!teacher || teacher.skills.length === 0) {
            return NextResponse.json(
                { error: "Teacher not found or skill not verified" },
                { status: 404 }
            );
        }

        // Create session and deduct points in a transaction
        const result = await prisma.$transaction(async (tx) => {
            // Deduct points from student
            await tx.user.update({
                where: { id: student.id },
                data: { points: { decrement: pointsCost } },
            });

            // Create transaction record
            await tx.transaction.create({
                data: {
                    userId: student.id,
                    type: "SPEND",
                    amount: -pointsCost,
                    description: `Scheduled session for ${skillName}`,
                },
            });

            // Create session
            const newSession = await tx.session.create({
                data: {
                    teacherId,
                    studentId: student.id,
                    skillName,
                    scheduledTime: new Date(scheduledTime),
                    pointsCost,
                    status: "PENDING",
                },
                include: {
                    teacher: true,
                    student: true,
                },
            });

            return newSession;
        });

        // Send notifications
        await notifySessionScheduled(
            student.id,
            teacherId,
            skillName,
            new Date(scheduledTime)
        );

        return NextResponse.json({
            success: true,
            session: result,
            message: "Session scheduled successfully!",
        });
    } catch (error) {
        console.error("Error creating session:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
