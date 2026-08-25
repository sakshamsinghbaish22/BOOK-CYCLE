from fastapi import APIRouter, HTTPException, status, Depends
from typing import List, Optional
from datetime import datetime
from app.schemas.admin_schemas import AdminStatsResponse, UserManagementUpdate
from app.schemas.auth_schemas import UserResponse
from app.schemas.book_schemas import BookResponse
from app.schemas.report_schemas import ReportResponse
from app.database import get_db
from app.middleware.auth import get_current_admin

router = APIRouter(prefix="/admin", tags=["Admin"])

@router.get("/stats", response_model=AdminStatsResponse)
async def get_admin_stats(current_admin: dict = Depends(get_current_admin)):
    db = get_db()
    users_coll = db.get_collection("users")
    books_coll = db.get_collection("books")
    transactions_coll = db.get_collection("transactions")
    reports_coll = db.get_collection("reports")
    messages_coll = db.get_collection("messages")
    
    total_users = await users_coll.count_documents()
    total_listings = await books_coll.count_documents()
    active_listings = await books_coll.count_documents({"status": "available"})
    sold_listings = await books_coll.count_documents({"status": {"$in": ["sold", "donated", "exchanged"]}})
    total_transactions = await transactions_coll.count_documents()
    completed_transactions = await transactions_coll.count_documents({"status": "completed"})
    total_reports = await reports_coll.count_documents()
    pending_reports = await reports_coll.count_documents({"status": "pending"})
    total_messages = await messages_coll.count_documents()
    
    # Recent items
    u_cursor = users_coll.find().sort("created_at", -1).limit(5)
    raw_users = await u_cursor.to_list(5)
    recent_users = []
    for u in raw_users:
        u_data = u.copy()
        u_data["id"] = str(u_data["_id"])
        u_data.pop("password_hash", None)
        recent_users.append(UserResponse(**u_data))
        
    b_cursor = books_coll.find().sort("created_at", -1).limit(5)
    raw_books = await b_cursor.to_list(5)
    recent_listings = []
    for b in raw_books:
        b_data = b.copy()
        b_data["id"] = str(b_data["_id"])
        recent_listings.append(BookResponse(**b_data))
        
    r_cursor = reports_coll.find().sort("created_at", -1).limit(5)
    raw_reps = await r_cursor.to_list(5)
    recent_reports = []
    for r in raw_reps:
        r_data = r.copy()
        r_data["id"] = str(r_data["_id"])
        recent_reports.append(ReportResponse(**r_data))
        
    return {
        "total_users": total_users,
        "total_listings": total_listings,
        "active_listings": active_listings,
        "sold_listings": sold_listings,
        "total_transactions": total_transactions,
        "completed_transactions": completed_transactions,
        "total_reports": total_reports,
        "pending_reports": pending_reports,
        "total_messages": total_messages,
        "recent_users": recent_users,
        "recent_listings": recent_listings,
        "recent_reports": recent_reports
    }

@router.get("/users", response_model=List[UserResponse])
async def list_all_users(current_admin: dict = Depends(get_current_admin)):
    db = get_db()
    users_coll = db.get_collection("users")
    cursor = users_coll.find().sort("created_at", -1)
    raw_users = await cursor.to_list(200)
    items = []
    for u in raw_users:
        u_data = u.copy()
        u_data["id"] = str(u_data["_id"])
        u_data.pop("password_hash", None)
        items.append(UserResponse(**u_data))
    return items

@router.put("/users/{user_id}/manage", response_model=UserResponse)
async def manage_user(
    user_id: str,
    update_in: UserManagementUpdate,
    current_admin: dict = Depends(get_current_admin)
):
    db = get_db()
    users_coll = db.get_collection("users")
    user = await users_coll.find_one({"_id": user_id})
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
        
    update_fields = {}
    if update_in.is_active is not None:
        update_fields["is_active"] = update_in.is_active
    if update_in.role is not None:
        update_fields["role"] = update_in.role
        
    update_fields["updated_at"] = datetime.utcnow().isoformat()
    await users_coll.update_one({"_id": user_id}, {"$set": update_fields})
    
    updated = await users_coll.find_one({"_id": user_id})
    u_data = updated.copy()
    u_data["id"] = str(u_data["_id"])
    u_data.pop("password_hash", None)
    return UserResponse(**u_data)

@router.get("/listings", response_model=List[BookResponse])
async def list_all_listings(current_admin: dict = Depends(get_current_admin)):
    db = get_db()
    books_coll = db.get_collection("books")
    cursor = books_coll.find().sort("created_at", -1)
    raw_books = await cursor.to_list(200)
    items = []
    for b in raw_books:
        b_data = b.copy()
        b_data["id"] = str(b_data["_id"])
        items.append(BookResponse(**b_data))
    return items
