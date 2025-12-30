/**
 * AI-Powered Session Summary Generation
 * In production, this would use OpenAI API or similar
 * For demo purposes, we use template-based generation with smart extraction
 */

interface SessionData {
    skillName: string;
    duration: number; // in minutes
    teacherName: string;
    studentName: string;
    messages?: Array<{ sender: string; content: string }>;
}

interface SessionSummary {
    content: string;
    keyPoints: string[];
    nextSteps: string;
}

/**
 * Generate AI-powered session summary
 * In production, replace with actual OpenAI API call
 */
export async function generateSessionSummary(data: SessionData): Promise<SessionSummary> {
    // Simulate AI processing delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Extract key topics from messages (simple keyword extraction)
    const keyTopics = extractKeyTopics(data.messages || []);

    // Generate summary content
    const content = `This ${data.duration}-minute session focused on ${data.skillName}. ${data.teacherName} guided ${data.studentName} through key concepts and practical applications. The session covered ${keyTopics.length > 0 ? keyTopics.slice(0, 3).join(", ") : "fundamental concepts"}, with hands-on examples and interactive discussion. The student demonstrated good understanding and asked insightful questions.`;

    // Generate key learning points
    const keyPoints = [
        `Covered core concepts of ${data.skillName}`,
        `Practiced with real-world examples`,
        `Addressed specific questions and challenges`,
        ...keyTopics.slice(0, 2).map((topic) => `Explored ${topic} in detail`),
    ].slice(0, 4);

    // Generate next steps
    const nextSteps = `Continue practicing ${data.skillName} concepts. Review the topics covered today and try implementing similar solutions independently. Schedule a follow-up session to dive deeper into advanced topics.`;

    return {
        content,
        keyPoints,
        nextSteps,
    };
}

/**
 * Extract key topics from chat messages
 */
function extractKeyTopics(messages: Array<{ sender: string; content: string }>): string[] {
    // Common programming/learning keywords
    const keywords = [
        "algorithm",
        "function",
        "variable",
        "loop",
        "array",
        "object",
        "class",
        "method",
        "API",
        "database",
        "async",
        "promise",
        "component",
        "state",
        "props",
        "hook",
        "routing",
        "authentication",
        "optimization",
        "debugging",
        "testing",
        "deployment",
    ];

    const topicCounts: Record<string, number> = {};

    // Count keyword occurrences
    messages.forEach((msg) => {
        const lowerContent = msg.content.toLowerCase();
        keywords.forEach((keyword) => {
            if (lowerContent.includes(keyword)) {
                topicCounts[keyword] = (topicCounts[keyword] || 0) + 1;
            }
        });
    });

    // Sort by frequency and return top topics
    return Object.entries(topicCounts)
        .sort((a, b) => b[1] - a[1])
        .map(([topic]) => topic)
        .slice(0, 5);
}

/**
 * Generate personalized learning recommendations
 */
export function generateRecommendations(
    skillName: string,
    sessionCount: number,
    averageRating: number
): string[] {
    const recommendations: string[] = [];

    if (sessionCount < 3) {
        recommendations.push(`Continue building foundation in ${skillName}`);
        recommendations.push("Practice daily for 30 minutes to reinforce concepts");
    } else if (sessionCount < 10) {
        recommendations.push(`Start working on intermediate ${skillName} projects`);
        recommendations.push("Join online communities to learn from peers");
    } else {
        recommendations.push(`Consider teaching ${skillName} to solidify your expertise`);
        recommendations.push("Explore advanced topics and specializations");
    }

    if (averageRating >= 4.5) {
        recommendations.push("Your progress is excellent! Keep up the great work");
    } else if (averageRating >= 3.5) {
        recommendations.push("Consider scheduling more frequent sessions for faster progress");
    }

    return recommendations;
}
