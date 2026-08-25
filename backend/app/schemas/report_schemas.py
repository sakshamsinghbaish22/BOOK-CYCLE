from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class ReportCreate(BaseModel):
    report_type: str = Field(..., description="book or user")
    target_id: str
    target_title: Optional[str] = None
    reason: str = Field(..., description="fake_listing, incorrect_info, spam, inappropriate, fraud, other")
    description: str = Field(..., min_length=5, max_length=1000)

class ReportResponse(BaseModel):
    id: str
    reporter_id: str
    reporter_name: Optional[str] = None
    report_type: str
    target_id: str
    target_title: Optional[str] = None
    reason: str
    description: str
    status: str = "pending" # pending, reviewed, dismissed, resolved
    action_taken: Optional[str] = None
    created_at: Optional[str] = None
    resolved_at: Optional[str] = None

class ReportResolve(BaseModel):
    status: str = Field(..., description="dismissed, resolved")
    action_taken: Optional[str] = None
