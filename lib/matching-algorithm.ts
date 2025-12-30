/**
 * AI-Powered Teacher-Student Matching Algorithm
 * Uses weighted scoring based on multiple factors
 */

interface Teacher {
    id: string;
    name: string;
    skills: Array<{ name: string; verified: boolean }>;
    sessionsAsTeacher: Array<{ rating: number | null }>;
    matchingProfile?: {
        learningStyle: string;
        preferredPace: string;
        availability: string;
    };
    points: number;
}

interface Student {
    id: string;
    matchingProfile?: {
        learningStyle: string;
        preferredPace: string;
        availability: string;
        preferredLanguages: string;
    };
}

interface MatchScore {
    teacherId: string;
    score: number;
    breakdown: {
        skillMatch: number;
        ratingScore: number;
        availabilityMatch: number;
        learningStyleMatch: number;
        paceMatch: number;
    };
}

/**
 * Calculate match score between a student and teacher
 */
function calculateMatchScore(teacher: Teacher, student: Student, skillName: string): MatchScore {
    let skillMatch = 0;
    let ratingScore = 0;
    let availabilityMatch = 0;
    let learningStyleMatch = 0;
    let paceMatch = 0;

    // 1. Skill Match (40% weight)
    const hasSkill = teacher.skills.some(
        (s) => s.name.toLowerCase() === skillName.toLowerCase() && s.verified
    );
    skillMatch = hasSkill ? 1.0 : 0.0;

    // 2. Rating Score (30% weight)
    const ratings = teacher.sessionsAsTeacher
        .map((s) => s.rating)
        .filter((r): r is number => r !== null);
    if (ratings.length > 0) {
        const avgRating = ratings.reduce((a, b) => a + b, 0) / ratings.length;
        ratingScore = avgRating / 5.0; // Normalize to 0-1
    } else {
        ratingScore = 0.5; // Neutral score for new teachers
    }

    // 3. Availability Match (10% weight)
    if (teacher.matchingProfile && student.matchingProfile) {
        try {
            const teacherAvail = JSON.parse(teacher.matchingProfile.availability || "[]");
            const studentAvail = JSON.parse(student.matchingProfile.availability || "[]");
            const overlap = teacherAvail.filter((slot: string) => studentAvail.includes(slot));
            availabilityMatch = overlap.length / Math.max(teacherAvail.length, 1);
        } catch {
            availabilityMatch = 0.5; // Default if parsing fails
        }
    } else {
        availabilityMatch = 0.5; // Default if no profile
    }

    // 4. Learning Style Match (10% weight)
    if (teacher.matchingProfile && student.matchingProfile) {
        learningStyleMatch =
            teacher.matchingProfile.learningStyle === student.matchingProfile.learningStyle
                ? 1.0
                : 0.3;
    } else {
        learningStyleMatch = 0.5;
    }

    // 5. Pace Match (10% weight)
    if (teacher.matchingProfile && student.matchingProfile) {
        paceMatch =
            teacher.matchingProfile.preferredPace === student.matchingProfile.preferredPace
                ? 1.0
                : 0.5;
    } else {
        paceMatch = 0.5;
    }

    // Calculate weighted total score
    const totalScore =
        skillMatch * 0.4 +
        ratingScore * 0.3 +
        availabilityMatch * 0.1 +
        learningStyleMatch * 0.1 +
        paceMatch * 0.1;

    return {
        teacherId: teacher.id,
        score: totalScore,
        breakdown: {
            skillMatch,
            ratingScore,
            availabilityMatch,
            learningStyleMatch,
            paceMatch,
        },
    };
}

/**
 * Find best matching teachers for a student
 */
export function findBestMatches(
    teachers: Teacher[],
    student: Student,
    skillName: string,
    limit: number = 10
): MatchScore[] {
    // Calculate scores for all teachers
    const scores = teachers.map((teacher) => calculateMatchScore(teacher, student, skillName));

    // Sort by score (descending) and return top matches
    return scores.sort((a, b) => b.score - a.score).slice(0, limit);
}

/**
 * Get match quality label
 */
export function getMatchQuality(score: number): {
    label: string;
    color: string;
    description: string;
} {
    if (score >= 0.8) {
        return {
            label: "Excellent Match",
            color: "green",
            description: "Highly compatible based on skills, style, and availability",
        };
    } else if (score >= 0.6) {
        return {
            label: "Good Match",
            color: "blue",
            description: "Well-suited for your learning needs",
        };
    } else if (score >= 0.4) {
        return {
            label: "Fair Match",
            color: "yellow",
            description: "May work well with some adjustments",
        };
    } else {
        return {
            label: "Low Match",
            color: "gray",
            description: "Consider other options for better compatibility",
        };
    }
}

/**
 * Generate availability time slots
 * Helper function for creating availability arrays
 */
export function generateTimeSlots(): Array<{ value: string; label: string }> {
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const times = ["Morning (6-12)", "Afternoon (12-18)", "Evening (18-24)"];

    const slots: Array<{ value: string; label: string }> = [];

    days.forEach((day) => {
        times.forEach((time) => {
            const value = `${day.substring(0, 3)}_${time.split(" ")[0].toLowerCase()}`;
            const label = `${day} ${time}`;
            slots.push({ value, label });
        });
    });

    return slots;
}
