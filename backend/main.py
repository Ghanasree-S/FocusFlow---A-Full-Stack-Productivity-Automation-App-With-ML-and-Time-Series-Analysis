from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(
    title="FocusFlow Backend",
    description="Backend API for FocusFlow Productivity App with ML + Time-Series Analysis",
    version="1.0.0",
)

# -----------------------------------------------------
# CORS SETTINGS
# -----------------------------------------------------
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:5173",
    # Add deployed frontend URL later
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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
app.include_router(tasks.router, prefix="/tasks", tags=["Tasks"])
app.include_router(dashboard.router, prefix="/dashboard", tags=["Dashboard"])
app.include_router(analytics.router, prefix="/analytics", tags=["Analytics"])
app.include_router(ml.router, prefix="/ml", tags=["Machine Learning"])
app.include_router(focus.router, prefix="/focus", tags=["Focus Mode"])
app.include_router(user.router, prefix="/user", tags=["User"])


# -----------------------------------------------------
# ROOT ROUTE
# -----------------------------------------------------
@app.get("/")
def root():
    return {
        "message": "FocusFlow Backend is running 🚀",
        "status": "OK",
        "docs": "/docs",
        "redoc": "/redoc"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
