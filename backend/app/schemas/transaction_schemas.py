from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class TransactionResponse(BaseModel):
    id: str
    request_id: str
    book_id: str
    book_title: Optional[str] = None
    book_image: Optional[str] = None
    requester_id: str
    requester_name: Optional[str] = None
    owner_id: str
    owner_name: Optional[str] = None
    transaction_type: str # buy, donate, exchange
    amount: float = 0.0
    status: str = "in_progress" # in_progress, completed, cancelled
    is_reviewed_by_requester: bool = False
    is_reviewed_by_owner: bool = False
    created_at: Optional[str] = None
    completed_at: Optional[str] = None

class TransactionUpdate(BaseModel):
    status: str = Field(..., description="completed, cancelled")
