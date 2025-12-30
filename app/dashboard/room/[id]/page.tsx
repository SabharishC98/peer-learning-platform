import { VideoRoom } from "@/components/room/VideoRoom";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function RoomPage({ params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        redirect("/login");
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
    });

    if (!user) {
        redirect("/login");
    }

    // Get session details
    const sessionData = await prisma.session.findUnique({
        where: { id: params.id },
        include: {
            teacher: true,
            student: true,
        },
    });

    if (!sessionData) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Session Not Found</h1>
                    <p className="text-gray-400">This session does not exist or has been cancelled.</p>
                </div>
            </div>
        );
    }

    const isTeacher = sessionData.teacherId === user.id;

    return (
        <VideoRoom
            sessionId={params.id}
            userId={user.id}
            userName={user.name || "User"}
            isTeacher={isTeacher}
        />
    );
}
