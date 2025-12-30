"use client";

import { useState } from "react";
import { TestContainer } from "@/components/skill/TestContainer";
import { motion } from "framer-motion";

interface SkillsClientProps {
    userId: string;
    availableSkills: string[];
}

export default function SkillsClient({ userId, availableSkills }: SkillsClientProps) {
    const [selectedSkill, setSelectedSkill] = useState<string | null>(null);

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8">Skill Verification</h1>

            {!selectedSkill ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {availableSkills.map((skill) => (
                        <motion.div
                            key={skill}
                            whileHover={{ scale: 1.02 }}
                            className="bg-gray-800 p-6 rounded-xl border border-gray-700 cursor-pointer hover:border-blue-500 transition-colors"
                            onClick={() => setSelectedSkill(skill)}
                        >
                            <h3 className="text-xl font-semibold mb-2">{skill}</h3>
                            <p className="text-gray-400 text-sm">
                                Take the assessment to become a verified teacher for {skill}.
                            </p>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div>
                    <button
                        onClick={() => setSelectedSkill(null)}
                        className="mb-6 text-gray-400 hover:text-white transition-colors"
                    >
                        ← Back to Skills
                    </button>
                    <TestContainer
                        skillName={selectedSkill}
                        userId={userId}
                        onComplete={() => {
                            alert("Skill verified! You can now teach this subject.");
                            setSelectedSkill(null);
                        }}
                    />
                </div>
            )}
        </div>
    );
}
