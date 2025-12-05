import pandas as pd
from prophet import Prophet
import joblib
import os

from ml_engine.preprocessing import build_forecasting_dataset


# ======================================================================
# LOAD RAW DATA (For now synthetic — replace with real Mongo logs later)
# ======================================================================
def generate_synthetic_timeseries(n_days=60):
    """
    Generates synthetic time-series values representing daily productivity score.
    Used until real activity logs are collected.
    """
    dates = pd.date_range(end=pd.Timestamp.today(), periods=n_days)
    values = []

    for i in range(n_days):
        # Simulate weekly seasonality
        base = 50 + 10 * (i % 7 == 2) + 15 * (i % 7 == 3)

        # Random variations
        noise = pd.np.random.randint(-10, 10)
        values.append(base + noise)

    df = pd.DataFrame({
        "ds": dates,
        "y": values
    })

    return df


# ======================================================================
# TRAIN PROPHET FORECASTING MODEL
# ======================================================================
def train_forecast_model():

    print("📌 Generating synthetic time-series data...")
    df = generate_synthetic_timeseries()

    print("📌 Data preview:")
    print(df.head())

    print("\n📌 Initializing Prophet model...")
    model = Prophet(
        yearly_seasonality=False,
        weekly_seasonality=True,
        daily_seasonality=False,
        interval_width=0.80
    )

    print("📌 Fitting model...")
    model.fit(df)

    # Save model
    model_path = os.path.join(os.path.dirname(__file__), "forecast.pkl")
    joblib.dump(model, model_path)

    print(f"\n✅ Forecasting model saved to: {model_path}")


# ======================================================================
# MAIN EXECUTION
# ======================================================================
if __name__ == "__main__":
    train_forecast_model()
