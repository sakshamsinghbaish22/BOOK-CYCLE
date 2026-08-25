# 📚 BOOKCYCLE — FEATURES & FUNCTIONS (FNF) GUIDE
### *GL Bajaj Institute of Technology • Student Textbook Sharing Platform*

---

## 🌟 Executive Overview
**BookCycle** is a student-to-student textbook sharing, exchange, and donation platform specifically designed and localized for **GL Bajaj Institute of Technology** (Greater Noida). 

Every textbook on the platform is available for **100% Free (₹0)** to eliminate semester textbook costs, reduce paper waste, and foster a collaborative campus culture.

---

## 🚀 Key Features & Functions (FNF)

### 1. 📖 100% Free Textbook Distribution
- **Zero Cost Model**: All listings are configured as free student donations (₹0.00).
- **Curriculum-Aligned Modules**: Categorized by engineering streams:
  - *Computer Science & AI* (Data Structures & Algorithms, OS, AI)
  - *Applied Mathematics* (Calculus, Linear Algebra, Differential Equations)
  - *Competitive Entrance Exams* (JEE Advanced & GATE Engineering)
  - *Business & Management* (Marketing & Core Management)
- **Direct Campus Handover**: Specific handover locations listed (e.g., *Central Library*, *CS Block Lawn*, *Hostel Area*).

### 2. 🛡️ GL Bajaj Platform Admins (Chainsaw Man Anime Avatars)
The platform is moderated by 4 verified campus administrators:

| Admin Name | Username / Email | Password | Anime Avatar |
| :--- | :--- | :--- | :--- |
| **Saksham Singh** | `sakshamsingh` or `sakshamsingh@bookcycle.edu` | `sakshamsingh@123` | 🪚 **Denji (Protagonist)** |
| **Purvi** | `purvi` or `purvi@bookcycle.edu` | `purvi@123` | 👁️ **Makima** |
| **Priyanshi** | `priyanshi` or `priyanshi@bookcycle.edu` | `priyanshi@123` | 🌸 **Makima Portrait** |
| **Riya Singh** | `riyasingh` or `riyasingh@bookcycle.edu` | `riyasingh@123` | 💣 **Reze** |

> **Note**: Admins can log in using either their plain **username** (e.g. `sakshamsingh`) or their **full email** (`sakshamsingh@bookcycle.edu`), or by clicking the **1-Click Quick Login** buttons on the login page.

---

### 3. 🎨 Aesthetic & Visual Design
- **Theme**: Celestial Floating Books & Sunbeam Gold with deep Midnight Navy blue clouds.
- **Hardware-Accelerated Performance**: Dedicated GPU compositing layer (`transform: translateZ(0)`) for smooth 60fps/120fps scrolling.
- **Glassmorphism**: Translucent frosted panels (`glass-aesthetic`) with razor-thin golden hairline borders (`border: 1px solid rgba(245, 197, 66, 0.18)`).
- **Custom Scrollbar**: Golden thumb with midnight track.

---

### 4. ⚡ Core Application Architecture

```
COOL/
├── backend/                  # FastAPI REST API (Port 8000)
│   ├── app/
│   │   ├── routes/           # Auth, Books, Requests, Messages, Users, Admin
│   │   ├── models/           # Pydantic & database models
│   │   ├── utils/            # JWT security, password hashing, seeding
│   │   └── main.py           # FastAPI application entrypoint
│   └── data/                 # Resilient fallback JSON database store
│       ├── users.json
│       ├── books.json
│       ├── requests.json
│       └── transactions.json
│
└── frontend/                 # Vite React 18 + Tailwind CSS (Port 5173)
    ├── public/
    │   ├── background.png    # Floating books celestial background
    │   └── avatars/          # Anime avatars (denji, makima, power, reze, etc.)
    └── src/
        ├── components/       # Navbar, Footer, BookCard, ProtectedRoute
        ├── pages/            # Home, Browse, BookDetail, Dashboard, Login, FNF (404)
        └── index.css         # High-performance glassmorphism & GPU layers
```

---

## 🛠️ API Routes Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Authenticate with username or email + password |
| `GET` | `/api/auth/me` | Fetch currently authenticated user session |
| `POST` | `/api/auth/register` | Create a new student account |
| `GET` | `/api/books` | List, search, filter, and paginate textbooks |
| `GET` | `/api/books/{id}` | Retrieve individual textbook details |
| `POST` | `/api/books` | Create a new textbook listing |
| `GET` | `/api/requests/received` | Fetch incoming book requests |
| `GET` | `/api/requests/sent` | Fetch outgoing sent requests |
| `GET` | `/api/messages/threads` | List user conversation threads |
| `GET` | `/api/admin/stats` | Platform statistics and audit metrics |
| `GET` | `/api/health` | Service health status check |

---

## 🏃 Running the Application

### 1. Start the Backend:
```bash
cd backend
python -m uvicorn app.main:app --port 8000 --host 127.0.0.1
```

### 2. Start the Frontend:
```bash
cd frontend
npm run dev
```

### 3. Access URLs:
- **Web Application**: [http://localhost:5173](http://localhost:5173)
- **Login Portal**: [http://localhost:5173/login](http://localhost:5173/login)
- **404 / FNF Page**: [http://localhost:5173/fnf](http://localhost:5173/fnf)
- **API Documentation**: [http://localhost:8000/docs](http://localhost:8000/docs)

---
*© BookCycle • GL Bajaj Institute of Technology*
