
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report
from sklearn.preprocessing import StandardScaler
import joblib
import os

from ml_engine.preprocessing import clean_activity_logs, extract_daily_features, normalize_features


# ================================================================
# 1) Synthetic dataset generator (before real user data exists)
# ================================================================
def generate_synthetic_dataset(n=500):
    """
    Creates a mock dataset for training the classifier.
    Matches the feature definitions in preprocessing.py.
    """

    data = {
        "productive_minutes": np.random.randint(20, 480, n),
        "distracted_minutes": np.random.randint(10, 300, n),
        "unlock_events": np.random.randint(5, 200, n),
        "avg_focus_score": np.random.randint(20, 100, n),
        "distraction_spikes": np.random.randint(0, 40, n),
    }

    df = pd.DataFrame(data)

    # Target label based on simple productivity logic
    labels = []
    for i in range(n):
        if df.loc[i, "productive_minutes"] > 300 and df.loc[i, "distracted_minutes"] < 60:
            labels.append("High")
        elif df.loc[i, "productive_minutes"] > 150:
            labels.append("Medium")
        else:
            labels.append("Low")

    df["label"] = labels
    return df


# ================================================================
# 2) Train RandomForest classifier on dataset
# ================================================================
def train_classifier():
    print("📌 Generating synthetic productivity dataset...")
    df = generate_synthetic_dataset()

    X = df.drop(columns=["label"])
    y = df["label"]

    print("📌 Normalizing features...")
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    print("📌 Training RandomForest model...")
    clf = RandomForestClassifier(
        n_estimators=300,
        max_depth=12,
        random_state=42,
        class_weight="balanced"
    )

    clf.fit(X_scaled, y)

    # Evaluate
    y_pred = clf.predict(X_scaled)
    print("\n📊 Classification Report:")
    print(classification_report(y, y_pred))

    # Save model
    model_path = os.path.join(os.path.dirname(__file__), "classifier.pkl")
    scaler_path = os.path.join(os.path.dirname(__file__), "scaler.pkl")

    joblib.dump(clf, model_path)
    joblib.dump(scaler, scaler_path)

    print(f"\n✅ Model saved to {model_path}")
    print(f"✅ Scaler saved to {scaler_path}")


# ================================================================
# 3) Main
# ================================================================
if __name__ == "__main__":
    train_classifier()
