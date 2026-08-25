from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class ReviewCreate(BaseModel):
    target_user_id: str
    transaction_id: str
    rating: int = Field(..., ge=1, le=5, description="1 to 5 stars")
    comment: str = Field(..., min_length=4, max_length=1000)

class ReviewResponse(BaseModel):
    id: str
    reviewer_id: str
    reviewer_name: Optional[str] = None
    reviewer_avatar: Optional[str] = None
    reviewer_college: Optional[str] = None
    target_user_id: str
    transaction_id: str
    rating: int
    comment: str
    created_at: Optional[str] = None
