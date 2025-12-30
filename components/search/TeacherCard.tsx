"use client";

import { Star, Award, TrendingUp } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/Button";

interface Teacher {
    id: string;
    name: string;
    bio?: string;
    avatar?: string;
    skills: Array<{ name: string; verified: boolean }>;
    points: number;
    averageRating?: number;
    totalSessions?: number;
    matchScore?: number;
}

interface TeacherCardProps {
    teacher: Teacher;
    skillName: string;
}

export function TeacherCard({ teacher, skillName }: TeacherCardProps) {
    const rating = teacher.averageRating || 0;
    const matchScore = teacher.matchScore || 0;

    const getMatchColor = (score: number) => {
        if (score >= 0.8) return "text-green-400 bg-green-500/20";
        if (score >= 0.6) return "text-blue-400 bg-blue-500/20";
        if (score >= 0.4) return "text-yellow-400 bg-yellow-500/20";
        return "text-gray-400 bg-gray-500/20";
    };

    const getMatchLabel = (score: number) => {
        if (score >= 0.8) return "Excellent Match";
        if (score >= 0.6) return "Good Match";
        if (score >= 0.4) return "Fair Match";
        return "Low Match";
    };

    return (
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 hover:border-gray-600 transition-all">
            <div className="flex items-start gap-4 mb-4">
                {/* Avatar */}
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                    {teacher.name.charAt(0).toUpperCase()}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-semibold text-white truncate">{teacher.name}</h3>
                        {teacher.skills.some((s) => s.verified && s.name === skillName) && (
                            <Award className="w-5 h-5 text-blue-400 flex-shrink-0" title="Verified Skill" />
                        )}
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    className={`w-4 h-4 ${star <= rating
                                            ? "fill-yellow-400 text-yellow-400"
                                            : "text-gray-600"
                                        }`}
                                />
                            ))}
                        </div>
                        <span className="text-sm text-gray-400">
                            {rating.toFixed(1)} ({teacher.totalSessions || 0} sessions)
                        </span>
                    </div>

                    {/* Bio */}
                    {teacher.bio && (
                        <p className="text-sm text-gray-400 line-clamp-2">{teacher.bio}</p>
                    )}
                </div>
            </div>

            {/* Match Score */}
            {matchScore > 0 && (
                <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-400">AI Match Score</span>
                        </div>
                        <span className={`text-sm font-semibold px-2 py-1 rounded ${getMatchColor(matchScore)}`}>
                            {getMatchLabel(matchScore)}
                        </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all"
                            style={{ width: `${matchScore * 100}%` }}
                        />
                    </div>
                </div>
            )}

            {/* Skills */}
            <div className="mb-4">
                <div className="flex flex-wrap gap-2">
                    {teacher.skills.slice(0, 4).map((skill, idx) => (
                        <span
                            key={idx}
                            className={`px-3 py-1 rounded-full text-xs font-medium ${skill.name === skillName
                                    ? "bg-blue-500/20 text-blue-400 border border-blue-500/50"
                                    : "bg-gray-700 text-gray-300"
                                }`}
                        >
                            {skill.name}
                        </span>
                    ))}
                    {teacher.skills.length > 4 && (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-700 text-gray-300">
                            +{teacher.skills.length - 4} more
                        </span>
                    )}
                </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
                <Link href={`/dashboard/profile/${teacher.id}`} className="flex-1">
                    <Button variant="outline" className="w-full">
                        View Profile
                    </Button>
                </Link>
                <Link href={`/dashboard/schedule?teacher=${teacher.id}&skill=${skillName}`} className="flex-1">
                    <Button variant="primary" className="w-full">
                        Schedule Session
                    </Button>
                </Link>
            </div>
        </div>
    );
}
