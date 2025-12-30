"use client";

import { Star, Award, Calendar, TrendingUp } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

interface ProfileData {
    id: string;
    name: string;
    email: string;
    bio?: string | null;
    avatar?: string | null;
    points: number;
    skills: Array<{ name: string; verified: boolean }>;
    verifiedSkillsCount: number;
    totalSessions: number;
    averageRating: number;
}

interface ProfileViewProps {
    profile: ProfileData;
    isOwnProfile: boolean;
    currentUserId: string;
}

export default function ProfileView({ profile, isOwnProfile }: ProfileViewProps) {
    return (
        <div>
            <h1 className="text-3xl font-bold mb-8">
                {isOwnProfile ? "My Profile" : `${profile.name}'s Profile`}
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Profile Card */}
                <div className="lg:col-span-1">
                    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                        {/* Avatar */}
                        <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-5xl font-bold">
                            {profile.name.charAt(0).toUpperCase()}
                        </div>

                        {/* Name */}
                        <h2 className="text-2xl font-bold text-center mb-2">{profile.name}</h2>

                        {/* Email (only show for own profile) */}
                        {isOwnProfile && (
                            <p className="text-gray-400 text-center text-sm mb-4">{profile.email}</p>
                        )}

                        {/* Bio */}
                        {profile.bio && (
                            <p className="text-gray-300 text-center mb-4">{profile.bio}</p>
                        )}

                        {/* Stats */}
                        <div className="grid grid-cols-2 gap-4 mt-6">
                            <div className="bg-gray-900 rounded-lg p-4 text-center">
                                <div className="text-2xl font-bold text-yellow-400">{profile.points}</div>
                                <div className="text-xs text-gray-400 mt-1">Points</div>
                            </div>
                            <div className="bg-gray-900 rounded-lg p-4 text-center">
                                <div className="text-2xl font-bold text-blue-400">{profile.verifiedSkillsCount}</div>
                                <div className="text-xs text-gray-400 mt-1">Verified Skills</div>
                            </div>
                        </div>

                        {/* Teacher Stats */}
                        {profile.totalSessions > 0 && (
                            <div className="mt-4 space-y-3">
                                <div className="flex items-center justify-between bg-gray-900 rounded-lg p-3">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-gray-400" />
                                        <span className="text-sm text-gray-400">Sessions</span>
                                    </div>
                                    <span className="font-semibold">{profile.totalSessions}</span>
                                </div>
                                <div className="flex items-center justify-between bg-gray-900 rounded-lg p-3">
                                    <div className="flex items-center gap-2">
                                        <Star className="w-4 h-4 text-yellow-400" />
                                        <span className="text-sm text-gray-400">Rating</span>
                                    </div>
                                    <span className="font-semibold">{profile.averageRating.toFixed(1)}</span>
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        {!isOwnProfile && (
                            <div className="mt-6">
                                <Link href={`/dashboard/schedule?teacher=${profile.id}`}>
                                    <Button variant="primary" className="w-full">
                                        Schedule Session
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Skills Section */}
                <div className="lg:col-span-2">
                    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                            <Award className="w-6 h-6 text-blue-400" />
                            Skills
                        </h3>

                        {profile.skills.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {profile.skills.map((skill, idx) => (
                                    <div
                                        key={idx}
                                        className={`p-4 rounded-lg border ${skill.verified
                                            ? "bg-blue-500/10 border-blue-500/50"
                                            : "bg-gray-700 border-gray-600"
                                            }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="font-medium">{skill.name}</span>
                                            {skill.verified && (
                                                <Award className="w-5 h-5 text-blue-400" />
                                            )}
                                        </div>
                                        <div className="text-xs text-gray-400 mt-1">
                                            {skill.verified ? "Verified Teacher" : "Learning"}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-400">
                                No skills added yet
                            </div>
                        )}
                    </div>

                    {/* Performance Section (only for teachers with sessions) */}
                    {profile.totalSessions > 0 && (
                        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mt-6">
                            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                <TrendingUp className="w-6 h-6 text-green-400" />
                                Teaching Performance
                            </h3>

                            <div className="space-y-4">
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm text-gray-400">Average Rating</span>
                                        <span className="font-semibold">{profile.averageRating.toFixed(1)} / 5.0</span>
                                    </div>
                                    <div className="w-full bg-gray-700 rounded-full h-2">
                                        <div
                                            className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-2 rounded-full"
                                            style={{ width: `${(profile.averageRating / 5) * 100}%` }}
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center gap-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                            key={star}
                                            className={`w-6 h-6 ${star <= profile.averageRating
                                                ? "fill-yellow-400 text-yellow-400"
                                                : "text-gray-600"
                                                }`}
                                        />
                                    ))}
                                </div>

                                <div className="bg-gray-900 rounded-lg p-4">
                                    <div className="text-sm text-gray-400 mb-1">Total Sessions Taught</div>
                                    <div className="text-3xl font-bold text-green-400">{profile.totalSessions}</div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
