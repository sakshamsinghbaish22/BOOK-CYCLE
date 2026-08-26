import os
from datetime import datetime
from app.utils.security import hash_password

# 4 platform administrators & contributors at GL Bajaj Institute of Technology (Alphabetical Order)
INITIAL_USERS = [
    {
        "_id": "user_admin_priyanshi",
        "name": "Priyanshi Chaudhary",
        "email": "priyanshi@bookcycle.edu",
        "password_hash": hash_password("priyanshi@123"),
        "college": "GL Bajaj Institute of Technology • Campus Admin",
        "phone": "+91 98223 44556",
        "profile_image": "/avatars/priyanshi.jpg",
        "role": "admin",
        "is_active": True,
        "rating": None,
        "review_count": 0,
        "completed_transactions": 0,
        "listings_count": 1,
        "bio": "BookCycle Admin at GL Bajaj Institute of Technology.",
        "created_at": datetime.utcnow().isoformat(),
        "updated_at": datetime.utcnow().isoformat()
    },
    {
        "_id": "user_admin_purvi",
        "name": "Purvi Chaurasia",
        "email": "purvi@bookcycle.edu",
        "password_hash": hash_password("purvi@123"),
        "college": "GL Bajaj Institute of Technology • Campus Admin",
        "phone": "+91 98112 33445",
        "profile_image": "/avatars/makima.jpg",
        "role": "admin",
        "is_active": True,
        "rating": None,
        "review_count": 0,
        "completed_transactions": 0,
        "listings_count": 1,
        "bio": "BookCycle Platform Admin at GL Bajaj Institute of Technology.",
        "created_at": datetime.utcnow().isoformat(),
        "updated_at": datetime.utcnow().isoformat()
    },
    {
        "_id": "user_admin_riya",
        "name": "Riya Singh",
        "email": "riyasingh@bookcycle.edu",
        "password_hash": hash_password("riyasingh@123"),
        "college": "GL Bajaj Institute of Technology • Campus Admin",
        "phone": "+91 98334 55667",
        "profile_image": "/avatars/reze.jpg",
        "role": "admin",
        "is_active": True,
        "rating": None,
        "review_count": 0,
        "completed_transactions": 0,
        "listings_count": 1,
        "bio": "BookCycle Admin at GL Bajaj Institute of Technology.",
        "created_at": datetime.utcnow().isoformat(),
        "updated_at": datetime.utcnow().isoformat()
    },
    {
        "_id": "user_admin_saksham",
        "name": "Saksham Singh",
        "email": "sakshamsingh@bookcycle.edu",
        "password_hash": hash_password("sakshamsingh@123"),
        "college": "GL Bajaj Institute of Technology • Campus Admin",
        "phone": "+91 98765 43210",
        "profile_image": "/avatars/denji.jpg",
        "role": "admin",
        "is_active": True,
        "rating": None,
        "review_count": 0,
        "completed_transactions": 0,
        "listings_count": 2,
        "bio": "BookCycle Lead Admin at GL Bajaj Institute of Technology. Chainsaw Man protagonist spirit.",
        "created_at": datetime.utcnow().isoformat(),
        "updated_at": datetime.utcnow().isoformat()
    }
]

