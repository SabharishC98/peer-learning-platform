"use client";

import { useState } from "react";
import { Code2, Play } from "lucide-react";
import { Button } from "../ui/Button";

interface CodeEditorProps {
    question: string;
    language: string;
    onSubmit: (code: string) => void;
    testCases?: Array<{ input: string; expected: string }>;
}

export function CodeEditor({ question, language, onSubmit, testCases }: CodeEditorProps) {
    const [code, setCode] = useState("");
    const [output, setOutput] = useState("");
    const [isRunning, setIsRunning] = useState(false);

    const runCode = () => {
        setIsRunning(true);
        setOutput("Running tests...\n");

        // Simulate code execution
        setTimeout(() => {
            if (testCases && testCases.length > 0) {
                let results = "";
                testCases.forEach((test, idx) => {
                    results += `Test ${idx + 1}: ${Math.random() > 0.3 ? "✓ Passed" : "✗ Failed"}\n`;
                });
                setOutput(results);
            } else {
                setOutput("Code executed successfully!\n");
            }
            setIsRunning(false);
        }, 1500);
    };

    return (
        <div className="space-y-4">
            {/* Question */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <div className="flex items-center gap-2 mb-3">
                    <Code2 className="w-5 h-5 text-blue-400" />
                    <h3 className="font-semibold text-white">Coding Challenge</h3>
                </div>
                <p className="text-gray-300 leading-relaxed">{question}</p>
            </div>

            {/* Code Editor */}
            <div className="bg-gray-900 rounded-lg border border-gray-700 overflow-hidden">
                <div className="bg-gray-800 px-4 py-2 border-b border-gray-700 flex items-center justify-between">
                    <span className="text-sm text-gray-400">{language}</span>
                    <div className="flex gap-2">
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={runCode}
                            isLoading={isRunning}
                        >
                            <Play className="w-4 h-4 mr-1" />
                            Run Tests
                        </Button>
                    </div>
                </div>
                <textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full h-64 bg-gray-900 text-gray-100 p-4 font-mono text-sm resize-none focus:outline-none"
                    placeholder={`// Write your ${language} code here...\n\nfunction solution() {\n    // Your code\n}`}
                    spellCheck={false}
                />
            </div>

            {/* Output */}
            {output && (
                <div className="bg-gray-900 rounded-lg border border-gray-700 p-4">
                    <h4 className="text-sm font-semibold text-gray-400 mb-2">Output:</h4>
                    <pre className="text-sm text-gray-300 font-mono whitespace-pre-wrap">{output}</pre>
                </div>
            )}

            {/* Test Cases */}
            {testCases && testCases.length > 0 && (
                <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                    <h4 className="text-sm font-semibold text-white mb-3">Test Cases:</h4>
                    <div className="space-y-2">
                        {testCases.map((test, idx) => (
                            <div key={idx} className="bg-gray-900 rounded p-3 text-sm">
                                <div className="text-gray-400">Input: <span className="text-blue-400 font-mono">{test.input}</span></div>
                                <div className="text-gray-400">Expected: <span className="text-green-400 font-mono">{test.expected}</span></div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Submit Button */}
            <Button
                variant="primary"
                className="w-full"
                onClick={() => onSubmit(code)}
                disabled={!code.trim()}
            >
                Submit Solution
            </Button>
        </div>
    );
}
