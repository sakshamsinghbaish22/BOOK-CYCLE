# 📚 BookCycle — Give Books a Second Life

**BookCycle** is a modern, student-focused full-stack marketplace and campus platform where college students can **buy, sell, donate, and exchange** used academic and non-academic textbooks. Built to reduce educational expenses, promote zero-waste campus sustainability, and create a trusted peer-to-peer student community.

---

## 🌟 Key Features

- **🎓 Campus Marketplace & Catalog**:
  - Browse books with real-time multi-facet filtering (Category, Physical Condition, Listing Type, Price Range, Campus/College).
  - Search by Book Title, Author, ISBN, Course Subject, or Campus Keywords.
  - Sorting by Newest, Oldest, Price (Low to High / High to Low), and Popularity.
  - Support for **Sell for Cash**, **100% Free Donations**, and **1-to-1 Book Exchanges**.

- **📖 Book Details & Trust System**:
  - Image gallery with cover and detail photos.
  - Complete specifications: ISBN, Discipline, Subject, Edition, Physical Condition, Campus Location.
  - Seller profile card with verified student badge, star rating, and completed exchange metrics.
  - Interactive Action Modals: Request to Buy, Claim Free Book, or Offer Exchange with specific trade details.
  - Saved Wishlist toggle with instant reactive heart badges.
  - Abuse/Violation reporting modal.

- **🔄 Request & Transaction Lifecycle**:
  - Multi-intent proposals (Buy, Claim Free, or Exchange proposal).
  - Book owners can Accept or Decline incoming requests.
  - Accepting a request marks the textbook as **Reserved** and creates a dedicated **Campus Handoff Transaction**.
  - On completing the handoff, the textbook is updated to **Sold / Donated / Exchanged**, updating students' transaction stats.

- **💬 Real-Time Messaging & Direct Student Chat**:
  - Two-way student chat for coordinating safe campus meetups (Library, Student Union, Dorm Lobby).
  - Top book context card in active chat showing the textbook under discussion.
  - Unread message counters and responsive thread switching.

- **⭐ Verified Peer Reviews & Ratings**:
  - 1–5 Star rating and written feedback unlocked after verified completed transactions.
  - Dynamic recalculation of average student ratings.

- **🛡️ Admin Moderation & Operations Portal**:
  - High-level KPI metrics (Total users, active listings, completed exchanges, pending reports).
  - Student account moderation (Activate/Suspend accounts).
  - Listing moderation (Remove inappropriate or scam listings).
  - Report resolution console (Take action or dismiss reports).

- **⚡ 1-Click Demo Logins**:
  - Instant quick-switch logins for **Student Buyer (Alex)**, **Book Seller (Elena)**, and **Platform Admin (Sarah)** on the Login page for seamless hackathon and evaluation demonstrations.

---

## 🏗️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, Vite, Tailwind CSS, React Router v7, Axios, Lucide React |
| **Backend** | Python 3.14, FastAPI, Uvicorn, Pydantic v2, Pydantic Settings |
| **Database** | MongoDB (Motor async driver) + Resilient Zero-Config Fallback Store |
| **Security** | JWT Authentication, Bcrypt Password Hashing, Role-Based Route Guards |
| **Storage** | Multipart Image Upload with extension & size validation + Static file serving |

---

## 📁 Project Architecture

