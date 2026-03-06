# NeerKavach — Project Progress & Context

> **Last updated:** March 6, 2026

---

## Project Overview

**NeerKavach** is a Water Quality Monitoring & Disease Risk Prediction System for Indian public health officials. ASHA workers and health authorities submit water test data, get AI-driven disease risk predictions (Typhoid, Cholera, Diarrhea), view risk hotspot maps, and generate surveillance reports.

**Repository:** Aniketdhar810/NeerKavach (branch: `main`)

---

## Tech Stack

| Layer | Stack |
|-------|-------|
| **Frontend** | React 19, Vite, Tailwind CSS v4, react-router-dom v7, axios, shadcn/ui |
| **Backend** | Express 5, Mongoose 9, MongoDB Atlas, JWT auth, Passport.js, Nodemailer, bcryptjs, axios |
| **ML Model** | Python FastAPI + scikit-learn — `model/app.py` ✅ |
| **Dark Mode** | CSS class toggle with Tailwind v4 `@custom-variant` |

---

## User Roles

| Role | Can Do | Cannot Do |
|------|--------|-----------|
| **Common User** (`user`) | View dashboard, hotspot map, reports, predictions | Submit water test reports |
| **Reporter** (`reporter`) | All of the above + submit water tests, trigger AI prediction, view own reports | — |

---

## Current Project Structure
Hackhathon/
├── client/
│ └── src/
│ ├── App.jsx # ✅ Route guards (PrivateRoute, ReporterRoute)
│ ├── lib/api.js # ✅ Axios instance with JWT interceptor
│ ├── pages/
│ │ ├── LandingPage.jsx # ✅ Public landing
│ │ ├── SignIn.jsx # ✅ Login → stores token + user (with role)
│ │ ├── Signup.jsx # ✅ 3-step signup with role selector
│ │ ├── dashboard.jsx # ✅ Wired to API
│ │ ├── SubmitTest.jsx # ✅ Wired to POST /api/reports + /api/prediction
│ │ ├── PredictionResult.jsx # ✅ Reads from location.state
│ │ ├── HotspotMap.jsx # ✅ Fetches from /api/prediction/hotspots
│ │ └── MyReports.jsx # ✅ Fetches real data from API, role-aware
│ └── components/
│ ├── dashboard/
│ │ ├── Sidebar.jsx # ✅ Role-based menu
│ │ ├── MobileNav.jsx # ✅ Hides Submit FAB for common users
│ │ ├── StatsGrid.jsx # ✅ Fetches from API
│ │ ├── RecentReports.jsx # ✅ Fetches from API
│ │ ├── RiskDistribution.jsx # ✅ Calculates from API data
│ │ ├── SurveillanceInsight.jsx # ✅ Dynamic alerts from API
│ │ └── DashboardHeader.jsx # ✅ Shows real user info + logout
│ ├── prediction/
│ │ ├── WaterTestSummary.jsx # ✅ Accepts props
│ │ ├── RiskMatrix.jsx # ✅ Accepts props
│ │ └── RecommendedActions.jsx # ✅ Dynamic based on risk level
│ └── hotspot/
│ ├── MapSidebar.jsx # ⚠️ Static filter sidebar
│ └── HotspotPopup.jsx # ✅ Receives data via props
│
├── server/
│ ├── index.js # ✅ All routes mounted
│ ├── passport.js # ✅ Local + JWT strategies
│ ├── config/db.js # ✅ MongoDB Atlas connection
│ ├── models/
│ │ ├── User.js # ✅ role, department, region fields
│ │ └── Report.js # ✅ Full water test schema + temperature + prediction subdoc
│ ├── middleware/
│ │ ├── authMiddleware.js # ✅ JWT verification
│ │ └── roleMiddleware.js # ✅ Role-based access control
│ ├── controllers/
│ │ ├── authController.js # ✅ Full auth flow with role
│ │ ├── reportController.js # ✅ CRUD for reports
│ │ ├── predictionController.js # ✅ ML proxy + fallback
│ │ └── userController.js # ✅ Profile get/update
│ ├── routes/
│ │ ├── auth.js # ✅ /api/auth/*
│ │ ├── reports.js # ✅ /api/reports/* (role-gated)
│ │ ├── prediction.js # ✅ /api/prediction/*
│ │ └── users.js # ✅ /api/users/me
│ └── utils/sendEmail.js # ✅ Nodemailer
│
└── model/
├── app.py # ✅ FastAPI ML API with ensemble model
├── requirements.txt # ✅ Python dependencies
├── water_disease_model.pkl # 🔄 Generated on first run
└── ML_Final_Water_Disease_Training_Dataset_with_sources.csv # ✅ Training data


