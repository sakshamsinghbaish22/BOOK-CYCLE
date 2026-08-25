import os
import uuid
from datetime import datetime
from typing import Optional, List
from fastapi import APIRouter, HTTPException, status, Depends, Query, UploadFile, File
from app.schemas.book_schemas import BookCreate, BookUpdate, BookResponse, BookListResponse
from app.database import get_db
from app.middleware.auth import get_current_user, get_optional_current_user
from app.utils.file_upload import save_uploaded_image

router = APIRouter(prefix="/books", tags=["Books"])

@router.get("", response_model=BookListResponse)
async def list_books(
    search: Optional[str] = None,
    category: Optional[str] = None,
    condition: Optional[str] = None,
    listing_type: Optional[str] = None,
    college: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    status_filter: Optional[str] = "available",
    sort_by: Optional[str] = "newest", # newest, oldest, price_asc, price_desc, popular
    page: int = Query(1, ge=1),
    limit: int = Query(12, ge=1, le=50),
):
    db = get_db()
    books_coll = db.get_collection("books")
    
    query = {}
    if status_filter and status_filter != "all":
        query["status"] = status_filter
        
    if category and category != "All":
        query["category"] = category
        
    if condition and condition != "All":
        query["condition"] = condition
        
    if listing_type and listing_type != "All":
        query["listing_type"] = listing_type
        
    if college and college != "All":
        query["college"] = {"$regex": college}
        
    if min_price is not None or max_price is not None:
        price_query = {}
        if min_price is not None:
            price_query["$gte"] = min_price
        if max_price is not None:
            price_query["$lte"] = max_price
        query["price"] = price_query
        
    if search:
        s = search.strip()
        query["$or"] = [
            {"title": {"$regex": s}},
            {"author": {"$regex": s}},
            {"isbn": {"$regex": s}},
            {"subject": {"$regex": s}},
            {"description": {"$regex": s}},
            {"college": {"$regex": s}}
        ]
        
    total = await books_coll.count_documents(query)
    
    # Sorting
    cursor = books_coll.find(query)
    if sort_by == "newest":
        cursor = cursor.sort("created_at", -1)
    elif sort_by == "oldest":
        cursor = cursor.sort("created_at", 1)
    elif sort_by == "price_asc":
        cursor = cursor.sort("price", 1)
    elif sort_by == "price_desc":
        cursor = cursor.sort("price", -1)
    elif sort_by == "popular":
        cursor = cursor.sort("views_count", -1)
    else:
        cursor = cursor.sort("created_at", -1)
        
    skip = (page - 1) * limit
    cursor = cursor.skip(skip).limit(limit)
    
    raw_books = await cursor.to_list(limit)
    
    items = []
    for b in raw_books:
        b_data = b.copy()
        b_data["id"] = str(b_data["_id"])
        items.append(BookResponse(**b_data))
        
    pages = (total + limit - 1) // limit if total > 0 else 1
    
    return {
        "items": items,
        "total": total,
        "page": page,
        "limit": limit,
        "pages": pages
    }

@router.get("/categories")
async def get_categories():
    return [
        {"name": "Computer Science", "count": 12, "icon": "Code"},
        {"name": "Engineering", "count": 8, "icon": "Cpu"},
        {"name": "Mathematics", "count": 6, "icon": "Calculator"},
        {"name": "Management", "count": 5, "icon": "Briefcase"},
        {"name": "Competitive Exams", "count": 9, "icon": "GraduationCap"},
        {"name": "Literature", "count": 7, "icon": "BookOpen"},
        {"name": "Medicine & Healthcare", "count": 4, "icon": "Activity"},
        {"name": "Natural Sciences", "count": 5, "icon": "FlaskConical"},
    ]

@router.post("/upload-image")
async def upload_book_image(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user)
):
    url = await save_uploaded_image(file, subfolder="books")
    return {"url": url}

