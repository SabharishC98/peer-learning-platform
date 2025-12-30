import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Sample test questions database
const TEST_QUESTIONS: Record<string, any> = {
    javascript: {
        coding: [
            {
                id: "js-1",
                question:
                    "Write a function called 'reverseString' that takes a string as input and returns the reversed string. For example, reverseString('hello') should return 'olleh'.",
                language: "javascript",
                testCases: [
                    { input: "'hello'", expected: "'olleh'" },
                    { input: "'world'", expected: "'dlrow'" },
                    { input: "'a'", expected: "'a'" },
                ],
                correctAnswer: "function reverseString(str) { return str.split('').reverse().join(''); }",
            },
        ],
        mcq: [
            {
                id: "js-mcq-1",
                question: "What is the output of: console.log(typeof null)?",
                options: ["'null'", "'undefined'", "'object'", "'number'"],
                correctAnswer: 2,
            },
            {
                id: "js-mcq-2",
                question: "Which method is used to add elements to the end of an array?",
                options: ["push()", "pop()", "shift()", "unshift()"],
                correctAnswer: 0,
            },
            {
                id: "js-mcq-3",
                question: "What does '===' check for?",
                options: [
                    "Value only",
                    "Type only",
                    "Both value and type",
                    "Neither value nor type",
                ],
                correctAnswer: 2,
            },
        ],
    },
    python: {
        coding: [
            {
                id: "py-1",
                question:
                    "Write a function called 'is_palindrome' that takes a string and returns True if it's a palindrome (reads the same forwards and backwards), False otherwise. Ignore case and spaces.",
                language: "python",
                testCases: [
                    { input: "'racecar'", expected: "True" },
                    { input: "'hello'", expected: "False" },
                    { input: "'A man a plan a canal Panama'", expected: "True" },
                ],
                correctAnswer:
                    "def is_palindrome(s):\n    cleaned = ''.join(c.lower() for c in s if c.isalnum())\n    return cleaned == cleaned[::-1]",
            },
        ],
        mcq: [
            {
                id: "py-mcq-1",
                question: "Which of the following is a mutable data type in Python?",
                options: ["tuple", "string", "list", "int"],
                correctAnswer: 2,
            },
            {
                id: "py-mcq-2",
                question: "What is the output of: print(2 ** 3)?",
                options: ["5", "6", "8", "9"],
                correctAnswer: 2,
            },
        ],
    },
    react: {
        coding: [
            {
                id: "react-1",
                question:
                    "Write a React component called 'Counter' that displays a count and has buttons to increment and decrement it.",
                language: "javascript",
                testCases: [
                    { input: "Initial render", expected: "Count: 0" },
                    { input: "After increment", expected: "Count: 1" },
                ],
                correctAnswer:
                    "function Counter() { const [count, setCount] = useState(0); return <div><p>Count: {count}</p><button onClick={() => setCount(count + 1)}>+</button><button onClick={() => setCount(count - 1)}>-</button></div>; }",
            },
        ],
        mcq: [
            {
                id: "react-mcq-1",
                question: "Which hook is used for side effects in React?",
                options: ["useState", "useEffect", "useContext", "useReducer"],
                correctAnswer: 1,
            },
            {
                id: "react-mcq-2",
                question: "What is the virtual DOM?",
                options: [
                    "A copy of the real DOM kept in memory",
                    "A database for React",
                    "A testing framework",
                    "A CSS framework",
                ],
                correctAnswer: 0,
            },
        ],
    },
};

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const skillName = searchParams.get("skill");

        if (!skillName) {
            return NextResponse.json({ error: "Skill name is required" }, { status: 400 });
        }

        const normalizedSkill = skillName.toLowerCase();
        const questions = TEST_QUESTIONS[normalizedSkill];

        if (!questions) {
            return NextResponse.json(
                { error: "No test available for this skill" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            skill: skillName,
            coding: questions.coding,
            mcq: questions.mcq,
        });
    } catch (error) {
        console.error("Error fetching test:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
