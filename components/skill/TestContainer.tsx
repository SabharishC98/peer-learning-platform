"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, AlertTriangle, Info } from "lucide-react";

interface TestContainerProps {
    skillName: string;
    userId: string;
    onComplete: () => void;
}

export function TestContainer({ skillName, userId, onComplete }: TestContainerProps) {
    const [code, setCode] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [result, setResult] = useState<{
        verified: boolean;
        message?: string;
        score?: number;
        maxScore?: number;
        plagiarismScore?: number;
        error?: string;
    } | null>(null);

    const handleSubmit = async () => {
        if (!code.trim()) {
            setResult({ verified: false, message: "Please write some code before submitting" });
            return;
        }

        setSubmitting(true);
        setResult(null);

        try {
            const res = await fetch("/api/skills/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId,
                    skillName,
                    codingAnswer: code,
                    mcqAnswers: {}, // Mock MCQ answers
                    language: "javascript",
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setResult({
                    verified: false,
                    error: data.error || "Failed to verify skill",
                    message: data.message
                });
                return;
            }

            setResult(data);

            if (data.verified) {
                setTimeout(onComplete, 2000);
            }
        } catch (e) {
            console.error("Verification error:", e);
            setResult({
                verified: false,
                error: "Network error. Please check your connection and try again."
            });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-xl font-semibold mb-4 text-blue-400">Skill Test: {skillName}</h3>

            <div className="mb-6">
                <p className="text-gray-300 mb-2">1. Write a function to reverse a string.</p>
                <textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full h-40 bg-gray-900 text-gray-100 font-mono p-4 rounded-lg border border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="function reverseString(str) {&#10;  // Your code here&#10;  return str.split('').reverse().join('');&#10;}"
                />
                <p className="text-xs text-gray-500 mt-1">
                    *Plagiarism check enabled. Do not copy-paste from external sources.
                </p>
            </div>

            {result && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4 space-y-3"
                >
                    {/* Main Result */}
                    <div
                        className={`p-4 rounded-lg flex items-start gap-3 ${result.verified
                                ? "bg-green-500/10 border border-green-500/30"
                                : "bg-red-500/10 border border-red-500/30"
                            }`}
                    >
                        {result.verified ? (
                            <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                        ) : (
                            <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                        )}
                        <div className="flex-1">
                            <p className={result.verified ? "text-green-400" : "text-red-400"}>
                                {result.verified ? "✓ Skill Verified Successfully!" : "✗ Verification Failed"}
                            </p>
                            {result.message && (
                                <p className="text-sm text-gray-300 mt-1">{result.message}</p>
                            )}
                            {result.error && (
                                <p className="text-sm text-red-300 mt-1">{result.error}</p>
                            )}
                        </div>
                    </div>

                    {/* Score Details */}
                    {result.score !== undefined && result.maxScore !== undefined && (
                        <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                            <div className="flex items-center gap-2 mb-2">
                                <Info className="w-4 h-4 text-blue-400" />
                                <span className="text-sm font-semibold text-gray-300">Score Details</span>
                            </div>
                            <div className="space-y-1 text-sm">
                                <div className="flex justify-between text-gray-400">
                                    <span>Your Score:</span>
                                    <span className="text-white font-semibold">{result.score} / {result.maxScore}</span>
                                </div>
                                <div className="flex justify-between text-gray-400">
                                    <span>Percentage:</span>
                                    <span className="text-white font-semibold">
                                        {Math.round((result.score / result.maxScore) * 100)}%
                                    </span>
                                </div>
                                <div className="flex justify-between text-gray-400">
                                    <span>Required to Pass:</span>
                                    <span className="text-white font-semibold">70%</span>
                                </div>
                                {result.plagiarismScore !== undefined && (
                                    <div className="flex justify-between text-gray-400">
                                        <span>Plagiarism Score:</span>
                                        <span className={`font-semibold ${result.plagiarismScore > 0.7 ? "text-red-400" : "text-green-400"
                                            }`}>
                                            {Math.round(result.plagiarismScore * 100)}%
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </motion.div>
            )}

            <button
                onClick={handleSubmit}
                disabled={submitting || !code.trim()}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {submitting ? "Verifying..." : "Submit Test"}
            </button>
        </div>
    );
}
