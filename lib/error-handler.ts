import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

/**
 * Standard API Error Response Format
 */
export interface ApiError {
    error: string;
    message: string;
    statusCode: number;
    details?: unknown;
}

/**
 * Creates a standardized error response
 */
export function createErrorResponse(
    error: unknown,
    defaultMessage = "An unexpected error occurred"
): NextResponse<ApiError> {
    console.error("API Error:", error);

    // Handle Prisma errors
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
        return handlePrismaError(error);
    }

    // Handle validation errors
    if (error instanceof ValidationError) {
        return NextResponse.json(
            {
                error: "Validation Error",
                message: error.message,
                statusCode: 400,
                details: error.details,
            },
            { status: 400 }
        );
    }

    // Handle authentication errors
    if (error instanceof AuthenticationError) {
        return NextResponse.json(
            {
                error: "Authentication Error",
                message: error.message,
                statusCode: 401,
            },
            { status: 401 }
        );
    }

    // Handle authorization errors
    if (error instanceof AuthorizationError) {
        return NextResponse.json(
            {
                error: "Authorization Error",
                message: error.message,
                statusCode: 403,
            },
            { status: 403 }
        );
    }

    // Handle not found errors
    if (error instanceof NotFoundError) {
        return NextResponse.json(
            {
                error: "Not Found",
                message: error.message,
                statusCode: 404,
            },
            { status: 404 }
        );
    }

    // Handle generic errors
    if (error instanceof Error) {
        return NextResponse.json(
            {
                error: "Internal Server Error",
                message: process.env.NODE_ENV === "production"
                    ? defaultMessage
                    : error.message,
                statusCode: 500,
            },
            { status: 500 }
        );
    }

    // Fallback for unknown errors
    return NextResponse.json(
        {
            error: "Internal Server Error",
            message: defaultMessage,
            statusCode: 500,
        },
        { status: 500 }
    );
}

/**
 * Handles Prisma-specific errors
 */
function handlePrismaError(
    error: Prisma.PrismaClientKnownRequestError
): NextResponse<ApiError> {
    switch (error.code) {
        case "P2002":
            return NextResponse.json(
                {
                    error: "Duplicate Entry",
                    message: "A record with this value already exists",
                    statusCode: 409,
                    details: error.meta,
                },
                { status: 409 }
            );
        case "P2025":
            return NextResponse.json(
                {
                    error: "Not Found",
                    message: "The requested record was not found",
                    statusCode: 404,
                },
                { status: 404 }
            );
        case "P2003":
            return NextResponse.json(
                {
                    error: "Foreign Key Constraint",
                    message: "The operation violates a foreign key constraint",
                    statusCode: 400,
                },
                { status: 400 }
            );
        default:
            return NextResponse.json(
                {
                    error: "Database Error",
                    message: "A database error occurred",
                    statusCode: 500,
                    details: process.env.NODE_ENV === "production" ? undefined : error,
                },
                { status: 500 }
            );
    }
}

/**
 * Custom Error Classes
 */
export class ValidationError extends Error {
    constructor(
        message: string,
        public details?: unknown
    ) {
        super(message);
        this.name = "ValidationError";
    }
}

export class AuthenticationError extends Error {
    constructor(message = "Authentication required") {
        super(message);
        this.name = "AuthenticationError";
    }
}

export class AuthorizationError extends Error {
    constructor(message = "Insufficient permissions") {
        super(message);
        this.name = "AuthorizationError";
    }
}

export class NotFoundError extends Error {
    constructor(message = "Resource not found") {
        super(message);
        this.name = "NotFoundError";
    }
}

/**
 * Validates request body against a schema
 */
export function validateRequestBody<T>(
    body: unknown,
    requiredFields: (keyof T)[]
): T {
    if (!body || typeof body !== "object") {
        throw new ValidationError("Request body is required");
    }

    const missingFields = requiredFields.filter(
        (field) => !(field in body)
    );

    if (missingFields.length > 0) {
        throw new ValidationError(
            `Missing required fields: ${missingFields.join(", ")}`,
            { missingFields }
        );
    }

    return body as T;
}

/**
 * Wraps an API handler with error handling
 */
export function withErrorHandling<T>(
    handler: () => Promise<NextResponse<T>>
): Promise<NextResponse<T | ApiError>> {
    return handler().catch((error) => createErrorResponse(error));
}
