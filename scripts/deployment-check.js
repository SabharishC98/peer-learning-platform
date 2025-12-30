#!/usr/bin/env node

/**
 * Deployment Readiness Check Script
 * Verifies that all required environment variables and configurations are set
 */

const requiredEnvVars = [
    'DATABASE_URL',
    'NEXTAUTH_SECRET',
    'NEXTAUTH_URL',
    'STRIPE_SECRET_KEY',
    'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
    'NEXT_PUBLIC_PEERJS_HOST',
    'NEXT_PUBLIC_PEERJS_PORT',
    'NEXT_PUBLIC_PEERJS_SECURE'
];

const optionalEnvVars = [
    'STRIPE_WEBHOOK_SECRET',
    'NEXT_PUBLIC_PEERJS_PATH'
];

console.log('🚀 Deployment Readiness Check\n');

let hasErrors = false;
let hasWarnings = false;

// Check required environment variables
console.log('✓ Checking required environment variables...');
requiredEnvVars.forEach(varName => {
    if (!process.env[varName]) {
        console.error(`  ❌ Missing: ${varName}`);
        hasErrors = true;
    } else {
        console.log(`  ✓ ${varName}`);
    }
});

// Check optional environment variables
console.log('\n✓ Checking optional environment variables...');
optionalEnvVars.forEach(varName => {
    if (!process.env[varName]) {
        console.warn(`  ⚠️  Optional: ${varName} (not set)`);
        hasWarnings = true;
    } else {
        console.log(`  ✓ ${varName}`);
    }
});

// Validate DATABASE_URL format
console.log('\n✓ Validating DATABASE_URL...');
const dbUrl = process.env.DATABASE_URL;
if (dbUrl) {
    if (dbUrl.startsWith('postgresql://')) {
        console.log('  ✓ PostgreSQL connection string detected');
    } else if (dbUrl.startsWith('file:')) {
        console.error('  ❌ SQLite detected - PostgreSQL required for production');
        hasErrors = true;
    } else {
        console.warn('  ⚠️  Unknown database provider');
        hasWarnings = true;
    }
}

// Validate NEXTAUTH_SECRET length
console.log('\n✓ Validating NEXTAUTH_SECRET...');
const nextAuthSecret = process.env.NEXTAUTH_SECRET;
if (nextAuthSecret) {
    if (nextAuthSecret.length >= 32) {
        console.log('  ✓ Secret is sufficiently long');
    } else {
        console.error('  ❌ Secret must be at least 32 characters');
        hasErrors = true;
    }
}

// Validate Stripe keys
console.log('\n✓ Validating Stripe keys...');
const stripeSecret = process.env.STRIPE_SECRET_KEY;
const stripePublic = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

if (stripeSecret) {
    if (stripeSecret.startsWith('sk_live_')) {
        console.log('  ✓ Using Stripe LIVE keys');
    } else if (stripeSecret.startsWith('sk_test_')) {
        console.warn('  ⚠️  Using Stripe TEST keys (switch to live for production)');
        hasWarnings = true;
    }
}

if (stripePublic) {
    if (stripePublic.startsWith('pk_live_')) {
        console.log('  ✓ Using Stripe LIVE publishable key');
    } else if (stripePublic.startsWith('pk_test_')) {
        console.warn('  ⚠️  Using Stripe TEST publishable key');
        hasWarnings = true;
    }
}

// Summary
console.log('\n' + '='.repeat(50));
if (hasErrors) {
    console.error('\n❌ Deployment check FAILED');
    console.error('Please fix the errors above before deploying.\n');
    process.exit(1);
} else if (hasWarnings) {
    console.warn('\n⚠️  Deployment check passed with warnings');
    console.warn('Review the warnings above.\n');
    process.exit(0);
} else {
    console.log('\n✅ All checks passed! Ready for deployment.\n');
    process.exit(0);
}
