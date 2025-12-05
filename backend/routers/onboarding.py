from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from routers.auth import get_current_user_id
from database.mongo import users_collection
from bson import ObjectId

router = APIRouter()


# ---------------------------------------------
# Pydantic Model for Onboarding
# ---------------------------------------------
class OnboardingPayload(BaseModel):
    style: str
    work_start: str
    work_end: str


# ---------------------------------------------
# SAVE / UPDATE ONBOARDING DETAILS
# ---------------------------------------------
@router.post("/")
async def save_onboarding(payload: OnboardingPayload, user_id: str = Depends(get_current_user_id)):

    # Find user
    user = await users_collection.find_one({"_id": ObjectId(user_id)})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Update onboarding fields
    update_data = {
        "style": payload.style,
        "work_start": payload.work_start,
        "work_end": payload.work_end,
        "onboarding_complete": True
    }

    await users_collection.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": update_data}
    )

    # Return success response
    user_after = await users_collection.find_one({"_id": ObjectId(user_id)})
    user_after["id"] = str(user_after["_id"])

    return {
        "message": "Onboarding completed successfully",
        "user": {
            "id": user_after["id"],
            "style": user_after.get("style"),
            "work_start": user_after.get("work_start"),
            "work_end": user_after.get("work_end"),
            "onboarding_complete": user_after.get("onboarding_complete", False)
        }
    }
