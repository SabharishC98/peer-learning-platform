# 🎓 PeerLearn - Peer-to-Peer Learning Platform

A comprehensive peer-to-peer learning platform where users teach and learn skills through one-on-one video sessions, powered by AI matching, biometric authentication, and a points-based economy.

## ✨ Key Features

- 🔐 **Biometric Authentication** - Face scan prevents duplicate accounts
- 🎯 **AI-Powered Matching** - Smart algorithm finds the best teacher-student pairs
- 📝 **Skill Verification** - Coding tests + MCQ with plagiarism detection
- 🎥 **Video Conferencing** - WebRTC-based P2P video with screen sharing and chat
- 💰 **Points Economy** - Earn by teaching, spend by learning, purchase more
- 🤖 **AI Session Summaries** - Automatic summaries for teacher handoff
- 💳 **Payment Integration** - Stripe integration for purchasing points
- 🔔 **Notifications** - Real-time updates for sessions and points

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Stripe account (for payments)

### Installation

1. **Clone and install dependencies**
   ```bash
   cd peer-learning-platform
   npm install
   ```

2. **Set up environment variables**
   
   Create `.env` file:
   ```env
   DATABASE_URL="file:./prisma/dev.db"
   NEXTAUTH_SECRET="your-secret-key-here"
   NEXTAUTH_URL="http://localhost:3000"
   STRIPE_SECRET_KEY="sk_test_your_stripe_key"
   ```

3. **Initialize database**
   ```bash
   npx prisma migrate dev --name init
   npx prisma generate
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

5. **Open browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📚 Tech Stack

- **Frontend**: Next.js 14, React 19, TypeScript, Tailwind CSS 4
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: SQLite (dev), PostgreSQL-ready
- **Auth**: NextAuth.js with custom biometric provider
- **Video**: PeerJS (WebRTC)
- **Payments**: Stripe
- **UI**: Framer Motion, Lucide Icons

## 🎯 How It Works

### For Students

1. Sign up with face scan authentication
2. Search for teachers by skill
3. Schedule a session (costs 10 points)
4. Join video room for one-on-one learning
5. AI generates session summary
6. Purchase more points when needed

### For Teachers

1. Sign up and verify skills (coding + MCQ tests)
2. Get matched with students via AI algorithm
3. Teach sessions via video conferencing
4. Earn points after each session
5. View student's learning history from previous teachers

## 🧠 AI Features

### 1. Plagiarism Detection
- Levenshtein distance algorithm
- Token-based code comparison
- 70% similarity threshold

### 2. Teacher Matching
- Multi-factor weighted scoring
- Considers: skill match, ratings, availability, learning style, pace
- Match quality labels: Excellent, Good, Fair, Low

### 3. Session Summaries
- Keyword extraction from chat
- Structured summary generation
- Personalized next steps

## 📁 Project Structure

```
peer-learning-platform/
├── app/
│   ├── (auth)/              # Authentication pages
│   ├── api/                 # API routes
│   │   ├── skills/          # Skill verification
│   │   ├── match/           # Teacher matching
│   │   ├── session/         # Session management
│   │   ├── payment/         # Stripe integration
│   │   └── notifications/   # Notifications
│   └── dashboard/           # Dashboard pages
│       ├── search/          # Find teachers
│       ├── skills/          # Verify skills
│       ├── sessions/        # Session history
│       ├── points/          # Points management
│       └── room/[id]/       # Video room
├── components/
│   ├── auth/                # Auth components
│   ├── dashboard/           # Dashboard components
│   ├── room/                # Video room components
│   ├── search/              # Search components
│   ├── skill/               # Skill verification components
│   ├── payment/             # Payment components
│   └── ui/                  # Reusable UI components
├── lib/
│   ├── ai-summary.ts        # AI summary generation
│   ├── matching-algorithm.ts # Teacher matching
│   ├── plagiarism.ts        # Plagiarism detection
│   ├── notifications.ts     # Notification helpers
│   ├── stripe.ts            # Stripe configuration
│   ├── auth.ts              # NextAuth config
│   └── prisma.ts            # Prisma client
└── prisma/
    └── schema.prisma        # Database schema
```

## 🗄️ Database Schema

9 interconnected models:
- **User** - Core user data with points and face hash
- **Skill** - Verified skills
- **TestSubmission** - Test results with plagiarism scores
- **Session** - Learning sessions
- **SessionSummary** - AI-generated summaries
- **Message** - Chat messages
- **Transaction** - Points transactions
- **MatchingProfile** - User preferences
- **Notification** - User notifications

## 🔒 Security Features

- Biometric face scan for unique user identification
- Duplicate account prevention
- Plagiarism detection for skill verification
- Secure payment processing with Stripe
- Session-based authentication with NextAuth

## 💡 Unique Selling Points

1. **One Account Per Person** - Biometric authentication ensures fairness
2. **Verified Teachers** - Rigorous skill testing with plagiarism detection
3. **AI Matching** - Find the perfect teacher based on multiple factors
4. **Teacher Handoff** - Session summaries enable seamless transitions
5. **Balanced Economy** - Everyone must teach to earn points to learn
6. **Mutual Learning** - Be both student and teacher

## 📝 API Documentation

See [walkthrough.md](./walkthrough.md) for detailed API documentation and feature descriptions.

## 🎨 UI/UX

- Modern dark theme with gradient accents
- Responsive design for all devices
- Smooth animations with Framer Motion
- Glassmorphism effects
- Intuitive navigation

## 🚀 Deployment

### Database Migration

For production, update `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"  // Change from sqlite
  url      = env("DATABASE_URL")
}
```

Then run:
```bash
npx prisma migrate deploy
```

### Environment Variables

Set production environment variables:
- `DATABASE_URL` - PostgreSQL connection string
- `NEXTAUTH_SECRET` - Strong random secret
- `NEXTAUTH_URL` - Production URL
- `STRIPE_SECRET_KEY` - Stripe production key

## 📊 Resume Highlights

This project demonstrates:
- Full-stack development with modern technologies
- Real-time communication (WebRTC)
- AI/ML integration (matching, plagiarism, summaries)
- Payment processing (Stripe)
- Complex database design
- Biometric authentication
- RESTful API development
- Type-safe development with TypeScript

## 🤝 Contributing

This is a demonstration project. For production use, consider:
- Integrating real AI APIs (OpenAI, etc.)
- Adding actual face recognition (AWS Rekognition, Azure Face API)
- Implementing production-grade video infrastructure (Twilio, Agora)
- Adding comprehensive testing
- Enhancing security measures

## 📄 License

MIT License - feel free to use this project for learning and portfolio purposes.

## 🙏 Acknowledgments

Built with:
- Next.js & React
- Prisma ORM
- PeerJS
- Stripe
- Tailwind CSS
- Framer Motion

---

**Made with ❤️ for the peer learning community**
