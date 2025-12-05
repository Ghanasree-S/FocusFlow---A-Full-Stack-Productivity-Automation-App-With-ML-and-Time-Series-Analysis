from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class FocusStart(BaseModel):
    blocked_notifications: bool = False
    start_time: Optional[datetime] = None


class FocusEnd(BaseModel):
    session_id: str   # MongoDB ObjectId as string


class FocusSessionModel(BaseModel):
    id: str
    user_id: str
    start_time: datetime
    end_time: Optional[datetime] = None
    duration_seconds: Optional[int] = None
    blocked_notifications: bool = False

    class Config:
        orm_mode = True
