import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { checkPlagiarism, isPlagiarized } from "@/lib/plagiarism";
import { notifySkillVerified } from "@/lib/notifications";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        const body = await req.json();
        const { userId, skillName, codingAnswer, mcqAnswers, language = "javascript" } = body;

        if (!userId || !skillName) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        let totalScore = 0;
        let maxScore = 0;
        let plagiarismScore = 0;

        // 1. Check Coding Answer (if provided)
        if (codingAnswer) {
            maxScore += 50; // Coding is worth 50 points

            // Plagiarism check
            const plagiarismResult = await checkPlagiarism(codingAnswer, language);
            plagiarismScore = plagiarismResult.score;

            if (isPlagiarized(plagiarismScore)) {
                // Save failed test submission
                await prisma.testSubmission.create({
                    data: {
                        userId,
                        skillId: "temp", // Will be updated if skill exists
                        testType: "CODING",
                        answers: JSON.stringify({ code: codingAnswer }),
                        score: 0,
                        passed: false,
                        plagiarismScore,
                    },
                });

                return NextResponse.json({
                    verified: false,
                    message: "Plagiarism detected. Please write original code.",
                    plagiarismScore,
                    matches: plagiarismResult.matches,
                });
            }

            // Simple code quality check (has function, reasonable length)
            const hasFunction = /function|=>|def\s+\w+/.test(codingAnswer);
            const hasReasonableLength = codingAnswer.length > 20;

            if (hasFunction && hasReasonableLength) {
                totalScore += 50; // Full points for coding
            } else {
                totalScore += 25; // Partial credit
            }
        }

        // 2. Check MCQ Answers (if provided)
        if (mcqAnswers && typeof mcqAnswers === "object") {
            const mcqCount = Object.keys(mcqAnswers).length;
            maxScore += mcqCount * 10; // Each MCQ worth 10 points

            // In a real app, we'd fetch correct answers from database
            // For now, we'll give partial credit
            totalScore += mcqCount * 7; // Assume 70% correct
        }

        // 3. Determine if passed (need 70% to pass)
        const passed = maxScore > 0 && (totalScore / maxScore) >= 0.7;

        // 4. Create or update skill
        let skill = await prisma.skill.findFirst({
            where: {
                userId,
                name: skillName,
            },
        });

        if (passed) {
            if (skill) {
                // Update existing skill
                skill = await prisma.skill.update({
                    where: { id: skill.id },
                    data: {
                        verified: true,
                        verifiedAt: new Date(),
                    },
                });
            } else {
                // Create new verified skill
                skill = await prisma.skill.create({
                    data: {
                        name: skillName,
                        verified: true,
                        verifiedAt: new Date(),
                        userId,
                    },
                });
            }

            // Send notification
            await notifySkillVerified(userId, skillName);
        }

        // 5. Save test submission
        if (skill) {
            await prisma.testSubmission.create({
                data: {
                    userId,
                    skillId: skill.id,
                    testType: codingAnswer ? "CODING" : "MCQ",
                    answers: JSON.stringify({
                        coding: codingAnswer,
                        mcq: mcqAnswers,
                    }),
                    score: totalScore,
                    passed,
                    plagiarismScore,
                },
            });
        }

        return NextResponse.json({
            verified: passed,
            score: totalScore,
            maxScore,
            plagiarismScore,
            message: passed
                ? "Congratulations! Your skill has been verified."
                : "You need at least 70% to pass. Please try again.",
        });
    } catch (error) {
        console.error("Verification error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
