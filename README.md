# Printify — Full Stack Printing App

## Folder Structure
```
PrintingPress/
├── frontend/   ← React + Vite + Tailwind
└── backend/    ← Node.js + Express + MongoDB
```

### 1. Start Backend
```bash
cd backend
npm install
npm run dev

### 2. Start Frontend
```bash
cd frontend
npm install
npm run dev

---
## API Endpoints

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


# Printing Press Management System

A full-stack web application that connects **students and vendors** for seamless printing services.
Built with modern technologies and deployed on cloud platforms.

---

## Live Demo

* Frontend: https://printing-press-git-main-shrutijain-bcas-projects.vercel.app/
* Backend API: https://printingpress-backend.onrender.com

---

##  Features

*  User Authentication (Register/Login with JWT)
*  Student & Vendor roles
*  Upload and manage documents
*  Order placement system
*  Vendor dashboard
*  Protected routes with authentication
*  Fully deployed (Frontend + Backend)

---

## Tech Stack

### Frontend

* React.js / Vite
* TypeScript
* Tailwind CSS

### Backend

* Node.js
* Express.js
* MongoDB (Mongoose)

### Deployment

* Vercel (Frontend)
* Render (Backend)

---

## Project Structure

```
printingpress/
│
├── frontend/        # React frontend
├── backend/         # Express backend
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   └── config/
│
└── README.md
```

---

##  Running Locally

### 1. Clone the repository

```
git clone https://github.com/your-username/PrintingPress.git
cd PrintingPress
```

### 2. Setup Backend

```
cd backend
npm install
npm run dev
```

### 3. Setup Frontend

```
cd frontend
npm install
npm run dev
```

---

## Future Enhancements

* Online payment integration (Razorpay/Stripe)
* Location-based vendor matching
* Order tracking system
* Advanced analytics dashboard

---

## Author

**Shruti Jain** **Tanisha Rajput**

* MCA Students

---

## Show your support

If you like this project, give it a ⭐ on GitHub!

