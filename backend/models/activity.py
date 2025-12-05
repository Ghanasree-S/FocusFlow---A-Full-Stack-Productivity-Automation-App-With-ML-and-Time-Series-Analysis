from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class ActivityBase(BaseModel):
    """
    Stores time-series activity logs used for ML forecasting.
    event_type examples:
        - "app_usage"
        - "idle"
        - "focus"
        - "distraction"
        - "unlock"
        - "screen_time"
    value:
        - numeric value like focus score, distraction level, or minutes
    source:
        - app name like "Chrome", "YouTube", etc.
    """
    event_type: str
    timestamp: datetime
    source: Optional[str] = None
    value: Optional[float] = None


class ActivityCreate(ActivityBase):
    """Payload for inserting new logs."""
    pass


class ActivityResponse(ActivityBase):
    """Returned activity log."""
    id: str

    class Config:
        orm_mode = True
