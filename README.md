# College Discovery Platform 🎓

A comprehensive full-stack platform built to help students discover, compare, and review colleges across India. The application features advanced search filters, side-by-side college comparisons, a community Q&A forum, and verified student reviews.

## 🚀 Tech Stack (PERN)

### Frontend
- **React 18** (with Vite for fast bundling)
- **Tailwind CSS** (for responsive, modern UI)
- **Redux Toolkit** (Global state management)
- **React Query (TanStack)** (Server state management & caching)
- **Framer Motion** (Smooth animations and transitions)
- **React Router v6** (Client-side routing)

### Backend
- **Node.js & Express.js** (REST API framework)
- **PostgreSQL** (Primary relational database)
- **Prisma ORM** (Database modeling and querying)
- **JWT & bcryptjs** (Authentication & security)
- **Resend API** (Transactional emails for password resets & welcome emails)

## ✨ Key Features

1. **Smart College Search & Filtering**: Find colleges based on location, courses, fees, exams accepted, and ratings.
2. **Advanced Comparison Engine**: Select up to 20 colleges and compare them side-by-side across 50+ data points (fees, placements, campus size, etc.).
3. **Community Q&A Forum**: Ask questions about specific colleges or general career paths and get answers from peers and alumni.
4. **Verified Student Reviews**: Read detailed reviews encompassing academic, faculty, infrastructure, and placement ratings.
5. **Personalized Dashboard**: Save your favorite colleges and track your community interactions in a private dashboard.
6. **Career & Admission Resources**: Access dedicated resources for Exam Preparation, Admission Guidance, and Scholarships.

## 🛠️ Local Development Setup

### Prerequisites
- Node.js (v18+ recommended)
- PostgreSQL database

### 1. Clone the repository
```bash
git clone https://github.com/rupesh6314/college-discovery-platform.git
cd college-discovery-platform
```

### 2. Backend Setup
```bash
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Edit .env and add your PostgreSQL DATABASE_URL, JWT_SECRET, and RESEND_API_KEY

# Run database migrations and generate Prisma client
npx prisma generate
npx prisma db push

# Start the development server (runs on port 5000)
npm start
```

### 3. Frontend Setup
```bash
# Open a new terminal window
cd frontend

# Install dependencies
npm install

# Create environment file (if necessary, check .env.example)
# Connects to http://localhost:5000 by default

# Start the Vite development server
npm run dev
```

## 🔐 Environment Variables

### Backend (`backend/.env`)
```env
PORT=5000
DATABASE_URL="postgresql://user:password@localhost:5432/collegedb?schema=public"
JWT_SECRET="your_super_secret_jwt_key"
RESEND_API_KEY="re_your_resend_api_key"
```

### Frontend (`frontend/.env`)
```env
VITE_API_URL="http://localhost:5000/api"
```

## 🌐 Deployment
- **Frontend**: Deployed on Netlify / Vercel using `npm run build`
- **Backend**: Deployed on Render (Web Service)
- **Database**: Managed PostgreSQL instance (Render / Supabase / Neon)

## 📄 License
© 2026 CollegeDiscovery. All rights reserved.