---

## Backend API Summary

| Endpoint | Method | Auth | Role | Status |
|----------|--------|------|------|--------|
| `/api/auth/send-code` | POST | No | Any | ✅ |
| `/api/auth/verify-code` | POST | No | Any | ✅ |
| `/api/auth/complete-signup` | POST | No | Any | ✅ (accepts role) |
| `/api/auth/login` | POST | No | Any | ✅ (returns role) |
| `/api/auth/me` | GET | JWT | Any | ✅ |
| `/api/reports` | POST | JWT | Reporter | ✅ |
| `/api/reports` | GET | JWT | Any | ✅ |
| `/api/reports/my` | GET | JWT | Reporter | ✅ |
| `/api/reports/:id` | GET | JWT | Any | ✅ |
| `/api/reports/:id/status` | PATCH | JWT | Reporter | ✅ |
| `/api/prediction/:reportId` | POST | JWT | Reporter | ✅ (ML + fallback) |
| `/api/prediction/hotspots` | GET | JWT | Any | ✅ |
| `/api/users/me` | GET | JWT | Any | ✅ |
| `/api/users/me` | PATCH | JWT | Any | ✅ |

## ML API Summary (Port 5001)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Health check |
| `/health` | GET | Detailed health status |
| `/predict` | POST | Disease risk prediction |
| `/hotspots` | GET | Sample hotspot data |
| `/retrain` | POST | Retrain model from dataset |

---

## What's DONE ✅

### Backend (100% Complete)
- [x] User model with `role` (user/reporter), `department`, `region`
- [x] Report model with all water test fields + temperature + embedded prediction
- [x] JWT auth middleware (standalone)
- [x] Role-based access middleware
- [x] Auth flow: send-code → verify-code → complete-signup (with role) → login
- [x] Login returns user object with role
- [x] Full report CRUD (create, list all, list own, get by ID, update status)
- [x] Prediction endpoint with ML proxy + rule-based fallback
- [x] Hotspots endpoint
- [x] User profile get/update endpoints
- [x] Server starts on port 3000, MongoDB connects

### ML Model (100% Complete)
- [x] FastAPI service with SVM + KNN ensemble model
- [x] Model training from CSV dataset
- [x] Model persistence (pickle file)
- [x] Disease predictions: Diarrhea, Cholera, Typhoid
- [x] Risk level calculation (low/moderate/high)
- [x] Hotspot data endpoint
- [x] Auto-load/train on startup

### Frontend (95% Complete)
- [x] JWT token interceptor on all API calls
- [x] Signup with role selector (Common User / Reporter)
- [x] Signup sends role, department, region to backend
- [x] SignIn stores user object (with role) in localStorage
- [x] Route guards: PrivateRoute + ReporterRoute
- [x] Sidebar shows role-based menu
- [x] SubmitTest wired to POST /api/reports + POST /api/prediction + temperature field
- [x] MyReports fetches real data from API
- [x] MyReports conditionally shows "New Test" for reporters
- [x] PredictionResult reads from navigation state
- [x] WaterTestSummary accepts props for real data
- [x] RiskMatrix accepts props for real predictions
- [x] RecommendedActions dynamic based on risk level
- [x] HotspotMap fetches from API
- [x] StatsGrid fetches from API
- [x] RecentReports fetches from API (clickable rows)
- [x] RiskDistribution calculates from API data
- [x] SurveillanceInsight shows real alerts
- [x] MobileNav hides FAB for common users
- [x] DashboardHeader shows real user info + logout

---

## What's LEFT TO DO ⬜

### 🟡 Medium Priority — UI Enhancements
- [ ] **MapSidebar.jsx** — Wire filters to API
- [ ] **Real map integration** — Replace static image with Leaflet/Mapbox
- [ ] **Profile page** — /profile route doesn't exist

### 🟢 Low Priority — New Features
- [ ] **PDF Export** — Report PDF generation
- [ ] **Surveillance & Alerts pages** — Currently dead links
- [ ] **Forgot password** — Link exists but no implementation

---

## How to Run

```bash
# ML Model (run first)
cd model
pip install -r requirements.txt
uvicorn app:app --host 0.0.0.0 --port 5001 --reload

# Backend
cd server && npm install && node index.js

# Frontend
cd client && npm install && npm run dev
```

## Environment Variables

### Server (.env)
```
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-secret-key
ML_API_URL=http://localhost:5001/predict
```

