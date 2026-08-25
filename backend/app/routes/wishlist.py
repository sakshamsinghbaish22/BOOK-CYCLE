import uuid
from datetime import datetime
from fastapi import APIRouter, HTTPException, status, Depends
from app.database import get_db
from app.middleware.auth import get_current_user
from app.schemas.book_schemas import BookResponse

router = APIRouter(prefix="/wishlist", tags=["Wishlist"])

@router.get("")
async def get_my_wishlist(current_user: dict = Depends(get_current_user)):
    db = get_db()
    wishlist_coll = db.get_collection("wishlist")
    books_coll = db.get_collection("books")
    
    cursor = wishlist_coll.find({"user_id": str(current_user["_id"])}).sort("created_at", -1)
    entries = await cursor.to_list(100)
    
    items = []
    for entry in entries:
        book = await books_coll.find_one({"_id": entry["book_id"]})
        if book:
            b_data = book.copy()
            b_data["id"] = str(b_data["_id"])
            b_data["wishlisted_at"] = entry.get("created_at")
            items.append(b_data)
            
    return items

@router.post("/{book_id}")
async def add_to_wishlist(book_id: str, current_user: dict = Depends(get_current_user)):
    db = get_db()
    wishlist_coll = db.get_collection("wishlist")
    books_coll = db.get_collection("books")
    
    book = await books_coll.find_one({"_id": book_id})
    if not book:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Book not found")
        
    user_id = str(current_user["_id"])
    existing = await wishlist_coll.find_one({"user_id": user_id, "book_id": book_id})
    if existing:
        return {"message": "Already in wishlist", "is_wishlisted": True}
        
    entry_id = f"wish_{uuid.uuid4().hex[:12]}"
    await wishlist_coll.insert_one({
        "_id": entry_id,
        "user_id": user_id,
        "book_id": book_id,
        "created_at": datetime.utcnow().isoformat()
    })
    
    # Increment book wishlist count
    new_count = book.get("wishlist_count", 0) + 1
    await books_coll.update_one({"_id": book_id}, {"$set": {"wishlist_count": new_count}})
    
    return {"message": "Added to wishlist", "is_wishlisted": True, "wishlist_count": new_count}

@router.delete("/{book_id}")
async def remove_from_wishlist(book_id: str, current_user: dict = Depends(get_current_user)):
    db = get_db()
    wishlist_coll = db.get_collection("wishlist")
    books_coll = db.get_collection("books")
    
    user_id = str(current_user["_id"])
    result = await wishlist_coll.delete_one({"user_id": user_id, "book_id": book_id})
    
    book = await books_coll.find_one({"_id": book_id})
    if book:
        new_count = max(0, book.get("wishlist_count", 1) - 1)
        await books_coll.update_one({"_id": book_id}, {"$set": {"wishlist_count": new_count}})
        
    return {"message": "Removed from wishlist", "is_wishlisted": False}

@router.get("/check/{book_id}")
async def check_is_wishlisted(book_id: str, current_user: dict = Depends(get_current_user)):
    db = get_db()
    wishlist_coll = db.get_collection("wishlist")
    user_id = str(current_user["_id"])
    existing = await wishlist_coll.find_one({"user_id": user_id, "book_id": book_id})
    return {"is_wishlisted": existing is not None}
