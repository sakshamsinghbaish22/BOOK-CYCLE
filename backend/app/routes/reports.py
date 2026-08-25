import uuid
from datetime import datetime
from typing import List
from fastapi import APIRouter, HTTPException, status, Depends
from app.schemas.report_schemas import ReportCreate, ReportResponse, ReportResolve
from app.database import get_db
from app.middleware.auth import get_current_user, get_current_admin

router = APIRouter(prefix="/reports", tags=["Reports"])

@router.post("", response_model=ReportResponse, status_code=status.HTTP_201_CREATED)
async def submit_report(
    rep_in: ReportCreate,
    current_user: dict = Depends(get_current_user)
):
    db = get_db()
    reports_coll = db.get_collection("reports")
    books_coll = db.get_collection("books")
    users_coll = db.get_collection("users")
    
    target_title = rep_in.target_title
    if not target_title:
        if rep_in.report_type == "book":
            book = await books_coll.find_one({"_id": rep_in.target_id})
            if book:
                target_title = book.get("title")
        elif rep_in.report_type == "user":
            user = await users_coll.find_one({"_id": rep_in.target_id})
            if user:
                target_title = user.get("name")
                
    rep_id = f"rep_{uuid.uuid4().hex[:12]}"
    now = datetime.utcnow().isoformat()
    
    new_report = {
        "_id": rep_id,
        "reporter_id": str(current_user["_id"]),
        "reporter_name": current_user.get("name", "Student"),
        "report_type": rep_in.report_type,
        "target_id": rep_in.target_id,
        "target_title": target_title or "Unspecified",
        "reason": rep_in.reason,
        "description": rep_in.description.strip(),
        "status": "pending",
        "action_taken": None,
        "created_at": now,
        "resolved_at": None
    }
    
    await reports_coll.insert_one(new_report)
    
    res_data = new_report.copy()
    res_data["id"] = rep_id
    return ReportResponse(**res_data)

@router.get("", response_model=List[ReportResponse])
async def list_reports(current_admin: dict = Depends(get_current_admin)):
    db = get_db()
    reports_coll = db.get_collection("reports")
    cursor = reports_coll.find().sort("created_at", -1)
    raw_reps = await cursor.to_list(100)
    items = []
    for r in raw_reps:
        r_data = r.copy()
        r_data["id"] = str(r_data["_id"])
        items.append(ReportResponse(**r_data))
    return items

@router.put("/{rep_id}/resolve", response_model=ReportResponse)
async def resolve_report(
    rep_id: str,
    resolve_in: ReportResolve,
    current_admin: dict = Depends(get_current_admin)
):
    db = get_db()
    reports_coll = db.get_collection("reports")
    now = datetime.utcnow().isoformat()
    
    await reports_coll.update_one(
        {"_id": rep_id},
        {"$set": {
            "status": resolve_in.status,
            "action_taken": resolve_in.action_taken or "Resolved by moderator",
            "resolved_at": now
        }}
    )
    
    updated = await reports_coll.find_one({"_id": rep_id})
    if not updated:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Report not found")
    res_data = updated.copy()
    res_data["id"] = str(res_data["_id"])
    return ReportResponse(**res_data)
