# Weekly Report Generator & Team Dashboard

A full-stack Software as a Service (SaaS) application built to streamline the submission and management of weekly work reports for engineering teams. This project was developed as a technical assignment for a Software Engineering Internship.

## 🚀 Project Overview

The Weekly Report Generator replaces chaotic email threads and fragmented task trackers. It provides a centralized, secure platform where **Team Members** can draft and submit structured weekly reports, and **Managers (Admins)** can visualize team velocity, workload distribution, and common blockers through an analytics dashboard.

### Key Features
- **Role-Based Access Control (RBAC):** Strict isolation between Members and Admins.
- **Report Lifecycle Management:** Draft, Edit, Delete, and permanently Submit reports.
- **Admin Analytics Dashboard:** Built with Recharts for visual insights (Submission compliance, project distribution, blocker tracking).
- **Gemini AI Integration:** Managers can ask a natural-language AI assistant to summarize team reports, identify hidden bottlenecks, and analyze workload.
- **Project/Category Tagging:** Dynamic project selection managed by admins.
- **SaaS Polish:** Empty states, skeleton loaders, toast notifications, responsive sidebars, and clean typography.

---

## 🛠 Tech Stack

### Frontend
- **Framework:** React.js + Vite
- **Styling:** Tailwind CSS
- **Routing:** React Router v6
- **Forms & Validation:** React Hook Form
- **Charts:** Recharts
- **Icons:** Lucide React
- **Notifications:** React Hot Toast
- **HTTP Client:** Axios

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB + Mongoose
- **Authentication:** JSON Web Tokens (JWT) & bcrypt
- **Validation:** express-validator
- **Security:** Helmet, CORS, Cookie Parser
- **AI Integration:** @google/generative-ai (Gemini 1.5 Flash)

---

## 📂 Architecture & Design

### Database Schema (MongoDB)
The database leverages three primary collections:
1. `User`: Stores authentication credentials and `role` (member or admin).
2. `Project`: Categories that reports can be tagged to.
3. `Report`: The core data object containing `userId`, `projectId`, `weekStartDate`, `tasksCompleted`, `blockers`, etc.

### Authentication Flow
1. User authenticates via `/api/auth/login`.
2. Backend verifies bcrypt hash and generates a secure JWT.
3. JWT is sent back as an **HTTP-only cookie** (preventing XSS attacks).
4. Frontend relies on a `/api/auth/me` endpoint to hydrate the React `AuthContext` on initial load.
5. React Router `RoleRoute` component guards frontend paths based on the context's role.

---

## 💻 Local Setup & Installation

### Prerequisites
- Node.js (v18+)
- MongoDB (Local instance or Atlas cluster URI)
- Google Gemini API Key (Optional, for AI features)

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd weekly-report-generator-dashboard
```

### 2. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` directory based on `.env.example`:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/weekly_reports
JWT_SECRET=your_super_secret_key_123!
NODE_ENV=development
GEMINI_API_KEY=your_google_ai_key
```
Seed the database (Creates an admin account: `admin@example.com` / `password123`)
```bash
node src/utils/seeder.js
```
Start the server:
```bash
npm run dev
```

### 3. Frontend Setup
Open a new terminal window:
```bash
cd frontend
npm install
```
Start the Vite dev server:
```bash
npm run dev
```
Navigate to `http://localhost:5173` in your browser.

---

## 📸 Screenshots

*(Replace these placeholders with actual screenshots for the final portfolio)*

- **Admin Dashboard:** `![Admin Dashboard](./screenshots/admin-dashboard.png)`
- **Member Report Form:** `![Report Form](./screenshots/report-form.png)`
- **AI Assistant:** `![AI Assistant](./screenshots/ai-assistant.png)`

---

## 🔮 Future Improvements

If given more time, the following enhancements would be prioritized:
1. **Email Notifications:** Integrate SendGrid/Nodemailer to email managers when reports are submitted, or remind members if they are late.
2. **Export to PDF/CSV:** Allow admins to export the filtered reports table for external stakeholder meetings.
3. **Draft Autosave:** Implement `localStorage` or debounced API calls to auto-save report drafts while the user is typing.
