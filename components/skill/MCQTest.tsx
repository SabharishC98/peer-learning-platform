"use client";

import { useState, useEffect, useCallback } from "react";
import { CheckCircle2, Circle, Clock } from "lucide-react";
import { Button } from "../ui/Button";

interface MCQQuestion {
    id: string;
    question: string;
    options: string[];
    correctAnswer: number;
}

interface MCQTestProps {
    questions: MCQQuestion[];
    onSubmit: (answers: Record<string, number>) => void;
    timeLimit?: number; // in minutes
}

export function MCQTest({ questions, onSubmit, timeLimit = 30 }: MCQTestProps) {
    const [answers, setAnswers] = useState<Record<string, number>>({});
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [timeRemaining, setTimeRemaining] = useState(timeLimit * 60); // in seconds

    const handleSubmit = useCallback(() => {
        onSubmit(answers);
    }, [answers, onSubmit]);

    // Timer effect
    useEffect(() => {
        const interval = setInterval(() => {
            setTimeRemaining((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    handleSubmit();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [handleSubmit]);

    const selectAnswer = (questionId: string, optionIndex: number) => {
        setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    const currentQ = questions[currentQuestion];
    const progress = ((currentQuestion + 1) / questions.length) * 100;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-blue-400" />
                        <span className="text-lg font-semibold text-white">
                            {formatTime(timeRemaining)}
                        </span>
                    </div>
                    <span className="text-sm text-gray-400">
                        Question {currentQuestion + 1} of {questions.length}
                    </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            {/* Question */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-6">{currentQ.question}</h3>

                {/* Options */}
                <div className="space-y-3">
                    {currentQ.options.map((option, idx) => {
                        const isSelected = answers[currentQ.id] === idx;

                        return (
                            <button
                                key={idx}
                                onClick={() => selectAnswer(currentQ.id, idx)}
                                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${isSelected
                                    ? "border-blue-500 bg-blue-500/10"
                                    : "border-gray-700 hover:border-gray-600 bg-gray-900"
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    {isSelected ? (
                                        <CheckCircle2 className="w-5 h-5 text-blue-400 flex-shrink-0" />
                                    ) : (
                                        <Circle className="w-5 h-5 text-gray-600 flex-shrink-0" />
                                    )}
                                    <span className="text-gray-200">{option}</span>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between gap-4">
                <Button
                    variant="outline"
                    onClick={() => setCurrentQuestion((prev) => Math.max(0, prev - 1))}
                    disabled={currentQuestion === 0}
                >
                    Previous
                </Button>

                {/* Question Indicators */}
                <div className="flex gap-2 flex-wrap justify-center">
                    {questions.map((q, idx) => (
                        <button
                            key={q.id}
                            onClick={() => setCurrentQuestion(idx)}
                            className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${idx === currentQuestion
                                ? "bg-blue-600 text-white"
                                : answers[q.id] !== undefined
                                    ? "bg-green-600 text-white"
                                    : "bg-gray-700 text-gray-400 hover:bg-gray-600"
                                }`}
                        >
                            {idx + 1}
                        </button>
                    ))}
                </div>

                {currentQuestion === questions.length - 1 ? (
                    <Button variant="primary" onClick={handleSubmit}>
                        Submit Test
                    </Button>
                ) : (
                    <Button
                        variant="primary"
                        onClick={() => setCurrentQuestion((prev) => Math.min(questions.length - 1, prev + 1))}
                    >
                        Next
                    </Button>
                )}
            </div>

            {/* Summary */}
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Answered:</span>
                    <span className="text-white font-semibold">
                        {Object.keys(answers).length} / {questions.length}
                    </span>
                </div>
            </div>
        </div>
    );
}
