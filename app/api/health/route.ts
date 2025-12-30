import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * Health Check Endpoint
 * Returns the health status of the application and its dependencies
 */
export async function GET() {
    try {
        const startTime = Date.now();

        // Check database connectivity
        let dbStatus = "healthy";
        let dbResponseTime = 0;
        try {
            const dbStart = Date.now();
            await prisma.$queryRaw`SELECT 1`;
            dbResponseTime = Date.now() - dbStart;
        } catch (error) {
            dbStatus = "unhealthy";
            console.error("Database health check failed:", error);
        }

        const responseTime = Date.now() - startTime;

        const healthStatus = {
            status: dbStatus === "healthy" ? "healthy" : "degraded",
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            environment: process.env.NODE_ENV || "development",
            version: process.env.npm_package_version || "unknown",
            checks: {
                database: {
                    status: dbStatus,
                    responseTime: `${dbResponseTime}ms`,
                },
                api: {
                    status: "healthy",
                    responseTime: `${responseTime}ms`,
                },
            },
        };

        const statusCode = healthStatus.status === "healthy" ? 200 : 503;

        return NextResponse.json(healthStatus, { status: statusCode });
    } catch (error) {
        console.error("Health check error:", error);
        return NextResponse.json(
            {
                status: "unhealthy",
                timestamp: new Date().toISOString(),
                error: "Health check failed",
            },
            { status: 503 }
        );
    }
}
