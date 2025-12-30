import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import ProfileView from "./ProfileView";

interface PageProps {
    params: {
        userId: string;
    };
}

export default async function UserProfilePage({ params }: PageProps) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        redirect("/api/auth/signin");
    }

    const currentUser = await prisma.user.findUnique({
        where: { email: session.user.email },
    });

    if (!currentUser) {
        redirect("/api/auth/signin");
    }

    // If userId is "me", redirect to own profile
    if (params.userId === "me") {
        redirect("/dashboard/profile");
    }

    // Fetch the target user's profile
    const targetUser = await prisma.user.findUnique({
        where: { id: params.userId },
        include: {
            skills: {
                include: {
                    skill: true,
                },
            },
            sessionsAsTeacher: {
                where: {
                    status: "COMPLETED",
                },
                include: {
                    student: true,
                },
            },
        },
    });

    if (!targetUser) {
        notFound();
    }

    // Calculate stats
    const skills = (targetUser as any).skills || [];
    const sessionsAsTeacher = (targetUser as any).sessionsAsTeacher || [];

    const verifiedSkills = skills.filter((us: any) => us.verified);
    const totalSessions = sessionsAsTeacher.length;

    // Calculate average rating
    const ratings = sessionsAsTeacher
        .map((s: any) => s.rating)
        .filter((r: any): r is number => r !== null);
    const averageRating = ratings.length > 0
        ? ratings.reduce((a: number, b: number) => a + b, 0) / ratings.length
        : 0;

    const profileData = {
        id: targetUser.id,
        name: targetUser.name || "Unknown User",
        email: targetUser.email,
        bio: targetUser.bio,
        avatar: targetUser.avatar,
        points: targetUser.points,
        skills: skills.map((us: any) => ({
            name: us.skill.name,
            verified: us.verified,
        })),
        verifiedSkillsCount: verifiedSkills.length,
        totalSessions,
        averageRating,
    };

    return (
        <ProfileView
            profile={profileData}
            isOwnProfile={false}
            currentUserId={currentUser.id}
        />
    );
}
