# 🚀 Resume Copilot - AI-Powered Resume Assistant

Resume Copilot is a modern full-stack SaaS platform that helps job seekers create, analyze, optimize, and tailor their resumes using Artificial Intelligence. The platform provides ATS scoring, job description matching, skill gap analysis, AI-powered resume suggestions, and personalized career guidance.

---

## 🌟 Features

### 📄 Resume Analysis

* AI-powered resume review and feedback
* ATS (Applicant Tracking System) score generation
* Resume strength assessment
* Keyword optimization suggestions

### 🎯 Job Description Matching

* Compare resumes against job descriptions
* Match score calculation
* Missing keyword detection
* Personalized improvement recommendations

### 🧠 AI Resume Copilot

* Interactive AI career assistant
* Resume improvement suggestions
* Content rewriting and enhancement
* Professional summary generation

### 📊 Skill Gap Analysis

* Identify missing skills for target roles
* Personalized learning recommendations
* Career growth insights

### 🔐 User Authentication

* Secure user login and registration
* Protected dashboard routes
* Resume management system

### ☁️ Cloud-Based Platform

* Store and manage multiple resumes
* Access resumes from anywhere
* Secure cloud database storage

---

## 🏗️ Tech Stack

### Frontend

* Next.js 14 (App Router)
* React
* TypeScript
* Tailwind CSS
* shadcn/ui
* Framer Motion

### Backend

* Next.js Server Actions
* REST API Routes
* Middleware Authentication

### Database

* PostgreSQL
* Neon Database
* Prisma ORM

### AI Integration

* Gemini AI
* Groq AI
* Custom Prompt Engineering

### Deployment

* Vercel
* Environment Variable Management

---

## 📂 Project Structure

```bash
resume-copilot/
│
├── app/
├── components/
├── lib/
├── prisma/
├── public/
├── middleware.ts
├── next.config.mjs
├── tailwind.config.ts
├── prisma.config.ts
└── package.json
```

---

## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/vishnucs-123/resume-copilot.git
cd resume-copilot
```

### Install Dependencies

```bash
npm install
```

### Configure Environment Variables

Create a `.env` file:

```env
DATABASE_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

GEMINI_API_KEY=
GROQ_API_KEY=
```

### Setup Database

```bash
npx prisma generate
npx prisma migrate dev
```

### Run Development Server

```bash
npm run dev
```

Application will be available at:

```bash
http://localhost:3000
```

---

## 🧠 How It Works

```text
User Uploads Resume
          ↓
Resume Parsing
          ↓
AI Analysis Engine
          ↓
ATS Score Generation
          ↓
Job Description Matching
          ↓
Skill Gap Analysis
          ↓
Personalized Recommendations
```

---

## 🎯 Key Highlights

* AI-Powered Resume Optimization
* ATS Compatibility Scoring
* Job Description Matching
* Skill Gap Detection
* Modern SaaS Architecture
* Cloud-Native Deployment
* Responsive UI/UX
* Production-Ready Infrastructure

---

## 📈 Use Cases

### For Students

* Improve internship applications
* Optimize campus placement resumes
* Prepare for fresher hiring

### For Professionals

* Tailor resumes for specific jobs
* Improve ATS rankings
* Identify missing skills

### For Recruiters

* Quick resume evaluation
* Candidate screening assistance

---

## 🔮 Future Enhancements

* Resume Builder with Templates
* AI Interview Preparation
* Cover Letter Generator
* LinkedIn Profile Analyzer
* Resume Version History
* Multi-Language Support
* Team Collaboration Features

---

## 👨‍💻 Author

**Vishnu Lambu**

📧 Email: [vishnulambu4@gmail.com](mailto:vishnulambu4@gmail.com)

💼 LinkedIn: https://www.linkedin.com/in/vishnu-lambu/

🐙 GitHub: https://github.com/vishnucs-123

🌐 Portfolio: https://developervishnu.vercel.app/

🚀 Live Demo: https://resumecopilot.vercel.app/

---

## 📌 Project Summary (Interview Version)

* Developed an AI-powered Resume Assistant SaaS using Next.js, TypeScript, Prisma, and PostgreSQL.
* Built ATS scoring, resume analysis, job description matching, and skill gap detection features using Generative AI.
* Implemented secure authentication, cloud database integration, and responsive dashboard architecture.
* Deployed a production-ready application on Vercel with scalable full-stack architecture.

---

⭐ If you find this project useful, consider giving it a star on GitHub.
