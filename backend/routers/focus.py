from fastapi import APIRouter, Depends, HTTPException
from datetime import datetime
from bson import ObjectId

from database.mongo import focus_collection
from routers.auth import get_current_user_id
from models.focus import FocusStart, FocusEnd

router = APIRouter()

# --------------------------------------------
# START FOCUS SESSION
# --------------------------------------------
@router.post("/start")
async def start_focus(payload: FocusStart, user_id: str = Depends(get_current_user_id)):

    session_data = {
        "user_id": user_id,
        "start_time": payload.start_time or datetime.utcnow(),
        "end_time": None,
        "duration_seconds": None,
        "blocked_notifications": payload.blocked_notifications,
    }

    result = await focus_collection.insert_one(session_data)
    session_data["id"] = str(result.inserted_id)

    return session_data


# --------------------------------------------
# END FOCUS SESSION
# --------------------------------------------
@router.post("/end")
async def end_focus(payload: FocusEnd, user_id: str = Depends(get_current_user_id)):

    session_id = payload.session_id

    session = await focus_collection.find_one({"_id": ObjectId(session_id), "user_id": user_id})
    if not session:
        raise HTTPException(status_code=404, detail="Focus session not found")

    end_time = datetime.utcnow()
    duration_seconds = int((end_time - session["start_time"]).total_seconds())

    await focus_collection.update_one(
        {"_id": ObjectId(session_id)},
        {"$set": {
            "end_time": end_time,
            "duration_seconds": duration_seconds
        }}
    )

    session["end_time"] = end_time
    session["duration_seconds"] = duration_seconds
    session["id"] = session_id

    return session
