from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class BookCreate(BaseModel):
    title: str = Field(..., min_length=2, max_length=255)
    author: str = Field(..., min_length=2, max_length=255)
    isbn: Optional[str] = None
    category: str = Field(..., min_length=2, max_length=100) # e.g. Computer Science, Engineering, Mathematics, Management, Medical, Exam Prep, Literature
    subject: Optional[str] = None
    edition: Optional[str] = None
    description: str = Field(..., min_length=10)
    condition: str = Field(..., description="New, Like New, Good, Fair, Poor")
    listing_type: str = Field(..., description="Sell, Donate, Exchange")
    price: float = Field(0.0, ge=0)
    exchange_preferences: Optional[str] = None
    images: List[str] = []
    college: Optional[str] = None
    location_details: Optional[str] = None

class BookUpdate(BaseModel):
    title: Optional[str] = None
    author: Optional[str] = None
    isbn: Optional[str] = None
    category: Optional[str] = None
    subject: Optional[str] = None
    edition: Optional[str] = None
    description: Optional[str] = None
    condition: Optional[str] = None
    listing_type: Optional[str] = None
    price: Optional[float] = None
    exchange_preferences: Optional[str] = None
    images: Optional[List[str]] = None
    college: Optional[str] = None
    location_details: Optional[str] = None
    status: Optional[str] = None # available, reserved, sold, donated, exchanged

class BookResponse(BaseModel):
    id: str
    title: str
    author: str
    isbn: Optional[str] = None
    category: str
    subject: Optional[str] = None
    edition: Optional[str] = None
    description: str
    condition: str
    listing_type: str
    price: float = 0.0
    exchange_preferences: Optional[str] = None
    images: List[str] = []
    owner_id: str
    owner_name: Optional[str] = None
    owner_email: Optional[str] = None
    owner_college: Optional[str] = None
    owner_rating: Optional[float] = 5.0
    owner_avatar: Optional[str] = None
    college: Optional[str] = None
    location_details: Optional[str] = None
    status: str = "available" # available, reserved, sold, donated, exchanged
    views_count: int = 0
    wishlist_count: int = 0
    created_at: Optional[str] = None
    updated_at: Optional[str] = None

class BookListResponse(BaseModel):
    items: List[BookResponse]
    total: int
    page: int
    limit: int
    pages: int
