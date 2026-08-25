from fastapi import APIRouter, HTTPException, status, Depends
from datetime import datetime
import uuid
from app.schemas.auth_schemas import UserRegister, UserLogin, Token, UserResponse, UserUpdate
from app.utils.security import hash_password, verify_password, create_access_token
from app.database import get_db
from app.middleware.auth import get_current_user

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
async def register_user(user_in: UserRegister):
    db = get_db()
    users_coll = db.get_collection("users")
    
    # Check if email exists
    existing = await users_coll.find_one({"email": user_in.email.lower()})
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email address already exists",
        )
    
    user_id = f"user_{uuid.uuid4().hex[:12]}"
    new_user = {
        "_id": user_id,
        "name": user_in.name.strip(),
        "email": user_in.email.lower().strip(),
        "password_hash": hash_password(user_in.password),
        "college": user_in.college.strip(),
        "phone": user_in.phone or "",
        "profile_image": user_in.profile_image or f"https://api.dicebear.com/7.x/avataaars/svg?seed={user_in.name.replace(' ', '')}",
        "role": "student",
        "is_active": True,
        "rating": 5.0,
        "review_count": 0,
        "completed_transactions": 0,
        "listings_count": 0,
        "bio": f"Student at {user_in.college.strip()}",
        "created_at": datetime.utcnow().isoformat(),
        "updated_at": datetime.utcnow().isoformat()
    }
    
    await users_coll.insert_one(new_user)
    
    token = create_access_token({"sub": user_id, "email": new_user["email"], "role": new_user["role"]})
    user_data = new_user.copy()
    user_data["id"] = user_data["_id"]
    user_data.pop("password_hash", None)
    
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": user_data
    }

@router.post("/login", response_model=Token)
async def login_user(credentials: UserLogin):
    db = get_db()
    users_coll = db.get_collection("users")
    
    login_input = credentials.email.strip()
    login_input_lower = login_input.lower()
    
    # Check by email directly or normalized email or username
    user = await users_coll.find_one({"email": login_input_lower})
    
    # If not found by full email, check with @bookcycle.edu appended or by name/id
    if not user:
        if "@" not in login_input_lower:
            user = await users_coll.find_one({"email": f"{login_input_lower}@bookcycle.edu"})
            
    if not user:
        # Search all users by name or username match
        all_users = await users_coll.find({}).to_list(100)
        for u in all_users:
            u_name = u.get("name", "").lower().replace(" ", "")
            u_email_prefix = u.get("email", "").split("@")[0].lower()
            clean_input = login_input_lower.replace(" ", "")
            if clean_input in [u_name, u_email_prefix, u.get("email", "").lower()]:
                user = u
                break

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User account not found. Please check your username or email.",
        )
    
    pwd_clean = credentials.password.strip()
    if not verify_password(pwd_clean, user.get("password_hash", "")):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect password. For platform admins, password format is yourname@123 (e.g. sakshamsingh@123).",
        )
        
    if not user.get("is_active", True):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Your account has been deactivated. Please contact campus admin.",
        )
        
    token = create_access_token({"sub": str(user["_id"]), "email": user["email"], "role": user.get("role", "student")})
    user_data = user.copy()
    user_data["id"] = str(user_data["_id"])
    user_data.pop("password_hash", None)
    
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": user_data
    }

@router.get("/me", response_model=UserResponse)
async def get_me(current_user: dict = Depends(get_current_user)):
    user_data = current_user.copy()
    user_data["id"] = str(user_data["_id"])
    user_data.pop("password_hash", None)
    return user_data
