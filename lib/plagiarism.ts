/**
 * Plagiarism Detection Utility
 * Uses multiple techniques to detect code similarity:
 * 1. Levenshtein distance for exact matches
 * 2. Token-based comparison (normalized)
 * 3. Structure similarity
 */

// Calculate Levenshtein distance between two strings
function levenshteinDistance(str1: string, str2: string): number {
    const matrix: number[][] = [];

    for (let i = 0; i <= str2.length; i++) {
        matrix[i] = [i];
    }

    for (let j = 0; j <= str1.length; j++) {
        matrix[0][j] = j;
    }

    for (let i = 1; i <= str2.length; i++) {
        for (let j = 1; j <= str1.length; j++) {
            if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1,
                    matrix[i][j - 1] + 1,
                    matrix[i - 1][j] + 1
                );
            }
        }
    }

    return matrix[str2.length][str1.length];
}

// Normalize code by removing comments, whitespace, and standardizing formatting
function normalizeCode(code: string): string {
    return code
        .replace(/\/\/.*$/gm, "") // Remove single-line comments
        .replace(/\/\*[\s\S]*?\*\//g, "") // Remove multi-line comments
        .replace(/\s+/g, " ") // Normalize whitespace
        .replace(/\s*([{}();,=+\-*/<>])\s*/g, "$1") // Remove spaces around operators
        .toLowerCase()
        .trim();
}

// Tokenize code into meaningful tokens
function tokenizeCode(code: string): string[] {
    const normalized = normalizeCode(code);
    // Split by common delimiters but keep them
    return normalized.match(/[a-z_][a-z0-9_]*|[0-9]+|[{}();,=+\-*/<>]/gi) || [];
}

// Calculate similarity score between two code snippets
function calculateSimilarity(code1: string, code2: string): number {
    const norm1 = normalizeCode(code1);
    const norm2 = normalizeCode(code2);

    if (norm1.length === 0 || norm2.length === 0) return 0;

    // Calculate Levenshtein-based similarity
    const distance = levenshteinDistance(norm1, norm2);
    const maxLength = Math.max(norm1.length, norm2.length);
    const levenshteinSimilarity = 1 - distance / maxLength;

    // Calculate token-based similarity
    const tokens1 = tokenizeCode(code1);
    const tokens2 = tokenizeCode(code2);
    const tokenSet1 = new Set(tokens1);
    const tokenSet2 = new Set(tokens2);
    const intersection = new Set([...tokenSet1].filter((x) => tokenSet2.has(x)));
    const union = new Set([...tokenSet1, ...tokenSet2]);
    const tokenSimilarity = union.size > 0 ? intersection.size / union.size : 0;

    // Weighted average (60% Levenshtein, 40% token similarity)
    return levenshteinSimilarity * 0.6 + tokenSimilarity * 0.4;
}

// Database of known solutions (in production, this would be a real database)
// Note: Common test questions should NOT be in this database
const knownSolutions: Record<string, string[]> = {
    javascript: [
        `function fibonacci(n) { if (n <= 1) return n; return fibonacci(n - 1) + fibonacci(n - 2); }`,
        `function isPalindrome(str) { const cleaned = str.toLowerCase().replace(/[^a-z0-9]/g, ''); return cleaned === cleaned.split('').reverse().join(''); }`,
        // Removed reverseString as it's a common test question
    ],
    python: [
        `def fibonacci(n):\n    if n <= 1:\n        return n\n    return fibonacci(n - 1) + fibonacci(n - 2)`,
        `def is_palindrome(s):\n    cleaned = ''.join(c.lower() for c in s if c.isalnum())\n    return cleaned == cleaned[::-1]`,
        // Removed reverse_string as it's a common test question
    ],
};

/**
 * Check code for plagiarism against known solutions
 * Returns a score from 0.0 (no plagiarism) to 1.0 (100% plagiarism)
 */
export async function checkPlagiarism(
    code: string,
    language: string = "javascript"
): Promise<{ score: number; matches: Array<{ similarity: number; source: string }> }> {
    const solutions = knownSolutions[language.toLowerCase()] || [];
    const matches: Array<{ similarity: number; source: string }> = [];

    for (const solution of solutions) {
        const similarity = calculateSimilarity(code, solution);
        if (similarity > 0.6) {
            // Only report significant matches (increased from 0.5)
            matches.push({
                similarity,
                source: "Known Solution Database",
            });
        }
    }

    // Overall plagiarism score is the highest similarity found
    const maxSimilarity = matches.length > 0 ? Math.max(...matches.map((m) => m.similarity)) : 0;

    return {
        score: maxSimilarity,
        matches: matches.sort((a, b) => b.similarity - a.similarity),
    };
}

/**
 * Check if code passes plagiarism threshold
 * Threshold: 0.85 (85% similarity is considered plagiarism)
 * Increased from 0.7 to be more lenient with common coding patterns
 */
export function isPlagiarized(plagiarismScore: number): boolean {
    return plagiarismScore >= 0.85;
}
