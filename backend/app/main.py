import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.config import settings
from app.database import db
from app.utils.seed_data import seed_database
from app.routes import auth, users, books, wishlist, requests, transactions, messages, reviews, reports, admin

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: connect to database & seed initial records
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    os.makedirs(os.path.join(settings.UPLOAD_DIR, "books"), exist_ok=True)
    os.makedirs(os.path.join(settings.UPLOAD_DIR, "avatars"), exist_ok=True)
    
    await db.connect()
    await seed_database(db)
    yield
    # Shutdown
    await db.close()

app = FastAPI(
    title="BookCycle API",
    description="Student-focused marketplace and community platform to buy, sell, donate, and exchange textbooks.",
    version="1.0.0",
    lifespan=lifespan
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*", "http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static uploads directory for serving images
app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")

# Include API Routers
app.include_router(auth.router, prefix="/api")
app.include_router(users.router, prefix="/api")
app.include_router(books.router, prefix="/api")
app.include_router(wishlist.router, prefix="/api")
app.include_router(requests.router, prefix="/api")
app.include_router(transactions.router, prefix="/api")
app.include_router(messages.router, prefix="/api")
app.include_router(reviews.router, prefix="/api")
app.include_router(reports.router, prefix="/api")
app.include_router(admin.router, prefix="/api")

@app.get("/")
async def root():
    return {
        "message": "Welcome to BookCycle API — Give Books a Second Life",
        "version": "1.0.0",
        "docs": "/docs",
        "status": "healthy"
    }

@app.get("/api/health")
async def health_check():
    return {"status": "ok", "service": "BookCycle Backend"}
