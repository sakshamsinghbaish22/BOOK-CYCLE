from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, HTTPException, status, Depends
from app.schemas.transaction_schemas import TransactionResponse, TransactionUpdate
from app.database import get_db
from app.middleware.auth import get_current_user

router = APIRouter(prefix="/transactions", tags=["Transactions"])

@router.get("", response_model=List[TransactionResponse])
async def get_my_transactions(current_user: dict = Depends(get_current_user)):
    db = get_db()
    transactions_coll = db.get_collection("transactions")
    user_id = str(current_user["_id"])
    
    cursor = transactions_coll.find({
        "$or": [
            {"requester_id": user_id},
            {"owner_id": user_id}
        ]
    }).sort("created_at", -1)
    
    raw_txs = await cursor.to_list(100)
    items = []
    for tx in raw_txs:
        tx_data = tx.copy()
        tx_data["id"] = str(tx_data["_id"])
        items.append(TransactionResponse(**tx_data))
    return items

@router.put("/{tx_id}/status", response_model=TransactionResponse)
async def update_transaction_status(
    tx_id: str,
    tx_in: TransactionUpdate,
    current_user: dict = Depends(get_current_user)
):
    db = get_db()
    transactions_coll = db.get_collection("transactions")
    books_coll = db.get_collection("books")
    users_coll = db.get_collection("users")
    requests_coll = db.get_collection("requests")
    
    tx = await transactions_coll.find_one({"_id": tx_id})
    if not tx:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Transaction not found")
        
    user_id = str(current_user["_id"])
    is_owner = tx.get("owner_id") == user_id
    is_requester = tx.get("requester_id") == user_id
    
    if not is_owner and not is_requester and current_user.get("role") != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Unauthorized")
        
    now = datetime.utcnow().isoformat()
    new_status = tx_in.status.lower()
    
    if new_status == "completed":
        # Mark transaction completed
        await transactions_coll.update_one(
            {"_id": tx_id},
            {"$set": {"status": "completed", "completed_at": now}}
        )
        
        # Mark request completed
        await requests_coll.update_one(
            {"_id": tx.get("request_id")},
            {"$set": {"status": "completed", "updated_at": now}}
        )
        
        # Update book status according to listing type
        book = await books_coll.find_one({"_id": tx.get("book_id")})
        if book:
            ltype = book.get("listing_type", "Sell").lower()
            if ltype == "sell":
                target_book_status = "sold"
            elif ltype == "donate":
                target_book_status = "donated"
            elif ltype == "exchange":
                target_book_status = "exchanged"
            else:
                target_book_status = "sold"
            await books_coll.update_one({"_id": tx.get("book_id")}, {"$set": {"status": target_book_status}})
            
        # Increment completed transactions on both users
        await users_coll.update_one({"_id": tx.get("requester_id")}, {"$inc": {"completed_transactions": 1}})
        await users_coll.update_one({"_id": tx.get("owner_id")}, {"$inc": {"completed_transactions": 1}})
        
    elif new_status == "cancelled":
        await transactions_coll.update_one(
            {"_id": tx_id},
            {"$set": {"status": "cancelled", "completed_at": now}}
        )
        # Restore book to available if not already sold
        await books_coll.update_one({"_id": tx.get("book_id")}, {"$set": {"status": "available"}})

    updated_tx = await transactions_coll.find_one({"_id": tx_id})
    res_data = updated_tx.copy()
    res_data["id"] = str(res_data["_id"])
    return TransactionResponse(**res_data)
