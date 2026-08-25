import uuid
from datetime import datetime
from typing import List
from fastapi import APIRouter, HTTPException, status, Depends
from app.schemas.review_schemas import ReviewCreate, ReviewResponse
from app.database import get_db
from app.middleware.auth import get_current_user

router = APIRouter(prefix="/reviews", tags=["Reviews"])

@router.post("", response_model=ReviewResponse, status_code=status.HTTP_201_CREATED)
async def create_review(
    review_in: ReviewCreate,
    current_user: dict = Depends(get_current_user)
):
    db = get_db()
    reviews_coll = db.get_collection("reviews")
    transactions_coll = db.get_collection("transactions")
    users_coll = db.get_collection("users")
    
    reviewer_id = str(current_user["_id"])
    if reviewer_id == review_in.target_user_id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="You cannot review yourself")
        
    # Verify transaction exists and is completed
    tx = await transactions_coll.find_one({"_id": review_in.transaction_id})
    if not tx:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Transaction not found")
        
    if tx.get("status") != "completed":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Reviews can only be submitted after a transaction has been completed",
        )
        
    if reviewer_id not in [tx.get("requester_id"), tx.get("owner_id")]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You are not a participant in this transaction")
        
    # Check if already reviewed for this transaction
    existing = await reviews_coll.find_one({
        "reviewer_id": reviewer_id,
        "transaction_id": review_in.transaction_id
    })
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You have already submitted a review for this completed transaction",
        )
        
    rev_id = f"rev_{uuid.uuid4().hex[:12]}"
    now = datetime.utcnow().isoformat()
    
    new_rev = {
        "_id": rev_id,
        "reviewer_id": reviewer_id,
        "reviewer_name": current_user.get("name", "Student"),
        "reviewer_avatar": current_user.get("profile_image", ""),
        "reviewer_college": current_user.get("college", ""),
        "target_user_id": review_in.target_user_id,
        "transaction_id": review_in.transaction_id,
        "rating": review_in.rating,
        "comment": review_in.comment.strip(),
        "created_at": now
    }
    
    await reviews_coll.insert_one(new_rev)
    
    # Recalculate target user's rating & review count
    cursor = reviews_coll.find({"target_user_id": review_in.target_user_id})
    all_user_reviews = await cursor.to_list(500)
    if all_user_reviews:
        total_stars = sum(r.get("rating", 5) for r in all_user_reviews)
        avg_rating = round(total_stars / len(all_user_reviews), 1)
        await users_coll.update_one(
            {"_id": review_in.target_user_id},
            {"$set": {"rating": avg_rating, "review_count": len(all_user_reviews)}}
        )
        
    # Mark review flag on transaction
    if reviewer_id == tx.get("requester_id"):
        await transactions_coll.update_one({"_id": tx["_id"]}, {"$set": {"is_reviewed_by_requester": True}})
    else:
        await transactions_coll.update_one({"_id": tx["_id"]}, {"$set": {"is_reviewed_by_owner": True}})

    res_data = new_rev.copy()
    res_data["id"] = rev_id
    return ReviewResponse(**res_data)

@router.get("/user/{user_id}", response_model=List[ReviewResponse])
async def get_user_reviews(user_id: str):
    db = get_db()
    reviews_coll = db.get_collection("reviews")
    cursor = reviews_coll.find({"target_user_id": user_id}).sort("created_at", -1)
    raw_revs = await cursor.to_list(100)
    items = []
    for r in raw_revs:
        r_data = r.copy()
        r_data["id"] = str(r_data["_id"])
        items.append(ReviewResponse(**r_data))
    return items
