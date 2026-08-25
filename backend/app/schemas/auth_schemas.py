from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime

class UserRegister(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=6)
    college: str = Field(..., min_length=2, max_length=150)
    phone: Optional[str] = None
    profile_image: Optional[str] = None

class UserLogin(BaseModel):
    email: str = Field(..., description="Email address or username")
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict

class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    college: str
    phone: Optional[str] = None
    profile_image: Optional[str] = None
    role: str = "student"
    is_active: bool = True
    rating: float = 5.0
    review_count: int = 0
    completed_transactions: int = 0
    listings_count: int = 0
    created_at: Optional[str] = None
    updated_at: Optional[str] = None

class UserUpdate(BaseModel):
    name: Optional[str] = None
    college: Optional[str] = None
    phone: Optional[str] = None
    profile_image: Optional[str] = None
    bio: Optional[str] = None
