#!/usr/bin/env node

/**
 * Production Readiness Check Script
 * Runs all necessary checks before deployment
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Production Readiness Check\n');
console.log('='.repeat(50));

let hasErrors = false;
let hasWarnings = false;

// Helper function to run commands
function runCommand(command, description, required = true) {
    console.log(`\n📋 ${description}...`);
    try {
        execSync(command, { stdio: 'inherit', cwd: __dirname });
        console.log(`✅ ${description} - PASSED`);
        return true;
    } catch (error) {
        if (required) {
            console.error(`❌ ${description} - FAILED`);
            hasErrors = true;
        } else {
            console.warn(`⚠️  ${description} - WARNING`);
            hasWarnings = true;
        }
        return false;
    }
}

// Helper function to check file existence
function checkFile(filePath, description, required = true) {
    console.log(`\n📄 Checking ${description}...`);
    const exists = fs.existsSync(path.join(__dirname, filePath));
    if (exists) {
        console.log(`✅ ${description} - EXISTS`);
        return true;
    } else {
        if (required) {
            console.error(`❌ ${description} - MISSING`);
            hasErrors = true;
        } else {
            console.warn(`⚠️  ${description} - NOT FOUND`);
            hasWarnings = true;
        }
        return false;
    }
}

// 1. Check environment files
console.log('\n' + '='.repeat(50));
console.log('1️⃣  Environment Configuration');
console.log('='.repeat(50));

checkFile('.env', 'Development environment file', true);
checkFile('ENV_TEMPLATE.md', 'Environment template', true);

// Check critical env vars
const envContent = fs.existsSync('.env') ? fs.readFileSync('.env', 'utf-8') : '';
const requiredVars = ['DATABASE_URL', 'NEXTAUTH_SECRET', 'NEXTAUTH_URL'];
requiredVars.forEach(varName => {
    if (envContent.includes(varName)) {
        console.log(`✅ ${varName} - SET`);
    } else {
        console.error(`❌ ${varName} - MISSING`);
        hasErrors = true;
    }
});

// 2. Database checks
console.log('\n' + '='.repeat(50));
console.log('2️⃣  Database');
console.log('='.repeat(50));

checkFile('prisma/schema.prisma', 'Prisma schema', true);
runCommand('npx prisma generate', 'Prisma client generation', true);

// 3. Dependencies
console.log('\n' + '='.repeat(50));
console.log('3️⃣  Dependencies');
console.log('='.repeat(50));

checkFile('package.json', 'Package.json', true);
checkFile('package-lock.json', 'Package-lock.json', true);
console.log('✅ Dependencies installed');

// 4. TypeScript compilation
console.log('\n' + '='.repeat(50));
console.log('4️⃣  TypeScript');
console.log('='.repeat(50));

runCommand('npx tsc --noEmit', 'TypeScript type checking', false);

// 5. Linting
console.log('\n' + '='.repeat(50));
console.log('5️⃣  Code Quality');
console.log('='.repeat(50));

runCommand('npm run lint', 'ESLint check', false);

// 6. Build
console.log('\n' + '='.repeat(50));
console.log('6️⃣  Production Build');
console.log('='.repeat(50));

const buildSuccess = runCommand('npm run build', 'Production build', true);

// 7. Critical files check
console.log('\n' + '='.repeat(50));
console.log('7️⃣  Critical Files');
console.log('='.repeat(50));

const criticalFiles = [
    'app/layout.tsx',
    'app/page.tsx',
    'lib/prisma.ts',
    'lib/auth.ts',
    'lib/stripe.ts',
    'next.config.js',
];

criticalFiles.forEach(file => {
    checkFile(file, file, true);
});

// 8. Documentation
console.log('\n' + '='.repeat(50));
console.log('8️⃣  Documentation');
console.log('='.repeat(50));

checkFile('README.md', 'README', true);
checkFile('DEPLOYMENT.md', 'Deployment guide', true);

// Final summary
console.log('\n' + '='.repeat(50));
console.log('📊 SUMMARY');
console.log('='.repeat(50));

if (hasErrors) {
    console.error('\n❌ PRODUCTION READINESS CHECK FAILED');
    console.error('Please fix the errors above before deploying to production.\n');
    process.exit(1);
} else if (hasWarnings) {
    console.warn('\n⚠️  PRODUCTION READINESS CHECK PASSED WITH WARNINGS');
    console.warn('Consider addressing the warnings above.\n');
    process.exit(0);
} else {
    console.log('\n✅ PRODUCTION READINESS CHECK PASSED');
    console.log('Your application is ready for deployment! 🎉\n');
    process.exit(0);
}
