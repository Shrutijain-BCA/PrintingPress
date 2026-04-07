# Printify — Full Stack Printing App

## Folder Structure
```
PrintingPress/
├── frontend/   ← React + Vite + Tailwind
└── backend/    ← Node.js + Express + MongoDB
```

---

## 🚀 Running Locally

### 1. Start Backend
```bash
cd backend
npm install
# Edit .env → set your MONGODB_URI
npm run dev
# Runs on http://localhost:4000
```

### 2. Start Frontend
```bash
cd frontend
npm install
# .env already has VITE_API_URL=http://localhost:4000/api
npm run dev
# Runs on http://localhost:5173
```

---

## 🌍 Environment Variables

### backend/.env
```
PORT=4000
MONGODB_URI=mongodb+srv://YOUR_USER:YOUR_PASS@cluster.mongodb.net/printify
JWT_SECRET=your_secret_key_here
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### frontend/.env
```
VITE_API_URL=http://localhost:4000/api
```

---

## 📡 API Endpoints

| Method | Endpoint                          | Role    | Description          |
|--------|-----------------------------------|---------|----------------------|
| POST   | /api/auth/register                | Public  | Register             |
| POST   | /api/auth/login                   | Public  | Login                |
| GET    | /api/auth/me                      | Any     | Get current user     |
| POST   | /api/documents                    | Student | Upload files         |
| GET    | /api/documents                    | Student | List my files        |
| POST   | /api/orders                       | Student | Place order          |
| GET    | /api/orders                       | Student | My orders            |
| PATCH  | /api/orders/:id/cancel            | Student | Cancel order         |
| GET    | /api/vendor/dashboard             | Vendor  | Stats + recent       |
| GET    | /api/vendor/orders                | Vendor  | All incoming orders  |
| PATCH  | /api/vendor/orders/:id/status     | Vendor  | Update order status  |
| GET    | /api/vendor/pricing               | Vendor  | Get pricing          |
| PUT    | /api/vendor/pricing               | Vendor  | Update pricing       |

---

## 🌐 Deploy

**Frontend → Vercel**
- Import frontend/ repo
- Set env: VITE_API_URL=https://your-backend.onrender.com/api

**Backend → Render**
- Import backend/ repo
- Set all .env variables
- Start command: node src/server.js

**Database → MongoDB Atlas**
- Free M0 cluster
- Whitelist 0.0.0.0/0
- Copy connection string to MONGODB_URI
