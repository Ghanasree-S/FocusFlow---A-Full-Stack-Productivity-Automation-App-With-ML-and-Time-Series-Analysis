from fastapi import APIRouter, Depends
from datetime import datetime, timedelta
from bson import ObjectId

from routers.auth import get_current_user_id
from database.mongo import activity_collection, tasks_collection
import random

router = APIRouter()


# ------------------------------------------------------
# WEEKLY PRODUCTIVITY GRAPH
# Used in Analytics.tsx for line chart + efficiency plot
# ------------------------------------------------------
@router.get("/weekly")
async def weekly_productivity(user_id: str = Depends(get_current_user_id)):
    days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

    # Placeholder for real ML/time-series aggregation.
    # Later: Replace with aggregated ActivityLog.
    data = [
        {
            "day": d,
            "focusHours": round(random.uniform(1, 6), 1),
            "efficiency": random.randint(60, 95),
        }
        for d in days
    ]

    return data


# ------------------------------------------------------
# SUMMARY ANALYTICS
# Used for:
# - Most productive time
# - Consistency score
# - Top distraction
# ------------------------------------------------------
@router.get("/summary")
async def analytics_summary(user_id: str = Depends(get_current_user_id)):
    # TODO: Later compute real data from activity logs
    # For now, matching frontend expectations exactly.

    summary = {
        "mostProductiveTime": "10:00 AM",
        "consistencyScore": random.randint(70, 95),
        "topDistraction": random.choice(["Instagram", "YouTube", "WhatsApp", "Email"]),
        "distractionMinutes": random.randint(20, 120),
    }

    return summary


# ------------------------------------------------------
# PRODUCTIVITY BREAKDOWN (Optional future expansion)
# Could feed pie charts or category charts in frontend.
# ------------------------------------------------------
@router.get("/breakdown")
async def productivity_breakdown(user_id: str = Depends(get_current_user_id)):
    # Example breakdown
    breakdown = {
        "productive": random.randint(120, 300),    # minutes
        "neutral": random.randint(60, 200),
        "distracted": random.randint(30, 180),
    }
    return breakdown


# ------------------------------------------------------
# DAILY TREND (Optional for extra graphs)
# ------------------------------------------------------
@router.get("/daily-trend")
async def daily_trend(user_id: str = Depends(get_current_user_id)):
    hours = [f"{h}:00" for h in range(8, 20)]
    data = []
    for h in hours:
        data.append({
            "time": h,
            "focusScore": random.randint(20, 90),
            "distractionLevel": random.randint(0, 50)
        })
    return data
