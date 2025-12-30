import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting database seeding...');

    // Create test users (no password field in schema)
    const teacher1 = await prisma.user.upsert({
        where: { email: 'teacher1@example.com' },
        update: {},
        create: {
            email: 'teacher1@example.com',
            name: 'Alice Johnson',
            bio: 'Experienced JavaScript and Python developer with 5+ years of teaching experience',
            points: 150,
            timezone: 'America/New_York',
        },
    });

    const teacher2 = await prisma.user.upsert({
        where: { email: 'teacher2@example.com' },
        update: {},
        create: {
            email: 'teacher2@example.com',
            name: 'Bob Smith',
            bio: 'Full-stack developer specializing in React and Node.js',
            points: 200,
            timezone: 'America/Los_Angeles',
        },
    });

    const student1 = await prisma.user.upsert({
        where: { email: 'student1@example.com' },
        update: {},
        create: {
            email: 'student1@example.com',
            name: 'Charlie Brown',
            bio: 'Aspiring web developer learning JavaScript',
            points: 100,
            timezone: 'America/Chicago',
        },
    });

    const student2 = await prisma.user.upsert({
        where: { email: 'student2@example.com' },
        update: {},
        create: {
            email: 'student2@example.com',
            name: 'Diana Prince',
            bio: 'Computer science student interested in React',
            points: 80,
            timezone: 'Europe/London',
        },
    });

    console.log('✅ Created test users');

    // Create skills
    const skill1 = await prisma.skill.create({
        data: {
            name: 'JavaScript',
            userId: teacher1.id,
            verified: true,
            verifiedAt: new Date(),
        },
    });

    const skill2 = await prisma.skill.create({
        data: {
            name: 'Python',
            userId: teacher1.id,
            verified: true,
            verifiedAt: new Date(),
        },
    });

    const skill3 = await prisma.skill.create({
        data: {
            name: 'React',
            userId: teacher2.id,
            verified: true,
            verifiedAt: new Date(),
        },
    });

    const skill4 = await prisma.skill.create({
        data: {
            name: 'Node.js',
            userId: teacher2.id,
            verified: true,
            verifiedAt: new Date(),
        },
    });

    console.log('✅ Created skills');

    // Create matching profiles (availability and languages are JSON strings)
    await prisma.matchingProfile.upsert({
        where: { userId: teacher1.id },
        update: {},
        create: {
            userId: teacher1.id,
            learningStyle: 'visual',
            preferredPace: 'medium',
            availability: JSON.stringify(['morning', 'afternoon']),
            preferredLanguages: JSON.stringify(['en', 'es']),
            bio: 'Patient teacher who loves helping students understand complex concepts',
        },
    });

    await prisma.matchingProfile.upsert({
        where: { userId: teacher2.id },
        update: {},
        create: {
            userId: teacher2.id,
            learningStyle: 'kinesthetic',
            preferredPace: 'fast',
            availability: JSON.stringify(['afternoon', 'evening']),
            preferredLanguages: JSON.stringify(['en']),
            bio: 'Hands-on coding instructor focused on practical projects',
        },
    });

    await prisma.matchingProfile.upsert({
        where: { userId: student1.id },
        update: {},
        create: {
            userId: student1.id,
            learningStyle: 'visual',
            preferredPace: 'medium',
            availability: JSON.stringify(['morning', 'evening']),
            preferredLanguages: JSON.stringify(['en']),
        },
    });

    await prisma.matchingProfile.upsert({
        where: { userId: student2.id },
        update: {},
        create: {
            userId: student2.id,
            learningStyle: 'kinesthetic',
            preferredPace: 'slow',
            availability: JSON.stringify(['afternoon']),
            preferredLanguages: JSON.stringify(['en', 'fr']),
        },
    });

    console.log('✅ Created matching profiles');

    // Create sample sessions
    const session1 = await prisma.session.create({
        data: {
            studentId: student1.id,
            teacherId: teacher1.id,
            skillName: 'JavaScript',
            scheduledTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
            status: 'PENDING',
            pointsCost: 10,
        },
    });

    const session2 = await prisma.session.create({
        data: {
            studentId: student2.id,
            teacherId: teacher2.id,
            skillName: 'React',
            scheduledTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
            status: 'COMPLETED',
            pointsCost: 10,
            startTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            endTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000),
            rating: 5,
            feedback: 'Excellent session! Bob explained React hooks very clearly.',
        },
    });

    console.log('✅ Created sample sessions');

    // Create transactions (only userId field, not fromUserId/toUserId)
    await prisma.transaction.create({
        data: {
            userId: student2.id,
            type: 'SPEND',
            amount: -10,
            description: 'Paid for React session with Bob Smith',
            sessionId: session2.id,
        },
    });

    await prisma.transaction.create({
        data: {
            userId: teacher2.id,
            type: 'EARN',
            amount: 10,
            description: 'Earned from React session with Diana Prince',
            sessionId: session2.id,
        },
    });

    console.log('✅ Created transactions');

    // Create notifications
    await prisma.notification.create({
        data: {
            userId: student1.id,
            type: 'SESSION_SCHEDULED',
            title: 'Session Scheduled',
            message: 'Your JavaScript session with Alice Johnson is scheduled for tomorrow',
            read: false,
            link: `/dashboard/sessions/${session1.id}`,
        },
    });

    await prisma.notification.create({
        data: {
            userId: teacher2.id,
            type: 'POINTS_EARNED',
            title: 'Points Received',
            message: 'You received 10 points from Diana Prince',
            read: false,
            link: '/dashboard/points',
        },
    });

    await prisma.notification.create({
        data: {
            userId: teacher1.id,
            type: 'SESSION_REMINDER',
            title: 'Upcoming Session',
            message: 'You have a JavaScript session with Charlie Brown tomorrow',
            read: false,
            link: `/dashboard/sessions/${session1.id}`,
        },
    });

    console.log('✅ Created notifications');

    // Create sample messages
    await prisma.message.create({
        data: {
            sessionId: session2.id,
            senderId: student2.id,
            content: 'Hi Bob! Looking forward to learning React hooks today.',
        },
    });

    await prisma.message.create({
        data: {
            sessionId: session2.id,
            senderId: teacher2.id,
            content: 'Great! We\'ll start with useState and useEffect.',
        },
    });

    console.log('✅ Created messages');

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📝 Test Accounts Created:');
    console.log('   👨‍🏫 Teacher 1: teacher1@example.com (Alice Johnson)');
    console.log('      Skills: JavaScript, Python');
    console.log('      Points: 150');
    console.log('\n   👨‍🏫 Teacher 2: teacher2@example.com (Bob Smith)');
    console.log('      Skills: React, Node.js');
    console.log('      Points: 200');
    console.log('\n   👨‍🎓 Student 1: student1@example.com (Charlie Brown)');
    console.log('      Points: 100');
    console.log('      Upcoming session: JavaScript with Alice');
    console.log('\n   👨‍🎓 Student 2: student2@example.com (Diana Prince)');
    console.log('      Points: 80');
    console.log('      Completed session: React with Bob');
    console.log('\n💡 Note: This platform uses NextAuth for authentication.');
    console.log('   Configure your .env file with NEXTAUTH_SECRET to enable login.');
}

main()
    .catch((e) => {
        console.error('❌ Error seeding database:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
