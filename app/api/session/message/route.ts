import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { sessionId, content } = body;

        if (!sessionId || !content) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Get session to find sender
        const session = await prisma.session.findUnique({
            where: { id: sessionId },
        });

        if (!session) {
            return NextResponse.json({ error: "Session not found" }, { status: 404 });
        }

        // Create message
        const message = await prisma.message.create({
            data: {
                sessionId,
                senderId: session.studentId, // In real app, get from auth
                content,
            },
        });

        return NextResponse.json({ success: true, message });
    } catch (error) {
        console.error("Error sending message:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const sessionId = searchParams.get("sessionId");

        if (!sessionId) {
            return NextResponse.json({ error: "Session ID is required" }, { status: 400 });
        }

        const messages = await prisma.message.findMany({
            where: { sessionId },
            include: {
                sender: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
            orderBy: {
                timestamp: "asc",
            },
        });

        return NextResponse.json({ messages });
    } catch (error) {
        console.error("Error fetching messages:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
