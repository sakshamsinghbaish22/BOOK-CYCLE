import uuid
from datetime import datetime
from typing import List, Optional, Dict
from fastapi import APIRouter, HTTPException, status, Depends
from app.schemas.message_schemas import MessageCreate, MessageResponse, ConversationThread
from app.database import get_db
from app.middleware.auth import get_current_user

router = APIRouter(prefix="/messages", tags=["Messages"])

@router.post("", response_model=MessageResponse, status_code=status.HTTP_201_CREATED)
async def send_message(
    msg_in: MessageCreate,
    current_user: dict = Depends(get_current_user)
):
    db = get_db()
    users_coll = db.get_collection("users")
    books_coll = db.get_collection("books")
    messages_coll = db.get_collection("messages")
    
    sender_id = str(current_user["_id"])
    if msg_in.receiver_id == sender_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You cannot send messages to yourself",
        )
        
    receiver = await users_coll.find_one({"_id": msg_in.receiver_id})
    if not receiver:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Recipient user not found")
        
    book_title = None
    book_image = None
    if msg_in.book_id:
        book = await books_coll.find_one({"_id": msg_in.book_id})
        if book:
            book_title = book.get("title")
            images = book.get("images", [])
            book_image = images[0] if images else None

    msg_id = f"msg_{uuid.uuid4().hex[:12]}"
    now = datetime.utcnow().isoformat()
    
    new_msg = {
        "_id": msg_id,
        "sender_id": sender_id,
        "sender_name": current_user.get("name", "Student"),
        "sender_avatar": current_user.get("profile_image", ""),
        "receiver_id": msg_in.receiver_id,
        "receiver_name": receiver.get("name", "Student"),
        "receiver_avatar": receiver.get("profile_image", ""),
        "book_id": msg_in.book_id,
        "book_title": book_title,
        "book_image": book_image,
        "content": msg_in.content.strip(),
        "is_read": False,
        "created_at": now
    }
    
    await messages_coll.insert_one(new_msg)
    
    res_data = new_msg.copy()
    res_data["id"] = msg_id
    return MessageResponse(**res_data)

@router.get("/threads", response_model=List[ConversationThread])
async def get_conversation_threads(current_user: dict = Depends(get_current_user)):
    db = get_db()
    messages_coll = db.get_collection("messages")
    users_coll = db.get_collection("users")
    user_id = str(current_user["_id"])
    
    cursor = messages_coll.find({
        "$or": [
            {"sender_id": user_id},
            {"receiver_id": user_id}
        ]
    }).sort("created_at", -1)
    
    all_msgs = await cursor.to_list(500)
    
    threads: Dict[str, dict] = {}
    for m in all_msgs:
        other_id = m["receiver_id"] if m["sender_id"] == user_id else m["sender_id"]
        if other_id not in threads:
            other_user = await users_coll.find_one({"_id": other_id})
            threads[other_id] = {
                "other_user_id": other_id,
                "other_user_name": other_user.get("name", "Student") if other_user else "Student",
                "other_user_avatar": other_user.get("profile_image", "") if other_user else "",
                "other_user_college": other_user.get("college", "") if other_user else "",
                "last_message": m.get("content", ""),
                "last_message_time": m.get("created_at", ""),
                "unread_count": 0,
                "book_id": m.get("book_id"),
                "book_title": m.get("book_title")
            }
            
        if m["receiver_id"] == user_id and not m.get("is_read", False):
            threads[other_id]["unread_count"] += 1
            
    return list(threads.values())

@router.get("/user/{other_user_id}", response_model=List[MessageResponse])
async def get_messages_with_user(
    other_user_id: str,
    current_user: dict = Depends(get_current_user)
):
    db = get_db()
    messages_coll = db.get_collection("messages")
    user_id = str(current_user["_id"])
    
    # Mark unread messages sent by other_user to current_user as read
    await messages_coll.update_one(
        {"sender_id": other_user_id, "receiver_id": user_id, "is_read": False},
        {"$set": {"is_read": True}}
    )
    
    cursor = messages_coll.find({
        "$or": [
            {"sender_id": user_id, "receiver_id": other_user_id},
            {"sender_id": other_user_id, "receiver_id": user_id}
        ]
    }).sort("created_at", 1)
    
    raw_msgs = await cursor.to_list(200)
    items = []
    for m in raw_msgs:
        m_data = m.copy()
        m_data["id"] = str(m_data["_id"])
        items.append(MessageResponse(**m_data))
    return items
