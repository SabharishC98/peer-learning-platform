import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { findBestMatches } from "@/lib/matching-algorithm";

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const skillName = searchParams.get("skill");

        if (!skillName) {
            return NextResponse.json({ error: "Skill name is required" }, { status: 400 });
        }

        // Get current user
        const currentUser = await prisma.user.findUnique({
            where: { email: session.user.email },
            include: {
                matchingProfile: true,
            },
        });

        if (!currentUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Find all teachers with the verified skill
        const teachers = await prisma.user.findMany({
            where: {
                skills: {
                    some: {
                        name: skillName,
                        verified: true,
                    },
                },
                id: {
                    not: currentUser.id, // Exclude current user
                },
            },
            include: {
                skills: {
                    where: { verified: true },
                },
                sessionsAsTeacher: {
                    where: {
                        status: "COMPLETED",
                        rating: { not: null },
                    },
                    select: {
                        rating: true,
                    },
                },
                matchingProfile: true,
            },
        });

        // Calculate match scores using AI algorithm
        const matches = findBestMatches(
            teachers.map(t => ({
                id: t.id,
                name: t.name || 'Unknown',
                skills: t.skills,
                sessionsAsTeacher: t.sessionsAsTeacher,
                matchingProfile: t.matchingProfile ? {
                    learningStyle: t.matchingProfile.learningStyle,
                    preferredPace: t.matchingProfile.preferredPace,
                    availability: t.matchingProfile.availability,
                } : undefined,
                points: t.points,
            })),
            {
                id: currentUser.id,
                matchingProfile: currentUser.matchingProfile ? {
                    learningStyle: currentUser.matchingProfile.learningStyle,
                    preferredPace: currentUser.matchingProfile.preferredPace,
                    availability: currentUser.matchingProfile.availability,
                    preferredLanguages: currentUser.matchingProfile.preferredLanguages,
                } : undefined,
            },
            skillName,
            20
        );

        // Combine teacher data with match scores
        const rankedTeachers = matches.map((match) => {
            const teacher = teachers.find((t) => t.id === match.teacherId);
            if (!teacher) return null;

            // Calculate average rating
            const ratings = teacher.sessionsAsTeacher
                .map((s) => s.rating)
                .filter((r): r is number => r !== null);
            const averageRating = ratings.length > 0
                ? ratings.reduce((a, b) => a + b, 0) / ratings.length
                : 0;

            return {
                id: teacher.id,
                name: teacher.name,
                email: teacher.email,
                bio: teacher.bio,
                avatar: teacher.avatar,
                points: teacher.points,
                skills: teacher.skills.map((s) => ({
                    name: s.name,
                    verified: s.verified,
                })),
                averageRating,
                totalSessions: teacher.sessionsAsTeacher.length,
                matchScore: match.score,
                matchBreakdown: match.breakdown,
            };
        }).filter(Boolean);

        return NextResponse.json({
            teachers: rankedTeachers,
            totalCount: rankedTeachers.length,
        });
    } catch (error) {
        console.error("Error matching teachers:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
