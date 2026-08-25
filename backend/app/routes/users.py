from fastapi import APIRouter, HTTPException, status, Depends
from datetime import datetime
from app.schemas.auth_schemas import UserResponse, UserUpdate
from app.schemas.book_schemas import BookResponse
from app.database import get_db
from app.middleware.auth import get_current_user

router = APIRouter(prefix="/users", tags=["Users"])

@router.get("/{user_id}", response_model=UserResponse)
async def get_user_public_profile(user_id: str):
    db = get_db()
    users_coll = db.get_collection("users")
    user = await users_coll.find_one({"_id": user_id})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
    
    # Calculate live listings count
    books_coll = db.get_collection("books")
    listings_count = await books_coll.count_documents({"owner_id": user_id, "status": "available"})
    
    user_data = user.copy()
    user_data["id"] = str(user_data["_id"])
    user_data["listings_count"] = listings_count
    user_data.pop("password_hash", None)
    return user_data

@router.put("/me", response_model=UserResponse)
async def update_profile(profile_in: UserUpdate, current_user: dict = Depends(get_current_user)):
    db = get_db()
    users_coll = db.get_collection("users")
    
    update_fields = {}
    if profile_in.name is not None:
        update_fields["name"] = profile_in.name.strip()
    if profile_in.college is not None:
        update_fields["college"] = profile_in.college.strip()
    if profile_in.phone is not None:
        update_fields["phone"] = profile_in.phone.strip()
    if profile_in.profile_image is not None:
        update_fields["profile_image"] = profile_in.profile_image
    if profile_in.bio is not None:
        update_fields["bio"] = profile_in.bio.strip()
        
    update_fields["updated_at"] = datetime.utcnow().isoformat()
    
    await users_coll.update_one({"_id": current_user["_id"]}, {"$set": update_fields})
    
    updated_user = await users_coll.find_one({"_id": current_user["_id"]})
    user_data = updated_user.copy()
    user_data["id"] = str(user_data["_id"])
    user_data.pop("password_hash", None)
    return user_data

@router.get("/{user_id}/books")
async def get_user_books(user_id: str):
    db = get_db()
    books_coll = db.get_collection("books")
    cursor = books_coll.find({"owner_id": user_id}).sort("created_at", -1)
    books = await cursor.to_list(100)
    for b in books:
        b["id"] = str(b["_id"])
    return books