@router.post("", response_model=BookResponse, status_code=status.HTTP_201_CREATED)
async def create_book(
    book_in: BookCreate,
    current_user: dict = Depends(get_current_user)
):
    db = get_db()
    books_coll = db.get_collection("books")
    users_coll = db.get_collection("users")
    
    # Validation based on listing type
    if book_in.listing_type == "Donate":
        price = 0.0
    elif book_in.listing_type == "Sell" and book_in.price <= 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Sale listings must specify a price greater than zero",
        )
    else:
        price = book_in.price

    book_id = f"book_{uuid.uuid4().hex[:12]}"
    now = datetime.utcnow().isoformat()
    
    # Default fallback book image if none uploaded
    images = book_in.images
    if not images:
        images = ["https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80"]
        
    new_book = {
        "_id": book_id,
        "title": book_in.title.strip(),
        "author": book_in.author.strip(),
        "isbn": book_in.isbn.strip() if book_in.isbn else "",
        "category": book_in.category,
        "subject": book_in.subject.strip() if book_in.subject else "",
        "edition": book_in.edition.strip() if book_in.edition else "",
        "description": book_in.description.strip(),
        "condition": book_in.condition,
        "listing_type": book_in.listing_type,
        "price": price,
        "exchange_preferences": book_in.exchange_preferences.strip() if book_in.exchange_preferences else "",
        "images": images,
        "owner_id": str(current_user["_id"]),
        "owner_name": current_user.get("name", "Student"),
        "owner_email": current_user.get("email", ""),
        "owner_college": current_user.get("college", ""),
        "owner_rating": current_user.get("rating", 5.0),
        "owner_avatar": current_user.get("profile_image", ""),
        "college": book_in.college or current_user.get("college", "University Campus"),
        "location_details": book_in.location_details or "Campus Library / Student Union",
        "status": "available",
        "views_count": 1,
        "wishlist_count": 0,
        "created_at": now,
        "updated_at": now
    }
    
    await books_coll.insert_one(new_book)
    
    # Increment user's listings count
    await users_coll.update_one(
        {"_id": current_user["_id"]},
        {"$set": {"listings_count": current_user.get("listings_count", 0) + 1}}
    )
    
    book_data = new_book.copy()
    book_data["id"] = book_id
    return BookResponse(**book_data)

@router.get("/{book_id}", response_model=BookResponse)
async def get_book_details(book_id: str):
    db = get_db()
    books_coll = db.get_collection("books")
    book = await books_coll.find_one({"_id": book_id})
    if not book:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Book not found",
        )
        
    # Increment view count
    new_views = book.get("views_count", 0) + 1
    await books_coll.update_one({"_id": book_id}, {"$set": {"views_count": new_views}})
    book["views_count"] = new_views
    
    book_data = book.copy()
    book_data["id"] = str(book_data["_id"])
    return BookResponse(**book_data)

@router.put("/{book_id}", response_model=BookResponse)
async def update_book(
    book_id: str,
    book_in: BookUpdate,
    current_user: dict = Depends(get_current_user)
):
    db = get_db()
    books_coll = db.get_collection("books")
    book = await books_coll.find_one({"_id": book_id})
    if not book:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Book not found")
        
    if book.get("owner_id") != str(current_user["_id"]) and current_user.get("role") != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to update this listing",
        )
        
    update_data = {k: v for k, v in book_in.dict().items() if v is not None}
    update_data["updated_at"] = datetime.utcnow().isoformat()
    
    await books_coll.update_one({"_id": book_id}, {"$set": update_data})
    
    updated_book = await books_coll.find_one({"_id": book_id})
    updated_book["id"] = str(updated_book["_id"])
    return BookResponse(**updated_book)

@router.delete("/{book_id}", status_code=status.HTTP_200_OK)
async def delete_book(
    book_id: str,
    current_user: dict = Depends(get_current_user)
):
    db = get_db()
    books_coll = db.get_collection("books")
    book = await books_coll.find_one({"_id": book_id})
    if not book:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Book not found")
        
    if book.get("owner_id") != str(current_user["_id"]) and current_user.get("role") != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to delete this listing",
        )
        
    await books_coll.delete_one({"_id": book_id})
    return {"message": "Listing successfully deleted", "id": book_id}
