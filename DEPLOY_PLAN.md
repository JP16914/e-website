# Simple Deployment Guide (Vercel + Render)

This is the easiest way to get your website online. We will use Vercel for the frontend and Render for the backend API.

---

## 1. Prerequisites
- Your code pushed to a **GitHub** repository.
- A **MongoDB Atlas** account (Managed Database).
- An **Upstash** account (Managed Redis).

---

## 2. Infrastructure Setup (Databases)

### A. MongoDB Atlas
1. Create a Free Cluster on MongoDB Atlas.
2. In **Network Access**, add `0.0.0.0/0` (this allows Render to connect).
3. Create a Database User (e.g., `admin`) and copy the password.
4. Get your Connection String (e.g., `mongodb+srv://admin:pass@cluster.mongodb.net/ecommerce`).

### B. Upstash Redis
1. Create a Redis database on Upstash.
2. Copy the **Redis URL** (starts with `redis://`).

---

## 3. Backend Deployment (Render)

1. Sign in to [Render](https://render.com).
2. Click **New +** -> **Web Service**.
3. Connect your GitHub repository.
4. Settings:
   - **Name**: `shopmega-api`
   - **Root Directory**: `apps/api`
   - **Runtime**: `Docker`
5. Click **Advanced** and add **Environment Variables**:
   - `MONGODB_URI`: *Your Atlas String*
   - `REDIS_URL`: *Your Upstash URL*
   - `JWT_ACCESS_SECRET`: *A random secret string*
   - `NODE_ENV`: `production`
   - `FRONTEND_URL`: `https://your-app.vercel.app` (You can update this after Step 4)
6. Click **Create Web Service**. Render will build your Docker image and provide a URL (e.g., `https://shopmega-api.onrender.com`).

---

## 4. Frontend Deployment (Vercel)

1. Sign in to [Vercel](https://vercel.com).
2. Click **New Project** and import your GitHub repo.
3. Settings:
   - **Framework Preset**: Next.js
   - **Root Directory**: Leave as `.` (repository root)
   - **Environment Variables**:
     - `NEXT_PUBLIC_API_BASE_URL`: Your Render URL from Step 3.
4. Click **Deploy**. Vercel will give you a live URL (e.g., `https://e-website-xxx.vercel.app`).

---

## 5. Seeding Your Production Database
To populate your live site with products:
1. Open your local `.env` inside `apps/api`.
2. Temporarily change `MONGODB_URI` to your **Atlas Production String**.
3. Run the following command in your local terminal (inside `apps/api`):
   ```bash
   npm run build
   npm run seed
   ```
4. Check your live website! All products and users should now appear.
5. **CRITICAL**: Change your local `.env` back to your local MongoDB if you want to keep working locally.

---

## 6. Final Polish
Once you have your Vercel URL, go back to Render settings and update the `FRONTEND_URL` environment variable. This ensures that cookies and login sessions work perfectly across different domains.
