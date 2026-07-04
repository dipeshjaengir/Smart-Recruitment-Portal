# Smart Recruitment Portal using MERN Stack

An enterprise-grade, complete production-ready Recruitment Portal built with the **MERN Stack (MongoDB, Express, React, Node.js)** featuring a local rule-based **AI Candidate Shortlisting and Resume Parsing Engine**.

## ⚡ Core Features

- **Rule-Based Resume Parser**: Extracts skills, experience timeline, education degrees, CGPA, and certificates directly from PDF uploads.
- **Local AI Suitability Scoring**: Evaluates applicants automatically based on four parameters:
  - **Skills Match**: Compares candidate tech stacks with job posting demands.
  - **Experience Check**: Compares candidates' total years of experience.
  - **Education Alignment**: Verifies degree keywords (B.Tech, MS, PhD).
  - **Keyword Density**: Inspects matches in job description terms.
- **Dynamic Dashboards**: Dedicated workspaces for:
  - **Admins**: Tweak AI scoring weights, block users, and register skills.
  - **Recruiters**: Post openings, schedule virtual interviews, evaluate suitability metrics, and export summaries (CSV).
  - **Candidates**: Upload resumes, explore openings, track application pipelines, and launch meeting links.
- **Premium Aesthetics**: Styled with a dark glassmorphism enterprise theme.

---

## 🛠️ Tech Stack & Dependencies

### Backend
- **Express / Node.js**: REST API server.
- **Mongoose / MongoDB**: User profiles, applications, and settings store.
- **pdf-parse**: Text extractor for PDF resume parsing.
- **Nodemailer**: Dispatches invitations.
- **Cloudinary**: (Optional) Cloud asset storage.
- **Bcrypt.js / JWT**: Session tokens and security.

### Frontend
- **React / Vite**: Single Page Application structure.
- **Redux Toolkit**: Central state store.
- **Tailwind CSS**: Modern enterprise styling.
- **Framer Motion**: Micro-animations and transitions.
- **Chart.js**: Hiring visual analytics graphs.

---

## 🚀 Setup & Execution Guide

### Prerequisite
Ensure you have **Node.js (v18+)** and **MongoDB (running locally on port 27017)** installed.

### 1. Database & Backend Setup
Navigate to the `backend` folder:
```bash
cd backend
npm install
```

Copy the `.env.example` file to `.env`:
```bash
cp .env.example .env
```

Ensure MongoDB URI matches your local running database:
```env
MONGODB_URI=mongodb://127.0.0.1:27017/smart_recruitment_portal
```

#### Run Database Seeder
Preload predefined technical skills, hiring categories, and the initial Administrator account (`admin@smartrecruit.com` / `adminpassword`):
```bash
npm run seed
```

#### Launch Backend Server
```bash
npm run dev
```
The server will boot on port `5000`.

---

### 2. Frontend / Client Setup
Navigate to the `client` folder:
```bash
cd ../client
npm install
```

#### Launch Frontend Dev Server
```bash
npm run dev
```
The web portal will boot locally at `http://localhost:5173`.

---

## 🔐 Credentials for Development
- **Default Admin Account**:
  - Email: `admin@smartrecruit.com`
  - Password: `adminpassword`
- **Master OTP Bypass**:
  - If SMTP credentials are left blank in `.env`, verify emails during candidate or recruiter registration using the bypass code: `123456`.
