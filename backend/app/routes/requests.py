import uuid
from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, HTTPException, status, Depends
from app.schemas.request_schemas import RequestCreate, RequestResponse, RequestStatusUpdate
from app.database import get_db
from app.middleware.auth import get_current_user

router = APIRouter(prefix="/requests", tags=["Requests"])

@router.post("", response_model=RequestResponse, status_code=status.HTTP_201_CREATED)
async def create_request(
    req_in: RequestCreate,
    current_user: dict = Depends(get_current_user)
):
    db = get_db()
    books_coll = db.get_collection("books")
    requests_coll = db.get_collection("requests")
    
    book = await books_coll.find_one({"_id": req_in.book_id})
    if not book:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Book not found")
        
    user_id = str(current_user["_id"])
    if book.get("owner_id") == user_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You cannot make a request for your own book listing",
        )
        
    if book.get("status") not in ["available", "reserved"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"This book is currently {book.get('status')} and not available for new requests",
        )
        
    # Check for duplicate pending request
    existing_req = await requests_coll.find_one({
        "book_id": req_in.book_id,
        "requester_id": user_id,
        "status": "pending"
    })
    if existing_req:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You already have a pending request for this book",
        )
        
    req_id = f"req_{uuid.uuid4().hex[:12]}"
    now = datetime.utcnow().isoformat()
    
    book_images = book.get("images", [])
    first_image = book_images[0] if book_images else ""
    
    new_request = {
        "_id": req_id,
        "book_id": req_in.book_id,
        "book_title": book.get("title", ""),
        "book_image": first_image,
        "book_price": book.get("price", 0.0),
        "book_listing_type": book.get("listing_type", "Sell"),
        "requester_id": user_id,
        "requester_name": current_user.get("name", "Student"),
        "requester_college": current_user.get("college", ""),
        "requester_avatar": current_user.get("profile_image", ""),
        "owner_id": str(book.get("owner_id")),
        "owner_name": book.get("owner_name", ""),
        "owner_college": book.get("owner_college", ""),
        "request_type": req_in.request_type,
        "offered_exchange_item": req_in.offered_exchange_item or "",
        "message": req_in.message or "",
        "contact_phone": req_in.contact_phone or current_user.get("phone", ""),
        "status": "pending",
        "created_at": now,
        "updated_at": now
    }
    
    await requests_coll.insert_one(new_request)
    
    res_data = new_request.copy()
    res_data["id"] = req_id
    return RequestResponse(**res_data)

@router.get("/sent", response_model=List[RequestResponse])
async def get_my_sent_requests(current_user: dict = Depends(get_current_user)):
    db = get_db()
    requests_coll = db.get_collection("requests")
    cursor = requests_coll.find({"requester_id": str(current_user["_id"])}).sort("created_at", -1)
    raw_reqs = await cursor.to_list(100)
    items = []
    for r in raw_reqs:
        r_data = r.copy()
        r_data["id"] = str(r_data["_id"])
        items.append(RequestResponse(**r_data))
    return items

@router.get("/received", response_model=List[RequestResponse])
async def get_my_received_requests(current_user: dict = Depends(get_current_user)):
    db = get_db()
    requests_coll = db.get_collection("requests")
    cursor = requests_coll.find({"owner_id": str(current_user["_id"])}).sort("created_at", -1)
    raw_reqs = await cursor.to_list(100)
    items = []
    for r in raw_reqs:
        r_data = r.copy()
        r_data["id"] = str(r_data["_id"])
        items.append(RequestResponse(**r_data))
    return items

@router.put("/{req_id}/status", response_model=RequestResponse)
async def update_request_status(
    req_id: str,
    status_in: RequestStatusUpdate,
    current_user: dict = Depends(get_current_user)
):
    db = get_db()
    requests_coll = db.get_collection("requests")
    books_coll = db.get_collection("books")
    transactions_coll = db.get_collection("transactions")
    
    req = await requests_coll.find_one({"_id": req_id})
    if not req:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Request not found")
        
    user_id = str(current_user["_id"])
    is_owner = req.get("owner_id") == user_id
    is_requester = req.get("requester_id") == user_id
    
    if not is_owner and not is_requester and current_user.get("role") != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Unauthorized")
        
    now = datetime.utcnow().isoformat()
    new_status = status_in.status.lower()
    
    if new_status in ["accepted", "rejected"] and not is_owner and current_user.get("role") != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only the book owner can accept or reject requests")
        
    if new_status == "cancelled" and not is_requester and current_user.get("role") != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only the requester can cancel this request")
        
    await requests_coll.update_one(
        {"_id": req_id},
        {"$set": {"status": new_status, "updated_at": now}}
    )
    
    # If accepted, mark book as reserved and create a Transaction record
    if new_status == "accepted":
        await books_coll.update_one({"_id": req["book_id"]}, {"$set": {"status": "reserved"}})
        
        # Check if transaction already exists
        existing_tx = await transactions_coll.find_one({"request_id": req_id})
        if not existing_tx:
            tx_id = f"tx_{uuid.uuid4().hex[:12]}"
            new_tx = {
                "_id": tx_id,
                "request_id": req_id,
                "book_id": req["book_id"],
                "book_title": req.get("book_title"),
                "book_image": req.get("book_image"),
                "requester_id": req["requester_id"],
                "requester_name": req.get("requester_name"),
                "owner_id": req["owner_id"],
                "owner_name": req.get("owner_name"),
                "transaction_type": req.get("request_type", "buy"),
                "amount": req.get("book_price", 0.0),
                "status": "in_progress",
                "is_reviewed_by_requester": False,
                "is_reviewed_by_owner": False,
                "created_at": now,
                "completed_at": None
            }
            await transactions_coll.insert_one(new_tx)
            
    elif new_status in ["rejected", "cancelled"]:
        # If no other accepted requests exist for this book, return to available
        accepted_reqs = await requests_coll.count_documents({"book_id": req["book_id"], "status": "accepted"})
        if accepted_reqs == 0:
            await books_coll.update_one({"_id": req["book_id"]}, {"$set": {"status": "available"}})

    updated_req = await requests_coll.find_one({"_id": req_id})
    res_data = updated_req.copy()
    res_data["id"] = str(res_data["_id"])
    return RequestResponse(**res_data)
