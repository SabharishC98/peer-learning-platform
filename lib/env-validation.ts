/**
 * Environment Variable Validation
 * Validates that all required environment variables are set
 * Run this at application startup to fail fast if configuration is missing
 */

const requiredEnvVars = [
    'DATABASE_URL',
    'NEXTAUTH_SECRET',
    'NEXTAUTH_URL',
] as const;

const optionalEnvVars = [
    'STRIPE_SECRET_KEY',
    'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
    'NEXT_PUBLIC_PEERJS_HOST',
    'NEXT_PUBLIC_PEERJS_PORT',
    'NEXT_PUBLIC_PEERJS_PATH',
    'NEXT_PUBLIC_PEERJS_SECURE',
] as const;

interface ValidationResult {
    valid: boolean;
    missing: string[];
    warnings: string[];
}

export function validateEnv(): ValidationResult {
    const missing: string[] = [];
    const warnings: string[] = [];

    // Check required variables
    for (const envVar of requiredEnvVars) {
        if (!process.env[envVar]) {
            missing.push(envVar);
        }
    }

    // Check optional but recommended variables
    for (const envVar of optionalEnvVars) {
        if (!process.env[envVar]) {
            warnings.push(envVar);
        }
    }

    // Validate NEXTAUTH_SECRET length
    if (process.env.NEXTAUTH_SECRET && process.env.NEXTAUTH_SECRET.length < 32) {
        warnings.push('NEXTAUTH_SECRET should be at least 32 characters long');
    }

    // Validate DATABASE_URL format
    if (process.env.DATABASE_URL) {
        const dbUrl = process.env.DATABASE_URL;
        if (!dbUrl.startsWith('postgresql://') && !dbUrl.startsWith('file:')) {
            warnings.push('DATABASE_URL should use postgresql:// for production');
        }
    }

    return {
        valid: missing.length === 0,
        missing,
        warnings,
    };
}

export function logEnvValidation(): void {
    const result = validateEnv();

    if (!result.valid) {
        console.error('❌ Missing required environment variables:');
        result.missing.forEach(envVar => {
            console.error(`   - ${envVar}`);
        });
        console.error('\nPlease set these variables in your .env file');
        console.error('See ENV_TEMPLATE.md for reference\n');

        if (process.env.NODE_ENV === 'production') {
            throw new Error('Missing required environment variables');
        }
    } else {
        console.log('✅ All required environment variables are set');
    }

    if (result.warnings.length > 0) {
        console.warn('\n⚠️  Environment warnings:');
        result.warnings.forEach(warning => {
            console.warn(`   - ${warning}`);
        });
        console.warn('');
    }
}

// Auto-validate on import in development
if (process.env.NODE_ENV !== 'test') {
    logEnvValidation();
}
