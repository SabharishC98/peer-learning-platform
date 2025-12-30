"use client";

import { useState } from "react";
import { Search as SearchIcon } from "lucide-react";
import { TeacherCard } from "@/components/search/TeacherCard";
import { Button } from "@/components/ui/Button";

export default function SearchPage() {
    const [skillName, setSkillName] = useState("");
    const [teachers, setTeachers] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!skillName.trim()) return;

        setLoading(true);
        try {
            const response = await fetch(`/api/match?skill=${encodeURIComponent(skillName)}`);
            const data = await response.json();
            setTeachers(data.teachers || []);
        } catch (error) {
            console.error("Search error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8">Find a Teacher</h1>

            {/* Search Form */}
            <form onSubmit={handleSearch} className="mb-8 max-w-2xl">
                <div className="relative">
                    <input
                        type="text"
                        value={skillName}
                        onChange={(e) => setSkillName(e.target.value)}
                        placeholder="What skill do you want to learn? (e.g., JavaScript, Python, React)"
                        className="w-full px-6 py-4 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 pl-14"
                    />
                    <SearchIcon className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Button
                        type="submit"
                        variant="primary"
                        className="absolute right-2 top-2 bottom-2"
                        isLoading={loading}
                    >
                        Search
                    </Button>
                </div>
            </form>

            {/* Results */}
            {teachers.length > 0 && (
                <div>
                    <h2 className="text-xl font-semibold mb-4">
                        Found {teachers.length} teacher{teachers.length !== 1 ? "s" : ""} for {skillName}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {teachers.map((teacher) => (
                            <TeacherCard key={teacher.id} teacher={teacher} skillName={skillName} />
                        ))}
                    </div>
                </div>
            )}

            {/* No Results */}
            {!loading && teachers.length === 0 && skillName && (
                <div className="text-center py-12">
                    <p className="text-gray-400 text-lg">
                        No teachers found for "{skillName}". Try searching for a different skill.
                    </p>
                </div>
            )}

            {/* Empty State */}
            {!skillName && (
                <div className="text-center py-12">
                    <SearchIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400 text-lg">
                        Search for a skill to find verified teachers
                    </p>
                </div>
            )}
        </div>
    );
}
