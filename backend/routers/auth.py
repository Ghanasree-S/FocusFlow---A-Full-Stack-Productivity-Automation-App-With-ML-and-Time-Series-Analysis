from fastapi import APIRouter, HTTPException, Depends, Header
from pydantic import BaseModel, EmailStr
from passlib.context import CryptContext
from jose import jwt
from bson import ObjectId
import os

from database.mongo import users_collection

router = APIRouter()

# -------------------------------------------------------------------
# CONFIG
# -------------------------------------------------------------------
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

SECRET_KEY = os.getenv("SECRET_KEY", "supersecret")
ALGORITHM = os.getenv("ALGORITHM", "HS256")


# -------------------------------------------------------------------
# PYDANTIC MODELS
# -------------------------------------------------------------------
class SignupPayload(BaseModel):
    name: str
    email: EmailStr
    password: str
    goal: str = "Balanced"


class LoginPayload(BaseModel):
    email: EmailStr
    password: str


# -------------------------------------------------------------------
# HELPERS
# -------------------------------------------------------------------
async def find_user_by_email(email: str):
    return await users_collection.find_one({"email": email})


def create_jwt(user_id: str):
    return jwt.encode({"sub": user_id}, SECRET_KEY, algorithm=ALGORITHM)


# -------------------------------------------------------------------
# SIGNUP
# -------------------------------------------------------------------
@router.post("/signup")
async def signup(payload: SignupPayload):

    existing = await find_user_by_email(payload.email)
    if existing:
        raise HTTPException(status_code=409, detail="Email already registered")

    hashed_pw = pwd_context.hash(payload.password)

    user_doc = {
        "name": payload.name,
        "email": payload.email,
        "hashed_password": hashed_pw,
        "style": payload.goal,
        "work_start": "09:00",
        "work_end": "17:00",
        "daily_goal_hours": 8,
        "avatar": "https://picsum.photos/200",
        "onboarding_complete": False
    }

    result = await users_collection.insert_one(user_doc)

    user_doc["id"] = str(result.inserted_id)
    token = create_jwt(user_doc["id"])

    return {"token": token, "user": user_doc}


# -------------------------------------------------------------------
# LOGIN
# -------------------------------------------------------------------
@router.post("/login")
async def login(payload: LoginPayload):

    user = await find_user_by_email(payload.email)

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if not pwd_context.verify(payload.password, user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_jwt(str(user["_id"]))

    return {
        "token": token,
        "user": {
            "id": str(user["_id"]),
            "name": user["name"],
            "email": user["email"],
            "style": user.get("style", "Balanced"),
            "avatar": user.get("avatar", None),
        }
    }


# -------------------------------------------------------------------
# AUTH MIDDLEWARE (THIS CAUSED YOUR ERROR)
# -------------------------------------------------------------------
@router.get("/verify")
async def verify_user(user_id: str = Depends(lambda authorization=Header(None): get_current_user_id(authorization))):
    return {"status": "valid", "user_id": user_id}


# -------------------------------------------------------------------
# FIXED & FINAL VERSION OF get_current_user_id
# -------------------------------------------------------------------
def get_current_user_id(authorization: str = Header(None)):
    """
    Extract user id from JWT in Authorization header.
    Accepts: Authorization: Bearer <token>
    """

    if not authorization:
        raise HTTPException(status_code=401, detail="Authorization header missing")

    # Extract token
    try:
        token = authorization.split(" ")[1]
    except:
        token = authorization  # token only (no Bearer)

    # Decode token
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")

        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid JWT payload")

        return user_id

    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
