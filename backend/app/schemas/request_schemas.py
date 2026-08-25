from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
from datetime import datetime

class RequestCreate(BaseModel):
    book_id: str
    request_type: str = Field(..., description="buy, donate, exchange")
    offered_exchange_item: Optional[str] = None
    message: Optional[str] = None
    contact_phone: Optional[str] = None

class RequestStatusUpdate(BaseModel):
    status: str = Field(..., description="accepted, rejected, cancelled, completed")
    notes: Optional[str] = None

class RequestResponse(BaseModel):
    id: str
    book_id: str
    book_title: Optional[str] = None
    book_image: Optional[str] = None
    book_price: Optional[float] = 0.0
    book_listing_type: Optional[str] = None
    requester_id: str
    requester_name: Optional[str] = None
    requester_college: Optional[str] = None
    requester_avatar: Optional[str] = None
    owner_id: str
    owner_name: Optional[str] = None
    owner_college: Optional[str] = None
    request_type: str
    offered_exchange_item: Optional[str] = None
    message: Optional[str] = None
    contact_phone: Optional[str] = None
    status: str = "pending" # pending, accepted, rejected, cancelled, completed
    created_at: Optional[str] = None
    updated_at: Optional[str] = None
