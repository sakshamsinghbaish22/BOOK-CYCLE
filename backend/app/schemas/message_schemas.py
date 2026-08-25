from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class MessageCreate(BaseModel):
    receiver_id: str
    book_id: Optional[str] = None
    content: str = Field(..., min_length=1)

class MessageResponse(BaseModel):
    id: str
    sender_id: str
    sender_name: Optional[str] = None
    sender_avatar: Optional[str] = None
    receiver_id: str
    receiver_name: Optional[str] = None
    receiver_avatar: Optional[str] = None
    book_id: Optional[str] = None
    book_title: Optional[str] = None
    book_image: Optional[str] = None
    content: str
    is_read: bool = False
    created_at: Optional[str] = None

class ConversationThread(BaseModel):
    other_user_id: str
    other_user_name: str
    other_user_avatar: Optional[str] = None
    other_user_college: Optional[str] = None
    last_message: str
    last_message_time: str
    unread_count: int = 0
    book_id: Optional[str] = None
    book_title: Optional[str] = None
