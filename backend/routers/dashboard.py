from fastapi import APIRouter, Depends
from bson import ObjectId
from datetime import datetime, timedelta
import random

from routers.auth import get_current_user_id
from database.mongodb import tasks_collection, activity_collection

router = APIRouter()


# -------------------------------------------------------
# DASHBOARD SUMMARY
# Matches the React Dashboard.tsx summary cards
# -------------------------------------------------------
@router.get("/summary")
async def dashboard_summary(user_id: str = Depends(get_current_user_id)):

    # ---------------------------
    # 1. Tasks Completed
    # ---------------------------
    tasks_cursor = tasks_collection.find({"user_id": user_id})
    tasks = []
    async for t in tasks_cursor:
        t["id"] = str(t["_id"])
        tasks.append(t)

    completed_tasks = sum(1 for t in tasks if t.get("status") == "COMPLETED")

    # ---------------------------
    # 2. Focus Score (Random for now → ML later)
    # ---------------------------
    focus_score = random.randint(65, 95)

    # ---------------------------
    # 3. Distraction Time (Mock)
    #    Later pull from activity logs
    # ---------------------------
    distraction_minutes = random.randint(20, 60)

    # ---------------------------
    # 4. AI Alerts (Exactly like UI expects)
    # ---------------------------
    ai_alerts = [
        {
            "id": 1,
            "type": "warning",
            "title": "Distraction Spike",
            "message": "High social media usage detected between 2 PM - 3 PM."
        },
        {
            "id": 2,
            "type": "success",
            "title": "Peak Performance",
            "message": "You entered a flow state at 10:15 AM."
        }
    ]

    # ---------------------------
    # 5. Up Next Tasks (Top 3 upcoming)
    # ---------------------------
    up_next = tasks[:3]

    return {
        "focusScore": f"{focus_score}/100",
        "tasksCompleted": completed_tasks,
        "distractionTime": f"{distraction_minutes}m",
        "aiAlerts": ai_alerts,
        "upNextTasks": up_next
    }


# -------------------------------------------------------
# HOURLY TREND CHART
# From Dashboard.tsx AreaChart (focus vs distraction)
# -------------------------------------------------------
@router.get("/hourly")
async def hourly_trend(user_id: str = Depends(get_current_user_id)):

    # Time range: 8 AM → 6 PM
    hours = list(range(8, 19))

    data = []
    for h in hours:
        data.append({
            "time": f"{h}:00",
            "focusScore": random.randint(20, 90),
            "distractionLevel": random.randint(0, 50)
        })

    return data
