# Production Deployment Plan

This guide outlines the recommended path for deploying your e-commerce application to production using a modern, scalable stack.

## 1. Prerequisites
- A [GitHub](https://github.com) account.
- A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account (for the database).
- An [Upstash](https://upstash.com) account (for Redis).
- A [Vercel](https://vercel.com) account (for Frontend).
- A [Render](https://render.com) or [Railway](https://railway.app) account (for Backend API).

---

## 2. Infrastructure Setup

### A. Database (MongoDB Atlas)
1. Create a new Cluster (Shared/Free tier is fine).
2. Under "Network Access", allow access from `0.0.0.0/0` (or the specific IPs of your hosting provider later).
3. Create a Database User and password.
4. Get your Connection String (e.g., `mongodb+srv://user:pass@cluster.mongodb.net/ecommerce?retryWrites=true&w=majority`).

### B. Redis (Upstash)
1. Create a Redis database.
2. Copy the connection URL (e.g., `redis://default:token@region.upstash.io:port`).

---

## 3. Backend Deployment (NestJS)

We recommend using **Render** or **Railway** because they handle `Dockerfile` deployments easily.

### Deployment via Render:
1. Push your code to a GitHub repository.
2. In Render, create a new **Web Service**.
3. Point it to your repository and set the "Root Directory" to `apps/api`.
4. Render will detect the `Dockerfile`.
5. Add the following **Environment Variables**:
   - `NODE_ENV`: `production`
   - `MONGODB_URI`: Your Atlas string
   - `REDIS_URL`: Your Upstash URL
   - `JWT_ACCESS_SECRET`: A long, random string
   - `PORT`: `3001` (Render usually detects 3001 from EXPOSE)
6. Change the last line of `apps/api/Dockerfile` to `CMD [ "npm", "run", "start:prod" ]`.

---

## 4. Frontend Deployment (Next.js)

### Deployment via Vercel:
1. In Vercel, create a new Project.
2. Select your GitHub repository.
3. Configure the **Framework Preset** as Next.js.
4. Set the **Root Directory** as the repository root (`./`).
5. Add the following **Environment Variables**:
   - `NEXT_PUBLIC_API_BASE_URL`: Your Backend URL (e.g., `https://your-api.onrender.com`)
6. Deploy!

---

## 5. Required Code Adjustments

Before deploying, we should make these safety changes:

### A. Update Backend Dockerfile
Update `apps/api/Dockerfile` to use the production command:
```dockerfile
# Change line 14
CMD [ "node", "dist/main" ]
```

### B. CORS Configuration
Ensure `apps/api/src/main.ts` allows your frontend domain:
```typescript
app.enableCors({
  origin: ['http://localhost:3000', 'https://your-frontend.vercel.app'],
  credentials: true,
});
```

### C. Seed Production Data
You can run the seed script locally pointing to the production MongoDB URI once to populate your live site.
