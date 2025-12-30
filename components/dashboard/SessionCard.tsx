"use client";

import { Calendar, Clock, User, Video } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/Button";

interface Session {
    id: string;
    skillName: string;
    scheduledTime: Date;
    status: string;
    teacher?: { name: string; id: string };
    student?: { name: string; id: string };
}

interface SessionCardProps {
    session: Session;
    userRole: "teacher" | "student";
}

export function SessionCard({ session, userRole }: SessionCardProps) {
    const otherPerson = userRole === "teacher" ? session.student : session.teacher;
    const scheduledDate = new Date(session.scheduledTime);
    const isUpcoming = scheduledDate > new Date();
    const canJoin = session.status === "PENDING" && Math.abs(scheduledDate.getTime() - Date.now()) < 15 * 60 * 1000;

    const statusColors = {
        PENDING: "bg-yellow-500/20 text-yellow-400",
        ACTIVE: "bg-green-500/20 text-green-400",
        COMPLETED: "bg-blue-500/20 text-blue-400",
        CANCELLED: "bg-red-500/20 text-red-400",
    };

    return (
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 hover:border-gray-600 transition-all">
            <div className="flex items-start justify-between mb-4">
                <div>
                    <h3 className="text-lg font-semibold text-white mb-1">{session.skillName}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                        <User className="w-4 h-4" />
                        <span>
                            {userRole === "teacher" ? "Student" : "Teacher"}: {otherPerson?.name || "Unknown"}
                        </span>
                    </div>
                </div>
                <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[session.status as keyof typeof statusColors] || statusColors.PENDING
                        }`}
                >
                    {session.status}
                </span>
            </div>

            <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Calendar className="w-4 h-4" />
                    <span>{scheduledDate.toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Clock className="w-4 h-4" />
                    <span>{scheduledDate.toLocaleTimeString()}</span>
                </div>
            </div>

            <div className="flex gap-2">
                {canJoin && (
                    <Link href={`/dashboard/room/${session.id}`} className="flex-1">
                        <Button variant="primary" className="w-full">
                            <Video className="w-4 h-4 mr-2" />
                            Join Session
                        </Button>
                    </Link>
                )}
                {session.status === "COMPLETED" && (
                    <Link href={`/dashboard/sessions/${session.id}`} className="flex-1">
                        <Button variant="outline" className="w-full">
                            View Summary
                        </Button>
                    </Link>
                )}
                {!canJoin && session.status === "PENDING" && isUpcoming && (
                    <Button variant="outline" className="w-full" disabled>
                        Scheduled
                    </Button>
                )}
            </div>
        </div>
    );
}
