from fastapi import APIRouter, Depends
from routers.auth import get_current_user_id
from datetime import datetime, timedelta
import random

router = APIRouter()


# ---------------------------------------------------
# PREDICT TOMORROW'S WORKLOAD & COMPLETION PROBABILITY
# ---------------------------------------------------
@router.get("/tomorrow")
async def predict_tomorrow(user_id: str = Depends(get_current_user_id)):
    """
    Predicts tomorrow's workload level and task completion probability.
    Later you will plug in your ML classifier here.
    """

    workload_label = random.choice(["Low", "Medium", "High"])
    completion_prob = round(random.uniform(0.55, 0.95), 2)

    return {
        "workload": workload_label,
        "completionProbability": completion_prob
    }


# ---------------------------------------------------
# RECOMMENDED FOCUS HOURS
# (based on past performance + ML in future)
# ---------------------------------------------------
@router.get("/recommendation")
async def recommend_focus(user_id: str = Depends(get_current_user_id)):
    """
    Suggests ideal focus hours for the user.
    Later replace with ML-based recommendation.
    """
    # Simple placeholder
    recommended_start = "09:00"
    recommended_end = "11:30"

    return {
        "start": recommended_start,
        "end": recommended_end
    }


# ---------------------------------------------------
# 7-DAY PRODUCTIVITY FORECAST
# ---------------------------------------------------
@router.get("/forecast")
async def forecast_7_days(user_id: str = Depends(get_current_user_id)):
    """
    Returns predicted productivity completion probability for the next 7 days.
    Matches your Analytics/Insights UI.
    """

    today = datetime.utcnow()
    result = []

    for i in range(7):
        day = (today + timedelta(days=i)).strftime("%a")
        result.append({
            "day": day,
            "completionProb": random.randint(60, 95)
        })

    return result