```
BookCycle/
├── backend/
│   ├── app/
│   │   ├── main.py                   # FastAPI initialization, CORS, static mounts, route setup
│   │   ├── config.py                 # Pydantic Settings & environment config
│   │   ├── database.py               # Motor MongoDB async client & fallback store
│   │   ├── middleware/
│   │   │   └── auth.py               # get_current_user, get_current_admin
│   │   ├── models/
│   │   ├── schemas/                  # Pydantic validation schemas (Auth, Book, Request, etc.)
│   │   ├── routes/
│   │   │   ├── auth.py               # Register, Login, Me
│   │   │   ├── users.py              # Profile, Update, Public listings
│   │   │   ├── books.py              # Book CRUD, multi-facet search/filter, image upload
│   │   │   ├── wishlist.py           # Wishlist toggle & list
│   │   │   ├── requests.py           # Buy, Donate, Exchange requests
│   │   │   ├── transactions.py       # In-progress & completed handoffs
│   │   │   ├── messages.py           # Peer chat threads and messages
│   │   │   ├── reviews.py            # 1-5 Star reviews after completed handoffs
│   │   │   ├── reports.py            # Content abuse reporting
│   │   │   └── admin.py              # Platform stats, user & listing moderation
│   │   └── utils/
│   │       ├── security.py           # Bcrypt hashing & JWT encoding/decoding
│   │       ├── file_upload.py        # Validated image handler
│   │       └── seed_data.py          # Demo users and 8+ university textbooks
│   ├── uploads/                      # Local uploaded image storage
│   ├── seed_data.py                  # Standalone CLI database seed script
│   ├── test_api.py                   # 16-suite end-to-end automated test runner
│   ├── requirements.txt
│   ├── .env.example
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx            # Header with responsive mobile menu & user popover
│   │   │   ├── Footer.jsx            # Footer with sustainability mission & links
│   │   │   ├── BookCard.jsx          # Book card with badges & wishlist heart
│   │   │   ├── BookFilter.jsx        # Multi-facet category/condition/price filter sidebar
│   │   │   ├── SearchBar.jsx         # Live search bar with instant clear
│   │   │   ├── Pagination.jsx        # Pagination control
│   │   │   ├── RequestModal.jsx      # Buy / Donate / Exchange proposal modal
│   │   │   ├── ReviewModal.jsx       # 1-5 Star rating & written feedback modal
│   │   │   ├── ReportModal.jsx       # Inappropriate listing/user report modal
│   │   │   ├── LoadingSkeleton.jsx   # Loading skeleton placeholders
│   │   │   └── ProtectedRoute.jsx    # Authentication & role route guard
│   │   ├── pages/
│   │   │   ├── HomePage.jsx          # Landing page with hero, categories, stats, CTA
│   │   │   ├── BrowseBooksPage.jsx   # Marketplace catalog with live search & filters
│   │   │   ├── BookDetailPage.jsx    # Gallery, specs, owner card, request modal
│   │   │   ├── CreateListingPage.jsx # Multi-image upload, condition, pricing
│   │   │   ├── EditListingPage.jsx   # Modify listing & status
│   │   │   ├── UserDashboardPage.jsx # Tabs: Overview, Listings, Requests, Deals, Wishlist
│   │   │   ├── UserProfilePage.jsx   # Public student profile with rating & reviews
│   │   │   ├── EditProfilePage.jsx   # Update name, college, avatar, phone, bio
│   │   │   ├── MessagesPage.jsx      # Split chat interface with textbook context
│   │   │   ├── AdminDashboardPage.jsx# Admin metrics, user moderation, report review
│   │   │   ├── LoginPage.jsx         # Login with 1-Click Demo buttons
│   │   │   ├── RegisterPage.jsx      # Student registration
│   │   │   ├── AboutPage.jsx         # Mission & campus safety guidelines
│   │   │   └── NotFoundPage.jsx      # 404 page
│   │   ├── context/
│   │   │   ├── AuthContext.jsx       # Global auth state & session persistence
│   │   │   └── WishlistContext.jsx   # Global wishlist reactive count & ids
│   │   ├── services/                 # Axios API service modules
│   │   ├── utils/                    # Formatting & badge utilities
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css                 # Tailwind CSS directives
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
└── README.md
```

---

## 🚀 Getting Started & Local Setup

### Prerequisites
- **Python 3.10+** (Python 3.14 supported)
- **Node.js 18+** and **npm**

---

### 1. Backend Setup

1. Open a terminal and navigate to `backend/`:
   ```bash
   cd backend
   ```

2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Configure environment variables (optional, `.env` is pre-configured):
   ```bash
   cp .env.example .env
   ```

4. Start the FastAPI server:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```
   - API will be accessible at: `http://localhost:8000`
   - Interactive Swagger API Docs at: `http://localhost:8000/docs`

---

### 2. Frontend Setup

1. Open another terminal and navigate to `frontend/`:
   ```bash
   cd frontend
   ```

2. Install npm dependencies (if not already installed):
   ```bash
   npm install
   ```

3. Start the Vite React development server:
   ```bash
   npm run dev
   ```
   - Frontend will be accessible at: `http://localhost:5173`

---

## 🔑 Demo Accounts & Credentials

For quick evaluation and hackathon demonstrations, the Login page (`/login`) includes **1-Click Demo Login** buttons:

| Role | Email | Password | Details |
|---|---|---|---|
| **🎓 Student Buyer** | `student@bookcycle.edu` | `Student123!` | Alex Rivera (Stanford University) |
| **📚 Book Seller** | `seller@bookcycle.edu` | `Seller123!` | Elena Rostova (MIT) |
| **🛡️ Platform Admin** | `admin@bookcycle.edu` | `Admin123!` | Sarah Jenkins (Campus Moderation) |

---

## 🧪 Running Automated Integration Tests

BookCycle includes a 16-suite end-to-end integration test verifying authentication, search, listing creation, wishlist, requests, transaction handoff, 5-star reviews, chat messaging, and admin moderation:

```bash
cd backend
python test_api.py
```

---

## 📄 License
MIT License. Created with ❤️ for student communities everywhere.
