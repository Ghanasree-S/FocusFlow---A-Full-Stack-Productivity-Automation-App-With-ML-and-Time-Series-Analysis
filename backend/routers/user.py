from fastapi import APIRouter, Depends, HTTPException
from bson import ObjectId
from pydantic import BaseModel
from typing import Optional

from routers.auth import get_current_user_id
from database.mongodb import users_collection

router = APIRouter()


# ============================================================
# Pydantic Models
# ============================================================

class ProfileUpdate(BaseModel):
    name: Optional[str] = None
    avatar: Optional[str] = None
    style: Optional[str] = None
    daily_goal_hours: Optional[int] = None


class SettingsUpdate(BaseModel):
    notifications_daily_summary: Optional[bool] = None
    notifications_distraction_alerts: Optional[bool] = None
    notifications_weekly_report: Optional[bool] = None
    cloud_sync_enabled: Optional[bool] = None


# ============================================================
# GET USER PROFILE
# Matches Profile.tsx UI fields
# ============================================================

@router.get("/profile")
async def get_profile(user_id: str = Depends(get_current_user_id)):

    user = await users_collection.find_one({"_id": ObjectId(user_id)})

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return {
        "id": user_id,
        "name": user.get("name"),
        "email": user.get("email"),
        "avatar": user.get("avatar", "https://picsum.photos/200"),
        "style": user.get("style", "Balanced"),
        "dailyGoalHours": user.get("daily_goal_hours", 8)
    }


# ============================================================
# UPDATE USER PROFILE
# Matches "Edit Profile" button in UI
# ============================================================

@router.put("/profile")
async def update_profile(
    payload: ProfileUpdate,
    user_id: str = Depends(get_current_user_id)
):

    update_data = {k: v for k, v in payload.dict().items() if v is not None}

    result = await users_collection.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": update_data}
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="User not found")

    return {"status": "success", "updated": update_data}


# ============================================================
# GET USER SETTINGS
# Matches Settings.tsx structure
# ============================================================

@router.get("/settings")
async def get_settings(user_id: str = Depends(get_current_user_id)):

    user = await users_collection.find_one({"_id": ObjectId(user_id)})

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return {
        "notifications_daily_summary": user.get("notifications_daily_summary", True),
        "notifications_distraction_alerts": user.get("notifications_distraction_alerts", True),
        "notifications_weekly_report": user.get("notifications_weekly_report", True),
        "cloud_sync_enabled": user.get("cloud_sync_enabled", True)
    }


# ============================================================
# UPDATE USER SETTINGS
# ============================================================

@router.put("/settings")
async def update_settings(
    payload: SettingsUpdate,
    user_id: str = Depends(get_current_user_id)
):

    update_data = {k: v for k, v in payload.dict().items() if v is not None}

    await users_collection.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": update_data}
    )

    return {"status": "success", "updated": update_data}


# ============================================================
# DELETE USER ACCOUNT
# Matches the "Danger Zone → Delete Account" button
# ============================================================

@router.delete("/delete")
async def delete_account(user_id: str = Depends(get_current_user_id)):

    result = await users_collection.delete_one({"_id": ObjectId(user_id)})

    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="User not found")

    return {"status": "account_deleted"}
