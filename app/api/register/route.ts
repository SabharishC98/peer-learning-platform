import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const { email, name, faceHash } = await req.json();

        if (!email || !name || !faceHash) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 });
        }

        // Check if email exists
        const existingEmail = await prisma.user.findUnique({
            where: { email },
        });

        if (existingEmail) {
            return NextResponse.json({ error: "Email already registered" }, { status: 400 });
        }

        // Check if face hash exists (Strict Uniqueness)
        // In a real app, this would be a similarity search on embeddings
        // Here we simulate it by checking exact match (assuming the client generates a consistent hash for the same face)
        // OR we can simulate "collision" if we want to demo the feature.
        // For now, we'll assume the client sends a unique hash unless they are trying to cheat.

        // To make it "strict", we could check if ANY user has this hash.
        const existingFace = await prisma.user.findUnique({
            where: { faceHash },
        });

        if (existingFace) {
            return NextResponse.json({
                error: "Identity already verified with another account. One account per person policy."
            }, { status: 403 });
        }

        const user = await prisma.user.create({
            data: {
                email,
                name,
                faceHash,
                points: 100, // Initial points
            },
        });

        return NextResponse.json({ user });
    } catch (error) {
        console.error("Registration error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
