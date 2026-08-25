import os
import uuid
import aiofiles
from fastapi import UploadFile, HTTPException, status
from app.config import settings

ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".gif"}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB

async def save_uploaded_image(file: UploadFile, subfolder: str = "books") -> str:
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported file type '{ext}'. Allowed formats: JPG, PNG, WebP, GIF",
        )
    
    target_dir = os.path.join(settings.UPLOAD_DIR, subfolder)
    os.makedirs(target_dir, exist_ok=True)
    
    filename = f"{uuid.uuid4().hex}{ext}"
    file_path = os.path.join(target_dir, filename)
    
    content = await file.read()
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File too large. Maximum allowed size is 10MB.",
        )
    
    async with aiofiles.open(file_path, "wb") as out_file:
        await out_file.write(content)
        
    return f"/uploads/{subfolder}/{filename}"
