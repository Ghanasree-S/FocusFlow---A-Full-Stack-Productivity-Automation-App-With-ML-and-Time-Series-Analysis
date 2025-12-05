import pandas as pd
import numpy as np
from datetime import datetime


# ---------------------------------------------------------
# CLEAN ACTIVITY LOGS
# Converts raw MongoDB logs → DataFrame with proper types
# ---------------------------------------------------------
def clean_activity_logs(raw_logs: list):
    """
    raw_logs: list of documents from MongoDB activity_collection
    returns: cleaned pandas DataFrame
    """

    if not raw_logs or len(raw_logs) == 0:
        return pd.DataFrame(columns=["timestamp", "event_type", "source", "value"])

    df = pd.DataFrame(raw_logs)

    # Convert timestamp
    if "timestamp" in df.columns:
        df["timestamp"] = pd.to_datetime(df["timestamp"], errors="coerce")

    # Fill missing fields
    for col in ["source", "value", "event_type"]:
        if col not in df.columns:
            df[col] = None

    df["value"] = df["value"].astype(float).fillna(0.0)

    # Sort chronologically
    df = df.sort_values("timestamp")

    return df



# ---------------------------------------------------------
# DAILY AGGREGATION FOR CLASSIFICATION MODEL
# Extract useful productivity metrics per day
# ---------------------------------------------------------
def extract_daily_features(df: pd.DataFrame):
    """
    Takes cleaned activity log DF and produces features like:
      - total productive minutes
      - total distracted minutes
      - screen unlock count
      - average focus score
      - distraction spikes
    """

    if df.empty:
        return {
            "productive_minutes": 0,
            "distracted_minutes": 0,
            "unlock_events": 0,
            "avg_focus_score": 0,
            "distraction_spikes": 0
        }

    # Event categories
    productive_mask = df["event_type"].isin(["focus", "typing", "work"])
    distracted_mask = df["event_type"].isin(["distraction", "social_media", "idle"])
    unlock_mask = df["event_type"] == "unlock"

    productive_minutes = productive_mask.sum()
    distracted_minutes = distracted_mask.sum()

    unlock_events = unlock_mask.sum()

    # Average focus level
    avg_focus = df.loc[productive_mask, "value"].mean() if productive_mask.any() else 0

    # Distraction spikes
    distraction_spikes = (df["value"] > 60).sum()

    return {
        "productive_minutes": int(productive_minutes),
        "distracted_minutes": int(distracted_minutes),
        "unlock_events": int(unlock_events),
        "avg_focus_score": float(avg_focus) if not np.isnan(avg_focus) else 0,
        "distraction_spikes": int(distraction_spikes)
    }



# ---------------------------------------------------------
# FORMAT DATA FOR TIME-SERIES FORECASTING MODEL
# Returns Prophet/LSTM-ready dataset
# ---------------------------------------------------------
def build_forecasting_dataset(df: pd.DataFrame):
    """
    Converts logs into a forecasting-ready format:
      - Group by day
      - Sum productivity values
      - Format columns as ds (date), y (value)
    """

    if df.empty:
        return pd.DataFrame(columns=["ds", "y"])

    df["date"] = df["timestamp"].dt.date

    grouped = df.groupby("date")["value"].sum().reset_index()

    grouped.rename(columns={"date": "ds", "value": "y"}, inplace=True)

    # Convert to datetime for Prophet / LSTM
    grouped["ds"] = pd.to_datetime(grouped["ds"])

    return grouped



# ---------------------------------------------------------
# NORMALIZATION (for ML models)
# ---------------------------------------------------------
def normalize_features(feature_dict: dict):
    """
    Converts raw features into normalized (0-1) scale.
    """

    normalized = {}

    for key, val in feature_dict.items():
        if isinstance(val, (int, float)):
            # simple min-max normalization assuming max reasonable values
            max_val = {
                "productive_minutes": 480,   # 8 hours
                "distracted_minutes": 300,
                "unlock_events": 200,
                "avg_focus_score": 100,
                "distraction_spikes": 50,
            }.get(key, 100)

            normalized[key] = round(float(val) / max_val, 4)
        else:
            normalized[key] = val

    return normalized



# ---------------------------------------------------------
# FULL PIPELINE
# Converts raw Mongo logs → ML-ready feature vector
# ---------------------------------------------------------
def create_feature_vector(raw_logs: list):
    """
    Main entry function used by ML model during prediction.
    """

    # Step 1: Clean logs → DataFrame
    df = clean_activity_logs(raw_logs)

    # Step 2: Extract daily statistical features
    daily = extract_daily_features(df)

    # Step 3: Normalize for classifier
    vector = normalize_features(daily)

    return vector
