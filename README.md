<div align="center">

# 🔵 PulseBoard

### Weekly Team Report Management System

*A full-stack SaaS platform for engineering teams to submit, manage, and analyze weekly work reports — with AI-powered insights.*

[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://mongoosejs.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Jest](https://img.shields.io/badge/Tests-14%20passing-C21325?style=flat-square&logo=jest&logoColor=white)](./backend/src/tests/)
[![License](https://img.shields.io/badge/License-ISC-blue?style=flat-square)](./LICENSE)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
- [API Reference](#-api-reference)
- [Testing](#-testing)
- [Project Structure](#-project-structure)
- [Future Improvements](#-future-improvements)

---

## 🌟 Overview

PulseBoard replaces chaotic email chains and fragmented task trackers with a **centralized, role-secured platform** for weekly engineering report management.

**Team Members** submit structured weekly reports with tasks completed, blockers, and hours worked. **Managers (Admins)** get a real-time analytics dashboard, advanced filtering, multi-format exports, and a Gemini AI assistant to query team data through natural language.

> Built as a technical assignment for a Software Engineering Internship — exceeding all stated requirements.

---

## ✨ Features

### 👤 Member Features
| Feature | Description |
| :--- | :--- |
| **Report Lifecycle** | Create, edit, and delete draft reports — submit when ready |
| **Structured Fields** | Tasks completed, tasks planned, blockers, hours worked, notes |
| **Project Tagging** | Assign reports to active projects managed by admins |
| **Report History** | View all personal past reports with status indicators |

### 🛡️ Admin Features
| Feature | Description |
| :--- | :--- |
| **Analytics Dashboard** | Recharts-powered visuals — submission compliance, project distribution, workload trends |
| **Report Management** | View all team reports with advanced filtering (member, project, status, date range) |
| **Server-Side Pagination** | Efficient handling of large datasets (10 rows/page, configurable up to 50) |
| **Export Reports** | Download filtered reports as **CSV** or **PDF** for stakeholder meetings |
| **Project Management** | Create, update, and soft-delete projects with `isActive` flag |
| **AI Assistant (Gemini)** | Ask natural-language questions — summarize team health, identify blockers, analyze workload |

### 🔐 Security
| Feature | Description |
| :--- | :--- |
| **HTTP-only JWT Cookies** | XSS-resistant authentication — no tokens in `localStorage` |
| **Role-Based Access Control** | Full frontend + backend isolation between `member` and `admin` roles |
| **Password Hashing** | bcrypt with salt rounds on every password save |
| **Helmet + CORS** | Security headers and origin-restricted API access |
| **Input Validation** | `express-validator` on all mutation endpoints |

---

## 🛠 Tech Stack

### Frontend
| Technology | Purpose |
| :--- | :--- |
| React 18 + Vite | UI framework and blazing-fast dev server |
| Tailwind CSS | Utility-first styling with custom SaaS design system |
| React Router v6 | Client-side routing with `ProtectedRoute` and `RoleRoute` guards |
| React Hook Form | Performant form state and validation |
| Recharts | Composable chart library for analytics |
| Axios | HTTP client with centralized interceptors |
| Lucide React | Consistent icon library |
| React Hot Toast | Non-intrusive toast notification system |

### Backend
| Technology | Purpose |
| :--- | :--- |
| Node.js + Express.js | RESTful API server |
| MongoDB + Mongoose | Document database with schema validation |
| JSON Web Tokens (JWT) | Stateless authentication |
| bcrypt | Secure password hashing |
| express-validator | Request body validation and sanitization |
| Helmet | HTTP security header middleware |
| Morgan | HTTP request logging |
| @google/generative-ai | Gemini 2.5 Flash AI integration |
| pdfmake | Server-side PDF generation |
| json2csv | CSV export from filtered report data |

### Testing
| Technology | Purpose |
| :--- | :--- |
| Jest | Unit test runner (14 tests, 2 suites) |
| jest.mock() | Full Mongoose model mocking — no DB connection needed |

---

## 🏗 Architecture

### Backend Layer Pattern

```
HTTP Request
     │
     ▼
 Routes          (express router — auth, validation middleware)
     │
     ▼
 Controllers     (HTTP in/out, delegates to service)
     │
     ▼
 Services        (business logic — all rules live here)
     │
     ▼
 Models          (Mongoose schemas — data shape and DB access)
```

### Authentication Flow

```
Client                          Server
  │                               │
  ├─── POST /api/auth/login ──────►
  │                               ├── verify bcrypt hash
  │                               ├── sign JWT (role payload)
  │◄── Set-Cookie: jwt=... ───────┤   (HTTP-only, Secure)
  │                               │
  ├─── GET /api/auth/me ──────────►
  │    (cookie sent automatically) ├── verify JWT → inject req.user
  │◄── { name, role, ... } ───────┤
  │                               │
  └── React AuthContext hydrated ─┘
```

### Database Collections

```
User              Project           Report
────────────      ────────────      ────────────────────
_id               _id               _id
name              name              userId       → User
email             description       projectId    → Project
password (hash)   isActive          weekStartDate
role              timestamps        weekEndDate
assignedProjects               tasksCompleted
timestamps                     tasksPlanned
                               blockers
                               hoursWorked
                               notes
                               status (draft | submitted)
                               timestamps
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18 or higher
- **MongoDB** — local instance or [MongoDB Atlas](https://www.mongodb.com/atlas) URI
- **Google Gemini API Key** — optional, for AI features ([get one free](https://aistudio.google.com/))

---

### 1. Clone the Repository

```bash
git clone https://github.com/NajiAhmad18/pulseboard.git
cd pulseboard
```

---

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/pulseboard
JWT_SECRET=your_super_secret_jwt_key_min_32_chars
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Optional — remove to disable AI features gracefully
GEMINI_API_KEY=your_google_ai_studio_key
```

Seed the database (creates default admin account):

```bash
node src/utils/seeder.js
```

> **Default Admin Credentials**
> Email: `admin@example.com` | Password: `password123`

Start the development server:

```bash
npm run dev
```

Backend runs at: `http://localhost:5000`

---

### 3. Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend/` directory:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the Vite dev server:

```bash
npm run dev
```

Frontend runs at: `http://localhost:5173`

---

## 📡 API Reference

### Authentication

| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register a new member account | Public |
| `POST` | `/api/auth/login` | Login and receive HTTP-only JWT cookie | Public |
| `GET` | `/api/auth/me` | Get current authenticated user | Auth |
| `POST` | `/api/auth/logout` | Clear the auth cookie | Auth |

### Reports

| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/reports` | Create a new draft report | Member |
| `GET` | `/api/reports/my` | Get all personal reports | Member |
| `GET` | `/api/reports/:id` | Get a single personal report | Member |
| `PUT` | `/api/reports/:id` | Update a draft report | Member |
| `PUT` | `/api/reports/:id/submit` | Submit a draft (irreversible) | Member |
| `DELETE` | `/api/reports/:id` | Delete a draft report | Member |
| `GET` | `/api/reports/all` | Get all reports with filters + pagination | Admin |
| `GET` | `/api/reports/admin/:id` | Get any report by ID | Admin |

> **Pagination params:** `?page=1&limit=10&userId=...&projectId=...&status=...`

### Projects

| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/projects` | List all projects | Auth |
| `POST` | `/api/projects` | Create a new project | Admin |
| `PUT` | `/api/projects/:id` | Update a project | Admin |
| `DELETE` | `/api/projects/:id` | Soft-delete a project (`isActive=false`) | Admin |

### Export

| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/export/csv` | Export filtered reports as CSV | Admin |
| `GET` | `/api/export/pdf` | Export filtered reports as PDF | Admin |

### AI Assistant

| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/ai/ask` | Ask Gemini a question about team reports | Admin |

---

## 🧪 Testing

Unit tests cover all critical business logic with full Mongoose model mocking — no real database connection required.

```bash
cd backend
npm test
```

**Results:**

```
PASS  src/tests/projectController.test.js
PASS  src/tests/reportService.test.js

Test Suites:  2 passed, 2 total
Tests:        14 passed, 14 total
Time:         0.494s
```

**Test coverage:**

| Test | File |
| :--- | :--- |
| `createReport` — date validation guard | `reportService.test.js` |
| `createReport` — userId merged correctly | `reportService.test.js` |
| `submitReport` — re-submit guard | `reportService.test.js` |
| `submitReport` — sets status and saves | `reportService.test.js` |
| `deleteDraftReport` — submitted report guard | `reportService.test.js` |
| `deleteDraftReport` — calls deleteOne | `reportService.test.js` |
| `getAllReports` — correct totalPages math | `reportService.test.js` |
| `getAllReports` — defaults to page 1 | `reportService.test.js` |
| `getAllReports` — caps limit at 50 | `reportService.test.js` |
| `deleteProject` — sets `isActive=false` | `projectController.test.js` |
| `deleteProject` — 404 when not found | `projectController.test.js` |
| `createProject` — returns 201 | `projectController.test.js` |
| `updateProject` — 404 when not found | `projectController.test.js` |
| `updateProject` — returns updated project | `projectController.test.js` |

---

## 📁 Project Structure

```
pulseboard/
├── backend/
│   ├── src/
│   │   ├── controllers/       # HTTP handlers (thin layer)
│   │   │   ├── authController.js
│   │   │   ├── reportController.js
│   │   │   ├── projectController.js
│   │   │   ├── exportController.js
│   │   │   ├── analyticsController.js
│   │   │   └── aiController.js
│   │   ├── services/          # Business logic (all rules here)
│   │   │   ├── reportService.js
│   │   │   └── exportService.js
│   │   ├── models/            # Mongoose schemas
│   │   │   ├── User.js
│   │   │   ├── Report.js
│   │   │   └── Project.js
│   │   ├── routes/            # Express routers
│   │   ├── middlewares/       # Auth, error, validation
│   │   ├── utils/             # AppError, responseHandler, seeder
│   │   └── tests/             # Jest unit tests
│   ├── jest.config.js
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/        # Button, Card, Badge, Input, etc.
│   │   │   ├── layout/        # Sidebar, MainLayout, ProtectedRoute
│   │   │   └── export/        # ExportModal
│   │   ├── pages/
│   │   │   ├── admin/         # Dashboard, ReportList, ProjectList
│   │   │   └── member/        # Dashboard, ReportForm, ReportList
│   │   ├── services/          # Axios API clients
│   │   ├── context/           # AuthContext
│   │   ├── hooks/             # Custom React hooks
│   │   └── utils/             # cn(), helpers
│   ├── package.json
│   └── vite.config.js
│
├── ER_Diagram.md
├── ER_Diagram.png
├── ER_Diagram.svg
├── self_review.md
└── README.md
```

---

## 🔮 Future Improvements

| Priority | Enhancement |
| :---: | :--- |
| 🔴 High | **Email Notifications** — SendGrid/Nodemailer alerts when reports are submitted or overdue |
| 🔴 High | **Cypress E2E Tests** — Full user journey coverage for login, report creation, and admin workflow |
| 🟡 Medium | **Draft Autosave** — Debounced API calls or `localStorage` fallback to save drafts while typing |
| 🟡 Medium | **Code Splitting** — Dynamic `import()` on route level to reduce the initial JS bundle (~806 kB) |
| 🟢 Low | **Dark Mode** — CSS variable-based theming toggle |
| 🟢 Low | **Member Notifications** — In-app bell icon for admin feedback on submitted reports |

---

## 👤 Author

**Naji Ahmad Javahir**
- GitHub: [@NajiAhmad18](https://github.com/NajiAhmad18)

---

<div align="center">
<sub>Built with ❤️ as a Software Engineering Internship Technical Assignment</sub>
</div>
