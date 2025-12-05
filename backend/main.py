from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from backend.database.mongo import init_db

load_dotenv()

app = FastAPI(
    title="FocusFlow Backend",
    description="Backend API for FocusFlow Productivity App with ML + Time-Series Analysis",
    version="1.0.0",
)

# -----------------------------------------------------
# CORS SETTINGS (IMPORTANT for your React Frontend)
# -----------------------------------------------------
origins = [
    "http://localhost:3000",      # Local React
    "http://127.0.0.1:3000",
    "http://localhost:5173",      # Vite users
    "https://your-frontend-url.com",  # Deploy URL placeholder
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------------------------------------
# INITIALIZE DATABASE
# -----------------------------------------------------
init_db()

# -----------------------------------------------------
# ROUTERS
# -----------------------------------------------------
from routers import (
    auth,
    onboarding,
    tasks,
    dashboard,
    analytics,
    ml,
    focus,
    user,
)

app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(onboarding.router, prefix="/onboarding", tags=["Onboarding"])
app.include_router(tasks.router, prefix="/tasks", tags=["Task Manager"])
app.include_router(dashboard.router, prefix="/dashboard", tags=["Dashboard"])
app.include_router(analytics.router, prefix="/analytics", tags=["Analytics"])
app.include_router(ml.router, prefix="/ml", tags=["Machine Learning"])
app.include_router(focus.router, prefix="/focus", tags=["Focus Mode"])
app.include_router(user.router, prefix="/user", tags=["User Profile & Settings"])


# -----------------------------------------------------
# ROOT TESTING ROUTE
# -----------------------------------------------------
@app.get("/")
def root():
    return {
        "message": "FocusFlow Backend is running 🚀",
        "status": "OK",
        "docs": "/docs",
        "redoc": "/redoc"
    }
