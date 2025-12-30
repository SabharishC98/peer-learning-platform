import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            include: {
                skills: {
                    where: {
                        verified: true,
                    },
                },
                sessionsAsTeacher: {
                    where: {
                        status: "COMPLETED",
                    },
                },
                sessionsAsStudent: {
                    where: {
                        status: "COMPLETED",
                    },
                },
            },
        });

        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        const userWithRelations = user as any;

        return NextResponse.json({
            success: true,
            verifiedSkills: (userWithRelations.skills || []).length,
            sessionsTaught: (userWithRelations.sessionsAsTeacher || []).length,
            sessionsAttended: (userWithRelations.sessionsAsStudent || []).length,
        });
    } catch (error) {
        console.error("Error fetching profile stats:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
