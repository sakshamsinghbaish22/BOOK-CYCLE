from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from app.schemas.auth_schemas import UserResponse
from app.schemas.book_schemas import BookResponse
from app.schemas.report_schemas import ReportResponse

class AdminStatsResponse(BaseModel):
    total_users: int
    total_listings: int
    active_listings: int
    sold_listings: int
    total_transactions: int
    completed_transactions: int
    total_reports: int
    pending_reports: int
    total_messages: int
    recent_users: List[UserResponse] = []
    recent_listings: List[BookResponse] = []
    recent_reports: List[ReportResponse] = []

class UserManagementUpdate(BaseModel):
    is_active: Optional[bool] = None
    role: Optional[str] = None
