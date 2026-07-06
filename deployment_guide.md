# Deployment Guide

This guide explains how to deploy the Weekly Report Generator to free-tier cloud providers for your portfolio.

---

## 1. Database Deployment (MongoDB Atlas)
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and create a free account.
2. Build a Database (Choose the free `M0` cluster).
3. Under **Database Access**, create a user (e.g., `dbUser`) with a secure password.
4. Under **Network Access**, click "Add IP Address" and select "Allow Access from Anywhere" (`0.0.0.0/0`) so Render can connect to it.
5. Click **Connect** on your cluster, choose "Connect your application", and copy the connection string.
   - It will look like: `mongodb+srv://dbUser:<password>@cluster0.xxxxx.mongodb.net/weekly_reports?retryWrites=true&w=majority`

---

## 2. Backend Deployment (Render)
Render is an excellent free platform for hosting Node.js REST APIs.

1. Create a GitHub repository and push your entire codebase to it.
2. Go to [Render](https://render.com/) and create a free account.
3. Click **New +** and select **Web Service**.
4. Connect your GitHub account and select your repository.
5. **Configuration:**
   - **Name:** `weekly-reports-api`
   - **Root Directory:** `backend` (Important!)
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start` (Make sure your `backend/package.json` has `"start": "node server.js"`)
6. **Environment Variables:**
   - Scroll down to "Environment Variables" and add:
     - `PORT` = `10000`
     - `MONGO_URI` = `[Your MongoDB Atlas Connection String]`
     - `JWT_SECRET` = `[A long random string]`
     - `NODE_ENV` = `production`
     - `GEMINI_API_KEY` = `[Your Gemini Key]`
     - `FRONTEND_URL` = `[Leave blank for now, you will update this after Step 3]`
7. Click **Create Web Service**. Wait for it to deploy and copy the backend URL (e.g., `https://weekly-reports-api.onrender.com`).

---

## 3. Frontend Deployment (Vercel)
Vercel is the optimal platform for Vite/React frontends.

1. Go to [Vercel](https://vercel.com/) and create a free account.
2. Click **Add New...** -> **Project**.
3. Import your GitHub repository.
4. **Configuration:**
   - **Framework Preset:** `Vite`
   - **Root Directory:** `frontend` (Important!)
5. **Environment Variables:**
   - *Note: Vite requires environment variables to start with `VITE_`.*
   - If you have an API URL configured in your code, you may need to set it here. For this project, you'll need to make sure your `api.js` points to the Render URL instead of `localhost:5000` in production.
   - *Code fix required before deploy:* In `frontend/src/services/api.js`, change the baseURL to:
     `baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api'`
   - Set `VITE_API_URL` in Vercel to your Render URL: `https://weekly-reports-api.onrender.com/api`
6. Click **Deploy**.
7. Copy your new Vercel URL (e.g., `https://weekly-reports-frontend.vercel.app`).

---

## 4. Final Security Link
Go back to your **Render** dashboard -> Environment Variables, and set:
`FRONTEND_URL` = `https://weekly-reports-frontend.vercel.app`
*(This ensures CORS securely accepts requests from your specific Vercel frontend).*