INITIAL_BOOKS = [
    {
        "_id": "book_cs_001",
        "title": "Introduction to Algorithms (CLRS)",
        "author": "Thomas H. Cormen, Charles E. Leiserson, Ronald L. Rivest",
        "isbn": "978-0262033848",
        "category": "Computer Science & AI",
        "subject": "Data Structures & Algorithms",
        "edition": "3rd Edition",
        "description": "Standard textbook for Data Structures & Algorithms courses. Clean condition, shared by Saksham Singh for free student use at GL Bajaj.",
        "condition": "Like New",
        "listing_type": "Donate",
        "price": 0.00,
        "exchange_preferences": "",
        "images": [
            "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80"
        ],
        "college": "GL Bajaj Institute of Technology",
        "location_details": "Central Library / CS Block Lawn",
        "owner_id": "user_admin_saksham",
        "owner_name": "Saksham Singh",
        "owner_email": "sakshamsingh@bookcycle.edu",
        "owner_college": "GL Bajaj Institute of Technology",
        "status": "available",
        "views_count": 12,
        "created_at": datetime.utcnow().isoformat(),
        "updated_at": datetime.utcnow().isoformat()
    },
    {
        "_id": "book_cs_002",
        "title": "Concepts of Physics (Vol 1 & Vol 2)",
        "author": "Dr. H.C. Verma",
        "isbn": "978-8177091878",
        "category": "Competitive Entrance Exams",
        "subject": "Physics (Mechanics & Electromagnetism)",
        "edition": "Revised Edition",
        "description": "Physics foundation by Dr. H.C. Verma. Shared by Purvi for free student use at GL Bajaj.",
        "condition": "Good",
        "listing_type": "Donate",
        "price": 0.00,
        "exchange_preferences": "",
        "images": [
            "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&auto=format&fit=crop&q=80"
        ],
        "college": "GL Bajaj Institute of Technology",
        "location_details": "Block A / Canteen Area",
        "owner_id": "user_admin_purvi",
        "owner_name": "Purvi",
        "owner_email": "purvi@bookcycle.edu",
        "owner_college": "GL Bajaj Institute of Technology",
        "status": "available",
        "views_count": 15,
        "created_at": datetime.utcnow().isoformat(),
        "updated_at": datetime.utcnow().isoformat()
    },
    {
        "_id": "book_math_001",
        "title": "Higher Engineering Mathematics",
        "author": "Dr. B.S. Grewal",
        "isbn": "978-8193328491",
        "category": "Applied Mathematics",
        "subject": "Engineering Mathematics (Calculus & Linear Algebra)",
        "edition": "44th Edition",
        "description": "Calculus and linear algebra reference book for B.Tech students. Shared by Priyanshi.",
        "condition": "Like New",
        "listing_type": "Donate",
        "price": 0.00,
        "exchange_preferences": "",
        "images": [
            "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&auto=format&fit=crop&q=80"
        ],
        "college": "GL Bajaj Institute of Technology",
        "location_details": "Main Auditorium Foyer",
        "owner_id": "user_admin_priyanshi",
        "owner_name": "Priyanshi",
        "owner_email": "priyanshi@bookcycle.edu",
        "owner_college": "GL Bajaj Institute of Technology",
        "status": "available",
        "views_count": 9,
        "created_at": datetime.utcnow().isoformat(),
        "updated_at": datetime.utcnow().isoformat()
    },
    {
        "_id": "book_cs_003",
        "title": "Operating System Concepts",
        "author": "Silberschatz, Galvin, Gagne",
        "isbn": "978-8126554270",
        "category": "Computer Science & AI",
        "subject": "Operating Systems & Systems Programming",
        "edition": "9th Edition",
        "description": "Operating systems principles, memory management, and file systems. Shared by Saksham Singh at GL Bajaj.",
        "condition": "Good",
        "listing_type": "Donate",
        "price": 0.00,
        "exchange_preferences": "",
        "images": [
            "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80"
        ],
        "college": "GL Bajaj Institute of Technology",
        "location_details": "IT Department Lobby",
        "owner_id": "user_admin_saksham",
        "owner_name": "Saksham Singh",
        "owner_email": "sakshamsingh@bookcycle.edu",
        "owner_college": "GL Bajaj Institute of Technology",
        "status": "available",
        "views_count": 14,
        "created_at": datetime.utcnow().isoformat(),
        "updated_at": datetime.utcnow().isoformat()
    },
    {
        "_id": "book_mgmt_001",
        "title": "Marketing Management",
        "author": "Philip Kotler, Kevin Lane Keller",
        "isbn": "978-9332557185",
        "category": "Business & Management",
        "subject": "Marketing Strategy & Brand Management",
        "edition": "15th Edition",
        "description": "Marketing curriculum textbook. Shared by Riya Singh for free at GL Bajaj.",
        "condition": "Like New",
        "listing_type": "Donate",
        "price": 0.00,
        "exchange_preferences": "",
        "images": [
            "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80"
        ],
        "college": "GL Bajaj Institute of Technology",
        "location_details": "Management Block",
        "owner_id": "user_admin_riya",
        "owner_name": "Riya Singh",
        "owner_email": "riyasingh@bookcycle.edu",
        "owner_college": "GL Bajaj Institute of Technology",
        "status": "available",
        "views_count": 7,
        "created_at": datetime.utcnow().isoformat(),
        "updated_at": datetime.utcnow().isoformat()
    }
]

async def seed_database(db):
    users_coll = db.get_collection("users")
    books_coll = db.get_collection("books")
    
    for user in INITIAL_USERS:
        existing = await users_coll.find_one({"email": user["email"]})
        if existing:
            await users_coll.update_one({"email": user["email"]}, {"$set": user})
        else:
            await users_coll.insert_one(user)
            
    for book in INITIAL_BOOKS:
        existing = await books_coll.find_one({"_id": book["_id"]})
        if existing:
            await books_coll.update_one({"_id": book["_id"]}, {"$set": book})
        else:
            await books_coll.insert_one(book)
            
    print(f"[READY] Database synchronized with 4 admins and textbooks at GL Bajaj Institute of Technology.")
